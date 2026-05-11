/**
 * /welcome — single-screen onboarding.
 *
 * Resolves the current user's tier (Supabase cookie or `aurasense.tier`
 * fallback), shows a hero with the tier badge, and exposes a single
 * "Get Started" button that calls `/api/profile/onboarded` and routes
 * the user to their tier home.
 *
 * Auth-guarded by the global middleware — if you're here, you're signed in.
 */
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import Topbar from '@/components/topbar'
import WelcomeCta from './cta'
import type { TopbarTier } from '@/components/topbar'

export const dynamic = 'force-dynamic'

const TIER_COPY: Record<TopbarTier, { emoji: string; title: string; blurb: string; home: string }> = {
  free: {
    emoji: '🌐',
    title: 'Free tier',
    blurb: 'Try the playground — WHO handwash demo, sandbox drone, and 1 demo building.',
    home: '/playground',
  },
  nursing: {
    emoji: '🩺',
    title: 'Healthcare tier',
    blurb: 'Full rehearse cockpit unlocked — 7 scenarios, signed audit chain, AuraCoach.',
    home: '/rehearse',
  },
  enterprise: {
    emoji: '🛰️',
    title: 'Enterprise tier',
    blurb: 'Fleet ops, audit exports, and on-device STDP — your full operational stack.',
    home: '/drone',
  },
}

function tierFromCookie(value?: string | null): TopbarTier {
  if (value === 'nursing' || value === 'enterprise') return value
  return 'free'
}

export default async function WelcomePage() {
  const sb = await createClient()
  const { data } = await sb.auth.getUser()
  const user = data.user
  if (!user) redirect('/login?next=/welcome')

  const store = await cookies()
  const tier = tierFromCookie(store.get('aurasense.tier')?.value)
  const copy = TIER_COPY[tier]

  return (
    <main
      style={{
        minHeight: '100dvh',
        background: '#0d1117',
        color: '#e2e8f0',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      <Topbar tier={tier} />

      <section
        style={{
          maxWidth: 540,
          margin: '0 auto',
          padding: '64px 20px 40px',
        }}
      >
        <div
          style={{
            fontFamily: 'Geist Mono, monospace',
            fontSize: 11,
            color: '#22d3ee',
            letterSpacing: 0.6,
            marginBottom: 6,
          }}
        >
          WELCOME · {user.email}
        </div>
        <h1 style={{ fontSize: 30, margin: '0 0 8px', lineHeight: 1.2 }}>
          You&apos;re in. Let&apos;s calibrate your rig.
        </h1>
        <p style={{ color: '#8899aa', margin: 0 }}>
          AuraSense routes you to the right surface based on the email domain you signed in with.
        </p>

        <div
          style={{
            marginTop: 28,
            padding: 24,
            border: '1px solid #2a3a52',
            borderRadius: 16,
            background: '#111827',
          }}
        >
          <div style={{ fontSize: 36, marginBottom: 6 }} aria-hidden>
            {copy.emoji}
          </div>
          <div
            style={{
              fontFamily: 'Geist Mono, monospace',
              fontSize: 11,
              color: '#8899aa',
              letterSpacing: 0.5,
            }}
          >
            DETECTED TIER
          </div>
          <div style={{ fontSize: 22, fontWeight: 600, marginTop: 2 }}>{copy.title}</div>
          <p style={{ color: '#cdd5e0', marginTop: 8, lineHeight: 1.5, fontSize: 14 }}>
            {copy.blurb}
          </p>

          <WelcomeCta home={copy.home} />
        </div>

        <p style={{ marginTop: 18, fontSize: 12, color: '#4a5568' }}>
          Want a different plan?{' '}
          <a href="/pricing" style={{ color: '#22d3ee' }}>
            See pricing
          </a>
          .
        </p>
      </section>
    </main>
  )
}
