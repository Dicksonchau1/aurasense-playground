'use client'

import type { NepaDetection } from '@/lib/playground-types'

interface Props {
  detections?: NepaDetection[]
  /** Optional per-block latency in ms shown in HUD corner. */
  blockLatency?: Record<string, number>
  className?: string
}

const COLORS = ['#10b981', '#38bdf8', '#f59e0b', '#a78bfa', '#f472b6']

export function HudLayer({ detections = [], blockLatency, className }: Props) {
  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className={className ?? 'pointer-events-none absolute inset-0 h-full w-full'}
    >
      {detections.map((d, i) => {
        const [x, y, w, h] = d.bbox
        const color = COLORS[i % COLORS.length]
        return (
          <g key={`${d.cls}-${i}-${x}-${y}`}>
            <rect
              x={x * 100}
              y={y * 100}
              width={w * 100}
              height={h * 100}
              fill="none"
              stroke={color}
              strokeWidth={0.4}
              vectorEffect="non-scaling-stroke"
            />
            <text
              x={x * 100 + 0.6}
              y={y * 100 + 2.2}
              fontSize={2}
              fill={color}
              fontFamily="ui-monospace, SFMono-Regular, monospace"
            >
              {d.cls} · {(d.conf * 100).toFixed(0)}%
            </text>
          </g>
        )
      })}
      {blockLatency && Object.keys(blockLatency).length > 0 ? (
        <g transform="translate(1 97)">
          <text
            x={0}
            y={0}
            fontSize={1.6}
            fill="rgba(255,255,255,0.7)"
            fontFamily="ui-monospace, SFMono-Regular, monospace"
          >
            {Object.entries(blockLatency)
              .map(([k, v]) => `${k}:${v.toFixed(1)}ms`)
              .join('  ')}
          </text>
        </g>
      ) : null}
    </svg>
  )
}
