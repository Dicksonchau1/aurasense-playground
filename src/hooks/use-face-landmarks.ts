'use client'
import { useRef, useState, useCallback, useEffect } from 'react'
import React from 'react'

type IrisPoint = { x: number; y: number }

export function useFaceLandmarks(
  videoRef: React.RefObject<HTMLVideoElement | null>,
  isActive: boolean
) {
  const [irisLeft, setIrisLeft] = useState<IrisPoint | null>(null)
  const [irisRight, setIrisRight] = useState<IrisPoint | null>(null)
  const faceLandmarkerRef = useRef<unknown>(null)
  const rafRef = useRef<number>(0)
  const lastFrameTime = useRef(0)
  const FPS_CAP = 15

  useEffect(() => {
    let cancelled = false
    async function init() {
      try {
        const { FilesetResolver, FaceLandmarker } = await import(
          /* webpackIgnore: true */
          // @ts-ignore
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.9/vision_bundle.mjs'
        )
        const vision = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.9/wasm'
        )
        const faceLm = await FaceLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
          },
          runningMode: 'VIDEO',
          numFaces: 1,
          outputFaceBlendshapes: false,
        })
        if (!cancelled) faceLandmarkerRef.current = faceLm
      } catch (e) {
        // Falls back gracefully — gazeScoreFromIris uses pose-based estimate
        console.warn('FaceLandmarker init failed, using pose-based gaze fallback:', e)
      }
    }
    init()
    return () => { cancelled = true }
  }, [])

  const loop = useCallback(() => {
    const video = videoRef.current
    const face = faceLandmarkerRef.current as {
      detectForVideo: (v: HTMLVideoElement, ts: number) => {
        faceLandmarks: { x: number; y: number; z: number }[][]
      }
    } | null

    if (!video || !face || video.readyState < 2) {
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
      const result = face.detectForVideo(video, now)
      const lms = result.faceLandmarks?.[0]
      if (lms && lms.length > 477) {
        // Right iris: 468-472, Left iris: 473-477
        const rightIris = lms.slice(468, 473)
        const leftIris = lms.slice(473, 478)
        const avg = (pts: typeof rightIris) => ({
          x: pts.reduce((s, p) => s + p.x, 0) / pts.length,
          y: pts.reduce((s, p) => s + p.y, 0) / pts.length,
        })
        setIrisRight(avg(rightIris))
        setIrisLeft(avg(leftIris))
      }
    } catch { /* ignore */ }

    rafRef.current = requestAnimationFrame(loop)
  }, [videoRef])

  useEffect(() => {
    if (isActive) {
      rafRef.current = requestAnimationFrame(loop)
    } else {
      cancelAnimationFrame(rafRef.current)
      setIrisLeft(null)
      setIrisRight(null)
    }
    return () => cancelAnimationFrame(rafRef.current)
  }, [isActive, loop])

  return { irisLeft, irisRight }
}
