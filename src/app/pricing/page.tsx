/**
 * /pricing — three-card layout. Public route (no auth required).
 *
 * The "Upgrade" buttons POST to the existing `/api/billing/checkout`
 * endpoint and redirect to the returned Stripe Checkout URL. The
 * checkout endpoint is already wired to the Stripe webhook that flips
 * `user_plans.plan` and triggers the /billing/success → tier-home flow.
 */
import Topbar from '@/components/topbar'
import { createClient } from '@/lib/supabase/server'
import PricingCards from './cards'

export const dynamic = 'force-dynamic'

interface MePlan {
  ok: boolean
  plan?: 'starter' | 'pro' | 'team' | 'enterprise'
}

async function getCurrentPlan(): Promise<MePlan['plan']> {
  try {
    const sb = await createClient()
    const { data } = await sb.auth.getUser()
    if (!data.user) return undefined
    const { admin } = await import('@/lib/supabase/admin')
    const { planForUser } = await import('@/lib/billing/plans')
    const { data: row } = await admin()
      .from('user_plans')
      .select('plan')
      .eq('user_id', data.user.id)
      .maybeSingle()
    return planForUser(row?.plan)
  } catch {
    return undefined
  }
}

export default async function PricingPage({
  searchParams,
}: {
  searchParams: Promise<{ upsell?: string }>
}) {
  const current = await getCurrentPlan()
  const params = await searchParams
  return (
    <main
      style={{
        minHeight: '100dvh',
        background: '#0d1117',
        color: '#e2e8f0',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      <Topbar tier={current === 'pro' || current === 'team' ? 'nursing' : current === 'enterprise' ? 'enterprise' : 'free'} />

      <section style={{ maxWidth: 1024, margin: '0 auto', padding: '48px 20px 64px' }}>
        <header style={{ marginBottom: 28 }}>
          <div
            style={{
              fontFamily: 'Geist Mono, monospace',
              fontSize: 11,
              color: '#22d3ee',
              letterSpacing: 0.6,
            }}
          >
            PRICING · v0.10.0-beta
          </div>
          <h1 style={{ fontSize: 30, margin: '4px 0 8px' }}>
            Three tiers. One signed-audit chain.
          </h1>
          <p style={{ color: '#8899aa', maxWidth: 640 }}>
            Free is unlimited for the WHO handwash demo. Nursing unlocks the full rehearse
            cockpit. Enterprise unlocks fleet ops + audit exports.
          </p>
          {params.upsell && (
            <div
              style={{
                marginTop: 14,
                padding: '8px 12px',
                border: '1px solid #f59e0b',
                borderRadius: 8,
                background: 'rgba(245,158,11,0.08)',
                color: '#f59e0b',
                fontSize: 13,
                maxWidth: 540,
              }}
            >
              Upgrade required to unlock <code>{params.upsell}</code>.
            </div>
          )}
        </header>

        <PricingCards current={current} />

        <section
          style={{
            marginTop: 40,
            padding: 20,
            border: '1px solid #2a3a52',
            borderRadius: 14,
            background: '#111827',
          }}
        >
          <div
            style={{
              fontFamily: 'Geist Mono, monospace',
              fontSize: 11,
              color: '#10b981',
              letterSpacing: 0.5,
              marginBottom: 6,
            }}
          >
            INCLUDED ON PRO+ · AURACOACH
          </div>
          <h2 style={{ fontSize: 18, margin: '0 0 6px' }}>
            Realtime feedback agent for every scenario
          </h2>
          <p style={{ color: '#cdd5e0', lineHeight: 1.55, fontSize: 14, margin: 0 }}>
            AuraCoach polls the NEPA <code>coach_feedback</code> service every 2 seconds with
            your current KPI block. Severity-coded cues, on-device Web Speech for voice, and
            an ElevenLabs-streamed path for production deployments.
          </p>
        </section>
      </section>
    </main>
  )
}
