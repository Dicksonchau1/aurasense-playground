'use client'
import { useEffect, useState } from 'react'

export function useAudioSignals(
  stream: MediaStream | null,
  isActive: boolean
) {
  const [pacingScore, setPacingScore] = useState(75)

  useEffect(() => {
    if (!isActive || !stream) { setPacingScore(75); return }

    let ctx: AudioContext | null = null
    let analyser: AnalyserNode | null = null
    let frameId: number
    let running = true

    try {
      ctx = new AudioContext()
      const source = ctx.createMediaStreamSource(stream)
      analyser = ctx.createAnalyser()
      analyser.fftSize = 256
      source.connect(analyser)
      const data = new Uint8Array(analyser.frequencyBinCount)

      // Rolling volume window → pacing score
      const window: number[] = []
      const WIN = 40

      function tick() {
        if (!running || !analyser) return
        analyser.getByteFrequencyData(data)
        const rms = Math.sqrt(data.reduce((a, v) => a + v * v, 0) / data.length)
        window.push(rms)
        if (window.length > WIN) window.shift()
        // Variance in volume → steadier = higher pacing score
        const mean = window.reduce((a, v) => a + v, 0) / window.length
        const variance = window.reduce((a, v) => a + (v - mean) ** 2, 0) / window.length
        const score = Math.max(0, Math.min(100, 100 - variance * 0.4))
        setPacingScore(Math.round(score))
        frameId = requestAnimationFrame(tick)
      }
      tick()
    } catch {
      setPacingScore(75)
    }

    return () => {
      running = false
      cancelAnimationFrame(frameId)
      ctx?.close()
    }
  }, [isActive, stream])

  return { pacingScore }
}
