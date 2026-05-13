'use client'
import { useRef, useState, useCallback } from 'react'

export function useCamera() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isActive, setIsActive] = useState(false)

  const start = useCallback(async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      setStream(s)
      setError(null)
      if (videoRef.current) {
        videoRef.current.srcObject = s
        await videoRef.current.play()
      }
      setIsActive(true)
    } catch (e) {
      setError((e as Error).message ?? 'Camera access denied')
    }
  }, [])

  const stop = useCallback(() => {
    stream?.getTracks().forEach(t => t.stop())
    setStream(null)
    setIsActive(false)
    if (videoRef.current) videoRef.current.srcObject = null
  }, [stream])

  return { videoRef, stream, error, isActive, start, stop }
}
