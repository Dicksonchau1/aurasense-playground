'use client'
import { useRef, useState, useEffect } from 'react'
import { createAudioAnalyser, getRMS, computePacingScore } from '@/lib/audio'

const WINDOW_SECONDS = 10
const FPS = 30

export function useAudioSignals(stream: MediaStream | null, isActive: boolean) {
  const [pacingScore, setPacingScore] = useState(75)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const cleanupRef = useRef<(() => void) | null>(null)
  const speechFrames = useRef<boolean[]>([])
  const rafRef = useRef<number>(0)

  useEffect(() => {
    if (!stream || !isActive) {
      cleanupRef.current?.()
      analyserRef.current = null
      cancelAnimationFrame(rafRef.current)
      setPacingScore(75)
      speechFrames.current = []
      return
    }
    const { analyser, cleanup } = createAudioAnalyser(stream)
    analyserRef.current = analyser
    cleanupRef.current = cleanup
    const maxFrames = WINDOW_SECONDS * FPS
    function tick() {
      if (!analyserRef.current) return
      const rms = getRMS(analyserRef.current)
      speechFrames.current.push(rms > 0.02)
      if (speechFrames.current.length > maxFrames) speechFrames.current.shift()
      const speechCount = speechFrames.current.filter(Boolean).length
      const ratio = speechCount / speechFrames.current.length
      setPacingScore(computePacingScore(ratio))
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => { cleanup(); cancelAnimationFrame(rafRef.current) }
  }, [stream, isActive])

  return { pacingScore }
}