'use client'
import { useEffect, useState, RefObject } from 'react'

export interface IrisPoint { x: number; y: number }

export function useFaceLandmarks(
  videoRef: RefObject<HTMLVideoElement>,
  isActive: boolean
) {
  const [irisLeft, setIrisLeft] = useState<IrisPoint | null>(null)
  const [irisRight, setIrisRight] = useState<IrisPoint | null>(null)

  useEffect(() => {
    if (!isActive) { setIrisLeft(null); setIrisRight(null); return }

    let running = true
    let frameId: number

    async function init() {
      try {
        const { FaceMesh } = await import('@mediapipe/face_mesh').catch(() => ({ FaceMesh: null }))
        if (!FaceMesh || !videoRef.current) return

        const faceMesh = new FaceMesh({
          locateFile: (file: string) =>
            `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
        })
        faceMesh.setOptions({ maxNumFaces: 1, refineLandmarks: true, minDetectionConfidence: 0.5 })
        faceMesh.onResults((results: any) => {
          const lm = results.multiFaceLandmarks?.[0]
          if (!lm) return
          // MediaPipe face mesh iris indices: left=468, right=473
          setIrisLeft(lm[468] ? { x: lm[468].x, y: lm[468].y } : null)
          setIrisRight(lm[473] ? { x: lm[473].x, y: lm[473].y } : null)
        })

        async function detect() {
          if (!running || !videoRef.current || videoRef.current.readyState < 2) {
            if (running) frameId = requestAnimationFrame(detect)
            return
          }
          await faceMesh.send({ image: videoRef.current })
          if (running) frameId = requestAnimationFrame(detect)
        }
        detect()
      } catch {
        // FaceMesh unavailable — gaze score uses fallback in signals lib
      }
    }

    init()
    return () => { running = false; cancelAnimationFrame(frameId) }
  }, [isActive, videoRef])

  return { irisLeft, irisRight }
}
