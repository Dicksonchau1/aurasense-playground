'use client'
import { useRef, useState, useCallback, useEffect } from 'react'
import type { Landmark } from '@/lib/signals'

export function usePose(videoRef: React.RefObject<HTMLVideoElement | null>, isActive: boolean) {
  const [landmarks, setLandmarks] = useState<Landmark[]>([])
  const poseLandmarkerRef = useRef<unknown>(null)
  const rafRef = useRef<number>(0)
  const lastFrameTime = useRef(0)
  const FPS_CAP = 30

  useEffect(() => {
    let cancelled = false
    async function initPose() {
      try {
        const { FilesetResolver, PoseLandmarker } = await import(
          /* webpackIgnore: true */
          // @ts-ignore
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.9/vision_bundle.mjs'
        )
        const vision = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.9/wasm'
        )
        const pose = await PoseLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task',
          },
          runningMode: 'VIDEO',
          numPoses: 1,
        })
        if (!cancelled) poseLandmarkerRef.current = pose
      } catch (e) {
        console.error('Failed to init MediaPipe pose:', e)
      }
    }
    initPose()
    return () => { cancelled = true }
  }, [])

  const loop = useCallback(() => {
    const video = videoRef.current
    const pose = poseLandmarkerRef.current as {
      detectForVideo: (v: HTMLVideoElement, ts: number) => { landmarks: { x: number; y: number; z: number; visibility?: number }[][] }
    } | null
    if (!video || !pose || video.readyState < 2) {
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
      const result = pose.detectForVideo(video, now)
      if (result.landmarks?.[0]) setLandmarks(result.landmarks[0])
      else setLandmarks([])
    } catch { /* ignore */ }
    rafRef.current = requestAnimationFrame(loop)
  }, [videoRef])

  useEffect(() => {
    if (isActive) rafRef.current = requestAnimationFrame(loop)
    else { cancelAnimationFrame(rafRef.current); setLandmarks([]) }
    return () => cancelAnimationFrame(rafRef.current)
  }, [isActive, loop])

  return { landmarks }
}
