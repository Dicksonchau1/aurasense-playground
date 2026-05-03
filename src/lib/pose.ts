import type { PoseLandmarkerResult } from '@mediapipe/tasks-vision'

export type { PoseLandmarkerResult }

export const SKELETON_CONNECTIONS: [number, number][] = [
  [11, 12], // shoulders
  [11, 13], [13, 15], // left arm
  [12, 14], [14, 16], // right arm
  [23, 24], // hips
  [11, 23], [12, 24], // shoulder-hip
  [0, 2], [0, 5], [2, 7], [5, 8], // face outline
]

export function drawSkeleton(
  ctx: CanvasRenderingContext2D,
  landmarks: { x: number; y: number }[],
  width: number,
  height: number
) {
  ctx.clearRect(0, 0, width, height)

  // Draw connections
  ctx.strokeStyle = '#10b981'
  ctx.lineWidth = 2
  for (const [a, b] of SKELETON_CONNECTIONS) {
    const lA = landmarks[a]
    const lB = landmarks[b]
    if (!lA || !lB) continue
    ctx.beginPath()
    ctx.moveTo(lA.x * width, lA.y * height)
    ctx.lineTo(lB.x * width, lB.y * height)
    ctx.stroke()
  }

  // Draw landmarks
  ctx.fillStyle = '#10b981'
  for (const lm of landmarks) {
    if (!lm) continue
    ctx.beginPath()
    ctx.arc(lm.x * width, lm.y * height, 4, 0, Math.PI * 2)
    ctx.fill()
  }
}
