'use client'
import { useEffect, useState, RefObject } from 'react'

export interface PoseLandmark {
  x: number
  y: number
  z: number
  visibility?: number
}

export function usePose(
  videoRef: RefObject<HTMLVideoElement>,
  isActive: boolean
) {
  const [landmarks, setLandmarks] = useState<PoseLandmark[]>([])

  useEffect(() => {
    if (!isActive) { setLandmarks([]); return }

    let frameId: number
    let running = true

    async function initPose() {
      try {
        // Dynamically load MediaPipe Pose if available, else use stub
        const { Pose } = await import('@mediapipe/pose').catch(() => ({ Pose: null }))
        if (!Pose || !videoRef.current) return

        const pose = new Pose({
          locateFile: (file: string) =>
            `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
        })
        pose.setOptions({ modelComplexity: 1, smoothLandmarks: true, minDetectionConfidence: 0.5 })
        pose.onResults((results: any) => {
          if (results.poseLandmarks) setLandmarks(results.poseLandmarks)
        })

        async function detect() {
          if (!running || !videoRef.current || videoRef.current.readyState < 2) {
            if (running) frameId = requestAnimationFrame(detect)
            return
          }
          await pose.send({ image: videoRef.current })
          if (running) frameId = requestAnimationFrame(detect)
        }
        detect()
      } catch {
        // MediaPipe not available — landmarks stay empty, scores use fallbacks
      }
    }

    initPose()
    return () => { running = false; cancelAnimationFrame(frameId) }
  }, [isActive, videoRef])

  return { landmarks }
}
