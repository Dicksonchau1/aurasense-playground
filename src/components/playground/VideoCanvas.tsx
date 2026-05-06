'use client'

import { useEffect, useImperativeHandle, useRef, useState, forwardRef } from 'react'

export interface VideoCanvasHandle {
  start: () => Promise<void>
  stop: () => void
  getSlotId: () => string | null
}

interface Props {
  /** Server proxy that mints + forwards the SDP offer. */
  offerEndpoint?: string
  /** Server proxy that closes the slot. */
  closeEndpoint?: (slotId: string) => string
  /** Optional ICE servers; falls back to public STUN. */
  iceServers?: RTCIceServer[]
  onSlot?: (slotId: string) => void
  onState?: (state: RTCPeerConnectionState) => void
  onError?: (err: Error) => void
  className?: string
  children?: React.ReactNode
}

const DEFAULT_ICE: RTCIceServer[] = [{ urls: 'stun:stun.l.google.com:19302' }]

export const VideoCanvas = forwardRef<VideoCanvasHandle, Props>(function VideoCanvas(
  {
    offerEndpoint = '/api/edge/offer',
    closeEndpoint = (id) => `/api/edge/stream/${encodeURIComponent(id)}/close`,
    iceServers = DEFAULT_ICE,
    onSlot,
    onState,
    onError,
    className,
    children,
  },
  ref
) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const pcRef = useRef<RTCPeerConnection | null>(null)
  const localStreamRef = useRef<MediaStream | null>(null)
  const slotIdRef = useRef<string | null>(null)
  const [active, setActive] = useState(false)

  const teardown = () => {
    setActive(false)
    if (slotIdRef.current) {
      const slot = slotIdRef.current
      void fetch(closeEndpoint(slot), { method: 'POST' }).catch(() => {})
      slotIdRef.current = null
    }
    pcRef.current?.close()
    pcRef.current = null
    localStreamRef.current?.getTracks().forEach((t) => t.stop())
    localStreamRef.current = null
    if (videoRef.current) videoRef.current.srcObject = null
  }

  const start = async () => {
    try {
      teardown()

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 360 }, frameRate: { ideal: 30 } },
        audio: false,
      })
      localStreamRef.current = stream
      if (videoRef.current) videoRef.current.srcObject = stream

      const pc = new RTCPeerConnection({ iceServers })
      pcRef.current = pc
      pc.onconnectionstatechange = () => onState?.(pc.connectionState)
      stream.getTracks().forEach((t) => pc.addTrack(t, stream))

      const offer = await pc.createOffer({ offerToReceiveVideo: false, offerToReceiveAudio: false })
      await pc.setLocalDescription(offer)
      // Wait briefly for ICE gathering (non-trickle path).
      await new Promise<void>((res) => {
        if (pc.iceGatheringState === 'complete') return res()
        const t = setTimeout(res, 1500)
        pc.addEventListener('icegatheringstatechange', () => {
          if (pc.iceGatheringState === 'complete') {
            clearTimeout(t)
            res()
          }
        })
      })

      const localSdp = pc.localDescription
      if (!localSdp) throw new Error('failed to build local SDP')

      const resp = await fetch(offerEndpoint, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ sdp: localSdp.sdp, type: localSdp.type }),
      })
      if (!resp.ok) {
        const t = await resp.text().catch(() => '')
        throw new Error(`offer failed (${resp.status}): ${t.slice(0, 160)}`)
      }
      const answer = (await resp.json()) as { sdp?: string; type?: string; slot_id?: string; slotId?: string }
      const slot = answer.slot_id ?? answer.slotId ?? null
      if (!answer.sdp || !answer.type) throw new Error('malformed answer')
      await pc.setRemoteDescription({ sdp: answer.sdp, type: answer.type as RTCSdpType })

      slotIdRef.current = slot
      if (slot) onSlot?.(slot)
      setActive(true)
    } catch (err) {
      teardown()
      onError?.(err instanceof Error ? err : new Error(String(err)))
    }
  }

  useImperativeHandle(ref, () => ({
    start,
    stop: teardown,
    getSlotId: () => slotIdRef.current,
  }))

  useEffect(() => () => teardown(), [])

  return (
    <div className={className ?? 'relative aspect-video w-full overflow-hidden rounded-xl bg-black'}>
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="h-full w-full object-contain"
      />
      {!active ? (
        <div className="absolute inset-0 flex items-center justify-center text-xs uppercase tracking-[0.3em] text-white/40">
          camera idle
        </div>
      ) : null}
      {children}
    </div>
  )
})
