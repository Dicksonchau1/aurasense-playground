export const SKELETON_CONNECTIONS: [number, number][] = [
  [11, 12],
  [11, 13], [13, 15],
  [12, 14], [14, 16],
  [23, 24],
  [11, 23], [12, 24],
  [0, 2], [0, 5], [2, 7], [5, 8],
]

/** Draws pose skeleton. Caller must clearRect before calling. */
export function drawSkeleton(
  ctx: CanvasRenderingContext2D,
  landmarks: { x: number; y: number }[],
  width: number,
  height: number
) {
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
  ctx.fillStyle = '#10b981'
  for (const lm of landmarks) {
    if (!lm) continue
    ctx.beginPath()
    ctx.arc(lm.x * width, lm.y * height, 4, 0, Math.PI * 2)
    ctx.fill()
  }
}

/** Draws rule-of-thirds grid with ideal interview framing zone. */
export function drawFramingGrid(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
) {
  ctx.save()
  ctx.strokeStyle = 'rgba(16,185,129,0.2)'
  ctx.lineWidth = 1
  for (let i = 1; i <= 2; i++) {
    ctx.beginPath()
    ctx.moveTo(width * i / 3, 0)
    ctx.lineTo(width * i / 3, height)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(0, height * i / 3)
    ctx.lineTo(width, height * i / 3)
    ctx.stroke()
  }
  // Ideal interview framing: face in upper-center third
  ctx.strokeStyle = 'rgba(16,185,129,0.12)'
  ctx.setLineDash([5, 5])
  ctx.strokeRect(width * 0.3, height * 0.05, width * 0.4, height * 0.42)
  ctx.setLineDash([])
  ctx.restore()
}
