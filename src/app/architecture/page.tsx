/**
 * /architecture — NEPA capabilities deep-dive.
 *
 * Server component: fetches `/api/nepa/runtime/health` once to seed the
 * live metrics. The client subcomponent polls every 5s. AuraCoach is
 * intentionally NOT mounted here — this is a docs surface.
 */
import { Suspense } from 'react'
import ArchitectureLive from './live'

export const dynamic = 'force-dynamic'
export const revalidate = 0

interface RuntimeHealth {
  ok: boolean
  uptime_sec?: number
  p95_ms?: number
  pipeline?: string
  [key: string]: unknown
}

async function getInitialHealth(): Promise<RuntimeHealth | null> {
  try {
    const base = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const r = await fetch(`${base}/api/nepa/runtime/health`, { cache: 'no-store' })
    if (!r.ok) return null
    return (await r.json()) as RuntimeHealth
  } catch {
    return null
  }
}

export default async function ArchitecturePage() {
  const initial = await getInitialHealth()
  return (
    <main
      style={{
        minHeight: '100dvh',
        padding: '64px 16px 48px',
        background: '#0d1117',
        color: '#e2e8f0',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      <section style={{ maxWidth: 980, margin: '0 auto' }}>
        <header style={{ marginBottom: 28 }}>
          <div
            style={{
              fontFamily: 'Geist Mono, monospace',
              fontSize: 11,
              color: '#22d3ee',
              letterSpacing: 0.6,
            }}
          >
            ARCHITECTURE · NEPA RUNTIME
          </div>
          <h1 style={{ fontSize: 32, marginTop: 4 }}>The closed perception-learning loop</h1>
          <p style={{ color: '#8899aa', maxWidth: 700 }}>
            Nine pipeline stages from MediaPipe ingest to STDP consolidation, signed every step
            with an Ed25519 audit chain. Live runtime metrics below pull from{' '}
            <code>/api/nepa/runtime/health</code>.
          </p>
        </header>

        <Suspense fallback={<div style={{ color: '#8899aa' }}>Loading runtime…</div>}>
          <ArchitectureLive initial={initial} />
        </Suspense>

        <Sections />
      </section>
    </main>
  )
}

function Section({
  title,
  tone,
  children,
}: {
  title: string
  tone: string
  children: React.ReactNode
}) {
  return (
    <section
      style={{
        marginTop: 28,
        padding: 18,
        border: '1px solid #2a3a52',
        borderRadius: 14,
        background: '#111827',
      }}
    >
      <div
        style={{
          fontFamily: 'Geist Mono, monospace',
          fontSize: 10,
          color: tone,
          letterSpacing: 0.6,
          marginBottom: 6,
        }}
      >
        {title.toUpperCase()}
      </div>
      <div style={{ color: '#cdd5e0', lineHeight: 1.55, fontSize: 14 }}>{children}</div>
    </section>
  )
}

function Sections() {
  return (
    <>
      <Section title="1 · MediaPipe ingest" tone="#22d3ee">
        Hands · Pose · FaceLandmarker run client-side at 30fps. Frames stream through
        WebCodecs to a single SharedArrayBuffer ring.
      </Section>
      <Section title="2 · Edge GPU adapter" tone="#22d3ee">
        Triton / gRPC / HTTP adapters live in <code>src/lib/runtime/*</code>. Failover order:
        triton → http → mock. P50 latency &lt; 34ms on Orin Nano.
      </Section>
      <Section title="3 · YOLOv8n object overlay" tone="#10b981">
        ONNX runtime web for in-browser preview; onboard Hailo for production drones.
      </Section>
      <Section title="4 · RODA · scoring + verdicts" tone="#10b981">
        Per-frame verdict produced by the RODA scoring kernel. Confidence + latency surfaced
        in the rehearse cockpit.
      </Section>
      <Section title="5 · VODA · world-model layer" tone="#a78bfa">
        SFSVC head predicts next-step state; surface anomalies inline to the coach.
      </Section>
      <Section title="6 · Ed25519 audit chain" tone="#a78bfa">
        Each verdict is signed + chained client-side; the bundle is dual-written to
        Supabase <code>nepa_audit</code> and the NEPA persistence path.
      </Section>
      <Section title="7 · Coach feedback" tone="#f59e0b">
        AuraCoach polls the coach service at 2s cadence with the latest KPI block. Stub
        mode keeps the UX alive without OpenRouter keys.
      </Section>
      <Section title="8 · STDP personal consolidation" tone="#f59e0b">
        Nursing+ tier · on-device STDP consolidates the trainee&apos;s drift over time.
      </Section>
      <Section title="9 · Tier policy + entitlements" tone="#22d3ee">
        Source of truth at <code>/api/v1/tier/me</code>. Frontend middleware enforces gates;
        Stripe webhook reconciles state in <code>user_plans</code>.
      </Section>
    </>
  )
}
