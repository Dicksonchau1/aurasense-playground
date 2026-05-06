'use client'
import React, { useRef, useState, useCallback } from 'react'

export function useRecording(
  videoRef: React.RefObject<HTMLVideoElement | null>,
  canvasRef: React.RefObject<HTMLCanvasElement | null>
) {
  const [isRecording, setIsRecording] = useState(false)
  const recorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const rafIdRef = useRef<number>(0)

  const startRecording = useCallback(() => {
    const video = videoRef.current
    const overlayCanvas = canvasRef.current
    if (!video || video.videoWidth === 0) return

    // Offscreen canvas composites video + skeleton overlay, mirrored to match live view
    const offscreen = document.createElement('canvas')
    offscreen.width = video.videoWidth
    offscreen.height = video.videoHeight
    const offCtx = offscreen.getContext('2d')!

    function composite() {
      offCtx.save()
      offCtx.translate(offscreen.width, 0)
      offCtx.scale(-1, 1)
      offCtx.drawImage(video!, 0, 0, offscreen.width, offscreen.height)
      offCtx.restore()
      if (overlayCanvas) {
        offCtx.save()
        offCtx.translate(offscreen.width, 0)
        offCtx.scale(-1, 1)
        offCtx.drawImage(overlayCanvas, 0, 0, offscreen.width, offscreen.height)
        offCtx.restore()
      }
      rafIdRef.current = requestAnimationFrame(composite)
    }
    rafIdRef.current = requestAnimationFrame(composite)

    const canvasStream = offscreen.captureStream(30)
    const audioTracks = (video.srcObject as MediaStream)?.getAudioTracks() ?? []
    audioTracks.forEach(t => canvasStream.addTrack(t))

    const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
      ? 'video/webm;codecs=vp9'
      : 'video/webm'

    const recorder = new MediaRecorder(canvasStream, { mimeType })
    chunksRef.current = []
    recorder.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data) }
    recorder.onstop = () => {
      cancelAnimationFrame(rafIdRef.current)
      const blob = new Blob(chunksRef.current, { type: 'video/webm' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `rehearse-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.webm`
      a.click()
      URL.revokeObjectURL(url)
    }
    recorder.start(1000)
    recorderRef.current = recorder
    setIsRecording(true)
  }, [videoRef, canvasRef])

  const stopRecording = useCallback(() => {
    recorderRef.current?.stop()
    recorderRef.current = null
    setIsRecording(false)
  }, [])

  return { isRecording, startRecording, stopRecording }
}
