'use client'

import { useEffect, useRef, useState } from 'react'

interface Props {
  slotId: string | null
  /** Maximum samples retained for the sparkline. */
  windowSize?: number
}

interface Sample {
  t: number
  p50: number
  p95: number
}

export function LatencyMeter({ slotId, windowSize = 60 }: Props) {
  const [samples, setSamples] = useState<Sample[]>([])
  const [connected, setConnected] = useState(false)
  const esRef = useRef<EventSource | null>(null)

  useEffect(() => {
    esRef.current?.close()
    esRef.current = null
    setSamples([])
    setConnected(false)

    if (!slotId) return
    const es = new EventSource(`/api/edge/stream/${encodeURIComponent(slotId)}/events`)
    esRef.current = es

    es.onopen = () => setConnected(true)
    es.onerror = () => setConnected(false)
    es.onmessage = (ev) => {
      try {
        const payload = JSON.parse(ev.data) as { p50_ms?: number; p95_ms?: number }
        if (typeof payload.p50_ms !== 'number' || typeof payload.p95_ms !== 'number') return
        setSamples((prev) => {
          const next = [...prev, { t: Date.now(), p50: payload.p50_ms!, p95: payload.p95_ms! }]
          return next.length > windowSize ? next.slice(next.length - windowSize) : next
        })
      } catch {
        /* ignore non-json keepalives */
      }
    }
    return () => {
      es.close()
      esRef.current = null
    }
  }, [slotId, windowSize])

  const last = samples[samples.length - 1]
  const max = Math.max(50, ...samples.map((s) => s.p95))
  const w = 160
  const h = 36
  const dx = samples.length > 1 ? w / (samples.length - 1) : 0
  // Animated sparkline path
  const path = (key: 'p50' | 'p95') =>
    samples
      .map((s, i) => `${i === 0 ? 'M' : 'L'}${(i * dx).toFixed(2)} ${(h - (s[key] / max) * h).toFixed(2)}`)
      .join(' ')

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 shadow-lg" style={{boxShadow:'0 2px 16px 0 rgba(16,185,129,0.08)'}}>
      <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.25em] text-white/50">
        <span>Latency</span>
        <span className={connected ? 'text-emerald-400 animate-pulse' : 'text-white/30'}>{connected ? '● live' : '○ offline'}</span>
      </div>
      <div className="mt-2 flex items-baseline gap-4 font-mono text-white">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-white/40">p50</span>
          <span className="ml-1 text-lg">{last ? `${last.p50.toFixed(1)}ms` : '—'}</span>
        </div>
        <div>
          <span className="text-[10px] uppercase tracking-wider text-white/40">p95</span>
          <span className="ml-1 text-lg text-emerald-300">{last ? `${last.p95.toFixed(1)}ms` : '—'}</span>
        </div>
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} className="mt-2 h-9 w-full">
        {samples.length > 1 ? (
          <>
            <path d={path('p95')} stroke="#10b981" strokeWidth={2} fill="none" style={{filter:'drop-shadow(0 1px 2px #10b98188)'}}>
              <animate attributeName="d" dur="0.4s" to={path('p95')} fill="freeze" />
            </path>
            <path d={path('p50')} stroke="rgba(255,255,255,0.45)" strokeWidth={1.5} fill="none" style={{filter:'drop-shadow(0 1px 2px #fff4)'}}>
              <animate attributeName="d" dur="0.4s" to={path('p50')} fill="freeze" />
            </path>
          </>
        ) : (
          <text x={w / 2} y={h / 2} textAnchor="middle" fontSize={6} fill="rgba(255,255,255,0.3)">
            awaiting samples
          </text>
        )}
      </svg>
    </div>
  )
}
