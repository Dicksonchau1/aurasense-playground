'use client'

import { useEffect, useRef, useState } from 'react'
import { VideoCanvas, type VideoCanvasHandle } from '@/components/playground/VideoCanvas'
import { HudLayer } from '@/components/playground/HudLayer'
import { BlockToggle } from '@/components/playground/BlockToggle'
import { LatencyMeter } from '@/components/playground/LatencyMeter'
import { PaywallModal } from '@/components/playground/PaywallModal'
import { ShareCard } from '@/components/playground/ShareCard'
import {
  FREE_BLOCKS,
  type NepaBlockKey,
  type NepaDetection,
} from '@/lib/playground-types'

interface BillingMe {
  ok: boolean
  authenticated: boolean
  plan: 'starter' | 'pro' | 'team' | 'enterprise'
}


import Link from 'next/link'
import { StatePill } from '@/components/ui/StatePill'
import { FallbackRibbon } from '@/components/ui/FallbackRibbon'

export default function PlaygroundPage() {
  // Platform-level status (could be extended with real backend health/KPI fetch)
  const [platformStatus] = useState<'live' | 'degraded' | 'offline'>('live')
  // Example: fallback message if backend is unreachable
  const [fallback, setFallback] = useState<string | null>(null)
  const [kpi, setKpi] = useState({
    sessions: 128,
    audits: 42,
    drones: 7,
    users: 23,
  })

  return (
    <main className="min-h-dvh bg-[#070e1a] px-4 py-8 text-white md:px-10">
      <div className="mx-auto max-w-5xl">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-emerald-400">
              AuraSense Platform
            </p>
            <h1 className="mt-1 text-3xl font-bold">Unified Intelligence Surfaces</h1>
            <p className="mt-1 text-sm text-white/60 max-w-xl">
              AuraStudio substrate below. Domain modules above. Enter a live surface to begin: clinical rehearsal, drone ops, or platform audit.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <StatePill status={platformStatus} />
          </div>
        </header>

        {/* Fallback ribbon for degraded/offline state */}
        {fallback && <FallbackRibbon message={fallback} status={platformStatus === 'offline' ? 'offline' : 'degraded'} />}

        {/* KPI/Status summary strip */}
        <div className="flex flex-wrap gap-4 mb-8">
          <div className="flex flex-col items-center">
            <span className="text-emerald-400 font-mono text-lg font-bold">{kpi.sessions}</span>
            <span className="text-[10px] uppercase tracking-widest text-white/40">Sessions</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-cyan-400 font-mono text-lg font-bold">{kpi.audits}</span>
            <span className="text-[10px] uppercase tracking-widest text-white/40">Audits</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-yellow-400 font-mono text-lg font-bold">{kpi.drones}</span>
            <span className="text-[10px] uppercase tracking-widest text-white/40">Drones</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-pink-400 font-mono text-lg font-bold">{kpi.users}</span>
            <span className="text-[10px] uppercase tracking-widest text-white/40">Users</span>
          </div>
        </div>

        {/* Live module cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Aura Rehearse Card */}
          <Link href="/rehearse" className="block rounded-2xl border border-emerald-700 bg-gradient-to-br from-emerald-900/60 to-emerald-950/80 p-6 shadow-lg hover:scale-[1.02] transition-transform">
            <div className="flex items-center gap-3 mb-2">
              <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-300">Aura Rehearse</span>
            </div>
            <h2 className="text-xl font-bold mb-1">Nursing Clinical Loop</h2>
            <p className="text-sm text-white/70 mb-2">Live scenario rehearsal with camera, pose, and audit chain. PolyU/HKU-ready.</p>
            <span className="inline-block mt-2 px-3 py-1 rounded-full bg-emerald-800/40 text-emerald-200 text-[10px] font-mono uppercase">Go to Rehearse →</span>
          </Link>

          {/* ATTAS SANDBOX Card */}
          <Link href="/drone" className="block rounded-2xl border border-cyan-700 bg-gradient-to-br from-cyan-900/60 to-cyan-950/80 p-6 shadow-lg hover:scale-[1.02] transition-transform">
            <div className="flex items-center gap-3 mb-2">
              <span className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-xs font-mono uppercase tracking-widest text-cyan-300">ATTAS SANDBOX</span>
            </div>
            <h2 className="text-xl font-bold mb-1">Enterprise Drone Console</h2>
            <p className="text-sm text-white/70 mb-2">Live telemetry, compliance, and mission overlays. Vendor-agnostic substrate.</p>
            <span className="inline-block mt-2 px-3 py-1 rounded-full bg-cyan-800/40 text-cyan-200 text-[10px] font-mono uppercase">Go to Drone →</span>
          </Link>
        </div>

        {/* Platform audit and other modules can be added here as real features only */}
      </div>
    </main>
  )
}
