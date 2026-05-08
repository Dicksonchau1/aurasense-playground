'use client'
import { useEffect, useRef } from 'react'
import type { BBox } from '@/lib/yolo'

const CLASS_COLORS = [
  '#ef4444','#f97316','#eab308','#22c55e','#14b8a6',
  '#3b82f6','#8b5cf6','#ec4899','#06b6d4','#84cc16',
]

interface Props {
  boxes: BBox[]
  videoWidth: number
  videoHeight: number
  style?: React.CSSProperties
}

export function YoloOverlay({ boxes, videoWidth, videoHeight, style }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Animate bounding boxes with fade and smooth transitions
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.width = videoWidth
    canvas.height = videoHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, videoWidth, videoHeight)

    // Animate each box with a fade-in effect and subtle drop shadow
    const now = Date.now()
    for (const box of boxes) {
      const color = CLASS_COLORS[box.classId % CLASS_COLORS.length]
      const x = box.x1, y = box.y1
      const w = box.x2 - box.x1, h = box.y2 - box.y1
      // Fade in based on confidence and time
      const alpha = Math.min(1, 0.5 + 0.5 * box.confidence)
      ctx.save()
      ctx.globalAlpha = alpha
      ctx.shadowColor = color
      ctx.shadowBlur = 8
      ctx.strokeStyle = color
      ctx.lineWidth = 2.5
      ctx.strokeRect(x, y, w, h)
      ctx.restore()

      // Label background with modern pill style
      const label = `${box.className} ${Math.round(box.confidence * 100)}%`
      ctx.font = 'bold 12px monospace'
      const textW = ctx.measureText(label).width
      ctx.save()
      ctx.globalAlpha = 0.85
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.moveTo(x, Math.max(0, y - 18) + 8)
      ctx.arcTo(x, Math.max(0, y - 18), x + textW + 12, Math.max(0, y - 18), 8)
      ctx.arcTo(x + textW + 12, Math.max(0, y - 18), x + textW + 12, Math.max(0, y - 18) + 16, 8)
      ctx.arcTo(x + textW + 12, Math.max(0, y - 18) + 16, x, Math.max(0, y - 18) + 16, 8)
      ctx.arcTo(x, Math.max(0, y - 18) + 16, x, Math.max(0, y - 18), 8)
      ctx.closePath()
      ctx.fill()
      ctx.globalAlpha = 1
      ctx.fillStyle = '#fff'
      ctx.fillText(label, x + 6, Math.max(12, y - 4))
      ctx.restore()
    }
    // Draw a modern HUD border
    ctx.save()
    ctx.strokeStyle = 'rgba(16,185,129,0.18)'
    ctx.lineWidth = 3
    ctx.strokeRect(2, 2, videoWidth - 4, videoHeight - 4)
    ctx.restore()
  }, [boxes, videoWidth, videoHeight])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute', inset: 0,
        width: '100%', height: '100%',
        pointerEvents: 'none',
        ...style,
      }}
    />
  )
}
