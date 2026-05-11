'use client'
/**
 * Client island for /architecture — polls /api/nepa/runtime/health every 5s
 * and animates the values. Receives an initial server-fetched snapshot so
 * the first paint isn't a spinner.
 */
import { useEffect, useState } from 'react'

interface RuntimeHealth {
  ok: boolean
  uptime_sec?: number
  p95_ms?: number
  pipeline?: string
  [key: string]: unknown
}

interface Props {
  initial: RuntimeHealth | null
}

export default function ArchitectureLive({ initial }: Props) {
  const [health, setHealth] = useState<RuntimeHealth | null>(initial)
  const [updatedAt, setUpdatedAt] = useState<number>(Date.now())

  useEffect(() => {
    let stopped = false
    const tick = async () => {
      try {
        const r = await fetch('/api/nepa/runtime/health', { cache: 'no-store' })
        if (!r.ok) return
        const j = (await r.json()) as RuntimeHealth
        if (!stopped) {
          setHealth(j)
          setUpdatedAt(Date.now())
        }
      } catch {
        /* stay on last good value */
      }
    }
    const id = setInterval(tick, 5000)
    return () => {
      stopped = true
      clearInterval(id)
    }
  }, [])

  const ok = health?.ok ?? false
  const p95 = health?.p95_ms ?? '–'
  const uptime = health?.uptime_sec ?? '–'
  const pipeline = (health?.pipeline as string) ?? 'NEPA · RODA · VODA · SFSVC · core'

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: 12,
        marginBottom: 28,
      }}
    >
      <Stat label="Status" value={ok ? 'ONLINE' : 'OFFLINE'} color={ok ? '#10b981' : '#f59e0b'} />
      <Stat label="P95 inference" value={`${p95} ms`} color="#22d3ee" />
      <Stat label="Uptime" value={`${uptime}s`} color="#a78bfa" />
      <Stat label="Pipeline" value={pipeline} color="#cdd5e0" />
      <Stat
        label="Last updated"
        value={`${Math.round((Date.now() - updatedAt) / 1000)}s ago`}
        color="#8899aa"
      />
    </div>
  )
}

function Stat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div
      style={{
        padding: 12,
        border: '1px solid #2a3a52',
        borderRadius: 10,
        background: '#1a2332',
      }}
    >
      <div
        style={{
          fontFamily: 'Geist Mono, monospace',
          fontSize: 10,
          color: '#8899aa',
          letterSpacing: 0.4,
        }}
      >
        {label.toUpperCase()}
      </div>
      <div
        style={{
          marginTop: 4,
          fontFamily: 'Geist Mono, monospace',
          fontSize: 16,
          color,
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {value}
      </div>
    </div>
  )
}
