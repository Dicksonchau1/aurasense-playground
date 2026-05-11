'use client'
import { useRef, useState, useCallback, useEffect } from 'react'

export interface HandPoint {
  x: number
  y: number
  z: number
}

export type HandLandmarks = HandPoint[]

/**
 * MediaPipe Hands hook — mirror of `use-pose.ts` but for the
 * 21-point hand landmarker. Returns up to two hands, each 21 normalized
 * x/y/z points. Quiet on init failure (returns empty arrays).
 */
export function useHands(
  videoRef: React.RefObject<HTMLVideoElement | null>,
  isActive: boolean
) {
  const [hands, setHands] = useState<HandLandmarks[]>([])
  const handLandmarkerRef = useRef<unknown>(null)
  const rafRef = useRef<number>(0)
  const lastFrameTime = useRef(0)
  const FPS_CAP = 30

  useEffect(() => {
    let cancelled = false
    async function initHands() {
      try {
        const { FilesetResolver, HandLandmarker } = await import(
          /* webpackIgnore: true */
          // @ts-ignore - CDN dynamic ESM import
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.9/vision_bundle.mjs'
        )
        const vision = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.9/wasm'
        )
        const hl = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
          },
          runningMode: 'VIDEO',
          numHands: 2,
        })
        if (!cancelled) handLandmarkerRef.current = hl
      } catch (e) {
        console.error('Failed to init MediaPipe hands:', e)
      }
    }
    initHands()
    return () => {
      cancelled = true
    }
  }, [])

  const loop = useCallback(() => {
    const video = videoRef.current
    const hl = handLandmarkerRef.current as {
      detectForVideo: (
        v: HTMLVideoElement,
        ts: number
      ) => { landmarks: { x: number; y: number; z: number }[][] }
    } | null
    if (!video || !hl || video.readyState < 2) {
      rafRef.current = requestAnimationFrame(loop)
      return
    }
    const now = performance.now()
    if (now - lastFrameTime.current < 1000 / FPS_CAP) {
      rafRef.current = requestAnimationFrame(loop)
      return
    }
    lastFrameTime.current = now
    try {
      const result = hl.detectForVideo(video, now)
      if (result.landmarks && result.landmarks.length > 0) {
        setHands(result.landmarks.slice(0, 2))
      } else {
        setHands([])
      }
    } catch {
      /* ignore */
    }
    rafRef.current = requestAnimationFrame(loop)
  }, [videoRef])

  useEffect(() => {
    if (isActive) {
      rafRef.current = requestAnimationFrame(loop)
    } else {
      cancelAnimationFrame(rafRef.current)
      setHands([])
    }
    return () => cancelAnimationFrame(rafRef.current)
  }, [isActive, loop])

  return { hands }
}
