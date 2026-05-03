export function createAudioAnalyser(stream: MediaStream): {
  analyser: AnalyserNode
  cleanup: () => void
} {
  const ctx = new AudioContext()
  const source = ctx.createMediaStreamSource(stream)
  const analyser = ctx.createAnalyser()
  analyser.fftSize = 256
  source.connect(analyser)
  return {
    analyser,
    cleanup: () => ctx.close(),
  }
}

export function getRMS(analyser: AnalyserNode): number {
  const buf = new Float32Array(analyser.fftSize)
  analyser.getFloatTimeDomainData(buf)
  const sum = buf.reduce((acc, v) => acc + v * v, 0)
  return Math.sqrt(sum / buf.length)
}

export function computePacingScore(speechRatio: number): number {
  if (speechRatio < 0.4) {
    return Math.round(speechRatio / 0.4 * 50)
  } else if (speechRatio <= 0.7) {
    return Math.round(50 + ((speechRatio - 0.4) / 0.3) * 50)
  } else if (speechRatio <= 0.85) {
    return Math.round(100 - ((speechRatio - 0.7) / 0.15) * 30)
  } else {
    return Math.round(70 - ((speechRatio - 0.85) / 0.15) * 70)
  }
}