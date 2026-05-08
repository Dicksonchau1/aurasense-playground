'use client'
import { useRef, useState, useCallback } from 'react'

async function getStream(constraints: MediaStreamConstraints): Promise<MediaStream> {
  return navigator.mediaDevices.getUserMedia(constraints)
}

export function useCamera() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isActive, setIsActive] = useState(false)

  const start = useCallback(async () => {
    setError(null)
    try {
      // Use 'ideal' constraints — exact values throw OverconstrainedError on iOS Safari
      let s: MediaStream
      try {
        s = await getStream({
          video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: true,
        })
      } catch (firstErr) {
        // Fallback: drop resolution constraints entirely (handles strict iOS cameras)
        if (
          firstErr instanceof Error &&
          (firstErr.name === 'OverconstrainedError' || firstErr.name === 'ConstraintNotSatisfiedError')
        ) {
          s = await getStream({ video: { facingMode: 'user' }, audio: true })
        } else {
          throw firstErr
        }
      }
      if (videoRef.current) {
        videoRef.current.srcObject = s
        // play() on iOS Safari requires the video element to have playsInline + muted
        await videoRef.current.play().catch(() => {/* autoplay policy: handled by user gesture */})
      }
      setStream(s)
      setIsActive(true)
    } catch (err) {
      const name = err instanceof Error ? err.name : ''
      const msg = err instanceof Error ? err.message : 'Camera access denied'
      if (name === 'NotAllowedError' || name === 'PermissionDeniedError') {
        setError('Camera permission denied. Allow access in your browser settings.')
      } else if (name === 'NotFoundError' || name === 'DevicesNotFoundError') {
        setError('No camera found on this device.')
      } else {
        setError(msg)
      }
    }
  }, [])

  const stop = useCallback(() => {
    if (stream) stream.getTracks().forEach(t => t.stop())
    if (videoRef.current) videoRef.current.srcObject = null
    setStream(null)
    setIsActive(false)
  }, [stream])

  return { videoRef, stream, error, isActive, start, stop }
}
