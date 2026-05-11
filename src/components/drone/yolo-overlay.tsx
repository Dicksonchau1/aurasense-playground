'use client'
/**
 * Minimal typed YOLO-detection overlay. Renders each bounding box as an
 * absolutely-positioned div scaled to the video's natural dimensions.
 * Pure presentation — coordinate math only.
 */
import type { CSSProperties } from 'react'
import type { BBox } from '@/lib/yolo'

export interface YoloOverlayProps {
  boxes: BBox[]
  videoWidth: number
  videoHeight: number
  style?: CSSProperties
}

export function YoloOverlay({ boxes, videoWidth, videoHeight, style }: YoloOverlayProps) {
  if (!videoWidth || !videoHeight) return null
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        ...style,
      }}
    >
      {boxes.map((b, i) => {
        const left = (b.x1 / videoWidth) * 100
        const top = (b.y1 / videoHeight) * 100
        const width = ((b.x2 - b.x1) / videoWidth) * 100
        const height = ((b.y2 - b.y1) / videoHeight) * 100
        return (
          <div
            key={`${b.classId}-${i}`}
            style={{
              position: 'absolute',
              left: `${left}%`,
              top: `${top}%`,
              width: `${width}%`,
              height: `${height}%`,
              border: '1.5px solid #22d3ee',
              borderRadius: 2,
              fontFamily: 'Geist Mono, monospace',
              fontSize: 10,
              color: '#0d1117',
            }}
          >
            <span
              style={{
                position: 'absolute',
                top: -14,
                left: 0,
                padding: '1px 4px',
                background: '#22d3ee',
                fontSize: 9,
                lineHeight: 1.2,
                whiteSpace: 'nowrap',
              }}
            >
              {b.className} {(b.confidence * 100).toFixed(0)}
            </span>
          </div>
        )
      })}
    </div>
  )
}
