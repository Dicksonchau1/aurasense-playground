'use client'

import type { NepaDetection } from '@/lib/playground-types'

interface Props {
  detections?: NepaDetection[]
  /** Optional per-block latency in ms shown in HUD corner. */
  blockLatency?: Record<string, number>
  className?: string
}

const COLORS = ['#10b981', '#38bdf8', '#f59e0b', '#a78bfa', '#f472b6']

import { useEffect, useRef } from 'react'

export function HudLayer({ detections = [], blockLatency, className }: Props) {
  const svgRef = useRef<SVGSVGElement>(null)
  // Animate overlays with fade and pulse
  useEffect(() => {
    if (!svgRef.current) return
    svgRef.current.animate([
      { opacity: 0.7, filter: 'blur(0.5px)' },
      { opacity: 1, filter: 'blur(0px)' }
    ], {
      duration: 350,
      fill: 'forwards',
      easing: 'cubic-bezier(0.4,0,0.2,1)'
    })
  }, [detections])
  return (
    <svg
      ref={svgRef}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className={className ?? 'pointer-events-none absolute inset-0 h-full w-full'}
      style={{ zIndex: 10 }}
    >
      {detections.map((d, i) => {
        const [x, y, w, h] = d.bbox
        const color = COLORS[i % COLORS.length]
        const pulse = 0.7 + 0.3 * Math.sin(Date.now() / 300 + i)
        return (
          <g key={`${d.cls}-${i}-${x}-${y}`}
            style={{ opacity: pulse, filter: `drop-shadow(0 0 2px ${color}88)` }}>
            <rect
              x={x * 100}
              y={y * 100}
              width={w * 100}
              height={h * 100}
              fill="none"
              stroke={color}
              strokeWidth={0.7}
              vectorEffect="non-scaling-stroke"
              rx={2}
            />
            <text
              x={x * 100 + 0.6}
              y={y * 100 + 2.2}
              fontSize={2.2}
              fill={color}
              fontFamily="ui-monospace, SFMono-Regular, monospace"
              style={{ fontWeight: 700, filter: `drop-shadow(0 1px 2px #0008)` }}
            >
              {d.cls} · {(d.conf * 100).toFixed(0)}%
            </text>
          </g>
        )
      })}
      {/* Modern HUD border */}
      <rect x={1} y={1} width={98} height={98} rx={4} fill="none" stroke="rgba(16,185,129,0.18)" strokeWidth={1.2} />
      {blockLatency && Object.keys(blockLatency).length > 0 ? (
        <g transform="translate(1 97)">
          <text
            x={0}
            y={0}
            fontSize={1.7}
            fill="rgba(255,255,255,0.7)"
            fontFamily="ui-monospace, SFMono-Regular, monospace"
            style={{ fontWeight: 600 }}
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
