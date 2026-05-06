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

export default function PlaygroundPage() {
  const canvasRef = useRef<VideoCanvasHandle>(null)
  const [slotId, setSlotId] = useState<string | null>(null)
  const [pcState, setPcState] = useState<RTCPeerConnectionState>('new')
  const [error, setError] = useState<string | null>(null)
  const [active, setActive] = useState<NepaBlockKey[]>([...FREE_BLOCKS])
  const [billing, setBilling] = useState<BillingMe | null>(null)
  const [detections, setDetections] = useState<NepaDetection[]>([])
  const [lastP95, setLastP95] = useState<number | null>(null)
  const [paywallFor, setPaywallFor] = useState<NepaBlockKey | null>(null)

  // Hydrate plan from existing /api/billing/me.
  useEffect(() => {
    let dead = false
    fetch('/api/billing/me')
      .then((r) => r.json() as Promise<BillingMe>)
      .then((b) => { if (!dead) setBilling(b) })
      .catch(() => {})
    return () => { dead = true }
  }, [])

  // Subscribe to detections via the same SSE stream the LatencyMeter uses.
  useEffect(() => {
    if (!slotId) return
    const es = new EventSource(`/api/edge/stream/${encodeURIComponent(slotId)}/events`)
    es.onmessage = (ev) => {
      try {
        const payload = JSON.parse(ev.data) as {
          p95_ms?: number
          detections?: NepaDetection[]
        }
        if (Array.isArray(payload.detections)) setDetections(payload.detections)
        if (typeof payload.p95_ms === 'number') setLastP95(payload.p95_ms)
      } catch { /* ignore */ }
    }
    return () => es.close()
  }, [slotId])

  // Push block-chain changes to the edge.
  useEffect(() => {
    if (!slotId) return
    void fetch(`/api/edge/stream/${encodeURIComponent(slotId)}/control`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ chain: active }),
    }).catch(() => {})
  }, [active, slotId])

  const isFree = !billing?.authenticated || billing.plan === 'starter'
  const planLabel = billing?.plan ?? 'starter'

  const startStream = async () => {
    setError(null)
    if (!canvasRef.current) return
    await canvasRef.current.start()
  }
  const stopStream = () => canvasRef.current?.stop()

  return (
    <main className="min-h-dvh bg-[#070e1a] px-4 py-8 text-white md:px-10">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-emerald-400">
              AuraSense · Playground
            </p>
            <h1 className="mt-1 text-3xl font-bold">Live NEPA inference</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-white/70">
              plan · {planLabel}
            </span>
            <span className={`rounded-full border px-3 py-1 text-[10px] font-mono uppercase tracking-wider ${
              pcState === 'connected'
                ? 'border-emerald-400/40 bg-emerald-400/10 text-emerald-300'
                : 'border-white/10 bg-white/[0.04] text-white/50'
            }`}>
              webrtc · {pcState}
            </span>
          </div>
        </header>

        <section className="mt-6 grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-4">
            <VideoCanvas
              ref={canvasRef}
              onSlot={setSlotId}
              onState={setPcState}
              onError={(e) => setError(e.message)}
            >
              <HudLayer detections={detections} />
            </VideoCanvas>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={startStream}
                className="rounded-lg bg-emerald-500 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#062017] hover:bg-emerald-400"
              >
                Start webcam
              </button>
              <button
                type="button"
                onClick={stopStream}
                className="rounded-lg border border-white/10 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white/70 hover:bg-white/5"
              >
                Stop
              </button>
              {error ? (
                <span className="self-center text-xs text-rose-400">{error}</span>
              ) : null}
            </div>

            <BlockToggle
              active={active}
              isFree={isFree}
              onToggle={(b, next) =>
                setActive((cur) => (next ? Array.from(new Set([...cur, b])) : cur.filter((x) => x !== b)))
              }
              onPaywall={(b) => setPaywallFor(b)}
            />
          </div>

          <aside className="space-y-4">
            <LatencyMeter slotId={slotId} />
            <ShareCard
              title="NEPA live"
              subtitle={`${active.length} block${active.length === 1 ? '' : 's'} active · plan ${planLabel}`}
              p95Ms={lastP95}
              blocks={active}
            />
          </aside>
        </section>
      </div>

      <PaywallModal
        open={paywallFor != null}
        reasonBlock={paywallFor}
        onClose={() => setPaywallFor(null)}
      />
    </main>
  )
}
