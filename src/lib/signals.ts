export type Landmark = { x: number; y: number; z: number; visibility?: number }

export function postureScore(lm: Landmark[]): number {
  const L = lm[11], R = lm[12]
  if (!L || !R) return 0
  const tilt = Math.abs(L.y - R.y)
  return Math.max(0, Math.min(100, 100 - tilt * 800))
}

export function framingScore(lm: Landmark[]): number {
  const nose = lm[0]
  if (!nose) return 0
  const dx = Math.abs(nose.x - 0.5)
  const dy = Math.abs(nose.y - 0.4)
  return Math.max(0, Math.min(100, 100 - (dx * 150 + dy * 150)))
}

export function gazeScore(lm: Landmark[]): number {
  const nose = lm[0], eyeL = lm[2], eyeR = lm[5]
  if (!nose || !eyeL || !eyeR) return 0
  const eyeMid = (eyeL.x + eyeR.x) / 2
  const yaw = Math.abs(nose.x - eyeMid)
  return Math.max(0, Math.min(100, 100 - yaw * 600))
}

export function envelope(lanes: { posture: number; gaze: number; framing: number; pacing: number }): number {
  const w = { posture: 0.3, gaze: 0.25, framing: 0.2, pacing: 0.25 }
  return Math.round(lanes.posture * w.posture + lanes.gaze * w.gaze + lanes.framing * w.framing + lanes.pacing * w.pacing)
}

export class ConsistencyTracker {
  private history: number[][] = []
  private maxLen = 90

  push(lanes: number[]): void {
    this.history.push(lanes)
    if (this.history.length > this.maxLen) this.history.shift()
  }

  score(): number {
    if (this.history.length < 30) return 100
    const cols = this.history[0].length
    const variances: number[] = []
    for (let c = 0; c < cols; c++) {
      const vals = this.history.map(r => r[c])
      const mean = vals.reduce((a, b) => a + b, 0) / vals.length
      variances.push(vals.reduce((a, b) => a + (b - mean) ** 2, 0) / vals.length)
    }
    const spread = Math.max(...variances) - Math.min(...variances)
    return Math.round(Math.max(0, Math.min(100, 100 - spread / 5)))
  }

  driftTrend(): number {
    if (this.history.length < 60) return 0
    const recent = this.history.slice(-30).flat()
    const prior = this.history.slice(-60, -30).flat()
    const avgR = recent.reduce((a, b) => a + b, 0) / recent.length
    const avgP = prior.reduce((a, b) => a + b, 0) / prior.length
    return Math.round(avgR - avgP)
  }
}