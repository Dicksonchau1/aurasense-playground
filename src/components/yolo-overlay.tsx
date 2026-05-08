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

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.width = videoWidth
    canvas.height = videoHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, videoWidth, videoHeight)

    for (const box of boxes) {
      const color = CLASS_COLORS[box.classId % CLASS_COLORS.length]
      const x = box.x1, y = box.y1
      const w = box.x2 - box.x1, h = box.y2 - box.y1

      ctx.strokeStyle = color
      ctx.lineWidth = 2
      ctx.strokeRect(x, y, w, h)

      // Label background
      const label = `${box.className} ${Math.round(box.confidence * 100)}%`
      ctx.font = 'bold 11px monospace'
      const textW = ctx.measureText(label).width
      ctx.fillStyle = color
      ctx.fillRect(x, Math.max(0, y - 16), textW + 6, 16)
      ctx.fillStyle = '#000'
      ctx.fillText(label, x + 3, Math.max(12, y - 3))
    }
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
