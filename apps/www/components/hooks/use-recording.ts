'use client'
import { useRef, useState, useCallback, RefObject } from 'react'

export function useRecording(
  videoRef: RefObject<HTMLVideoElement>,
  canvasRef: RefObject<HTMLCanvasElement>
) {
  const [isRecording, setIsRecording] = useState(false)
  const recorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  const isSupported =
    typeof window !== 'undefined' && typeof MediaRecorder !== 'undefined'

  const startRecording = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    try {
      // Prefer canvas stream (has skeleton overlay), fallback to raw video stream
      const stream =
        (canvasRef.current as any)?.captureStream?.(30) ??
        (video as any).captureStream?.(30) ??
        (video.srcObject as MediaStream)
      if (!stream) return
      chunksRef.current = []
      const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' })
      recorder.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data) }
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `aura-rehearse-${Date.now()}.webm`
        a.click()
        URL.revokeObjectURL(url)
      }
      recorder.start(250)
      recorderRef.current = recorder
      setIsRecording(true)
    } catch (e) {
      console.error('Recording failed', e)
    }
  }, [videoRef, canvasRef])

  const stopRecording = useCallback(() => {
    recorderRef.current?.stop()
    recorderRef.current = null
    setIsRecording(false)
  }, [])

  return { isRecording, isSupported, startRecording, stopRecording }
}
