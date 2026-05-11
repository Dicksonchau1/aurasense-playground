'use client'
/**
 * Pricing-page client island — three cards (Free / Pro / Team), each with
 * a button that POSTs to `/api/billing/checkout`. The server-side
 * pricing-page wrapper is what computes the user's *current* plan; this
 * island just renders cards + handles the upgrade click.
 */
import { useState } from 'react'

type Plan = 'starter' | 'pro' | 'team' | 'enterprise' | undefined

interface Tier {
  key: 'free' | 'pro' | 'team'
  label: string
  price: string
  cadence: string
  color: string
  features: string[]
  cta: string
  /** plan key passed to /api/billing/checkout */
  checkoutPlan: 'pro' | 'team' | null
}

const TIERS: Tier[] = [
  {
    key: 'free',
    label: 'Free',
    price: '$0',
    cadence: 'forever',
    color: '#22d3ee',
    features: [
      'WHO handwash 30-sec demo',
      'Sandbox drone preview',
      '1 demo building (ICC)',
      'Watermarked share',
    ],
    cta: 'Use the playground',
    checkoutPlan: null,
  },
  {
    key: 'pro',
    label: 'Nursing',
    price: '$29',
    cadence: '/month',
    color: '#10b981',
    features: [
      'All 7 rehearse scenarios',
      'MediaPipe Hands + Pose',
      'Ed25519 signed audit chain',
      'AuraCoach realtime feedback',
      'Session history + replay',
    ],
    cta: 'Upgrade to Nursing',
    checkoutPlan: 'pro',
  },
  {
    key: 'team',
    label: 'Enterprise',
    price: '$99',
    cadence: '/month',
    color: '#a78bfa',
    features: [
      'Everything in Nursing',
      'Fleet ops + Kowloon map',
      'EMSD / HKCAD audit exports',
      'On-device STDP consolidation',
      'Air-gapped deploy option',
    ],
    cta: 'Upgrade to Enterprise',
    checkoutPlan: 'team',
  },
]

function isCurrent(tier: Tier, current: Plan): boolean {
  if (!current) return tier.key === 'free'
  if (current === 'starter') return tier.key === 'free'
  if (current === 'pro') return tier.key === 'pro'
  if (current === 'team' || current === 'enterprise') return tier.key === 'team'
  return false
}

export default function PricingCards({ current }: { current: Plan }) {
  const [pendingFor, setPendingFor] = useState<string | null>(null)
  const [err, setErr] = useState<string | null>(null)

  async function onUpgrade(plan: 'pro' | 'team') {
    setPendingFor(plan)
    setErr(null)
    try {
      const r = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ plan, annual: false }),
      })
      const j = (await r.json().catch(() => ({}))) as { url?: string; error?: string }
      if (!r.ok) throw new Error(j.error || `checkout failed (${r.status})`)
      if (!j.url) throw new Error('checkout did not return a URL')
      window.location.assign(j.url)
    } catch (e) {
      setErr((e as Error).message)
      setPendingFor(null)
    }
  }

  return (
    <>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 14,
        }}
      >
        {TIERS.map(t => {
          const active = isCurrent(t, current)
          const pending = pendingFor === t.checkoutPlan
          return (
            <article
              key={t.key}
              style={{
                padding: 20,
                border: `1px solid ${active ? t.color : '#2a3a52'}`,
                borderRadius: 14,
                background: '#111827',
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
                position: 'relative',
              }}
            >
              {active && (
                <span
                  style={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    padding: '2px 8px',
                    fontFamily: 'Geist Mono, monospace',
                    fontSize: 10,
                    letterSpacing: 0.5,
                    color: t.color,
                    border: `1px solid ${t.color}`,
                    borderRadius: 999,
                  }}
                >
                  CURRENT PLAN
                </span>
              )}
              <div
                style={{
                  fontFamily: 'Geist Mono, monospace',
                  fontSize: 11,
                  color: t.color,
                  letterSpacing: 0.5,
                }}
              >
                {t.label.toUpperCase()}
              </div>
              <div style={{ display: 'flex', gap: 4, alignItems: 'baseline' }}>
                <span style={{ fontSize: 30, fontWeight: 700 }}>{t.price}</span>
                <span style={{ fontSize: 12, color: '#8899aa' }}>{t.cadence}</span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: '#cdd5e0', fontSize: 13, lineHeight: 1.6 }}>
                {t.features.map(f => (
                  <li key={f} style={{ display: 'flex', gap: 8 }}>
                    <span style={{ color: t.color }}>·</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              {t.checkoutPlan ? (
                <button
                  type="button"
                  disabled={active || pending}
                  onClick={() => t.checkoutPlan && onUpgrade(t.checkoutPlan)}
                  style={{
                    marginTop: 6,
                    padding: '10px 14px',
                    background: active ? 'transparent' : t.color,
                    color: active ? t.color : '#0d1117',
                    border: `1px solid ${t.color}`,
                    borderRadius: 10,
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: active || pending ? 'default' : 'pointer',
                    opacity: pending ? 0.6 : 1,
                    transition: 'opacity 180ms cubic-bezier(0.16,1,0.3,1)',
                  }}
                >
                  {active ? 'Active' : pending ? 'Opening checkout…' : t.cta}
                </button>
              ) : (
                <a
                  href="/playground"
                  style={{
                    marginTop: 6,
                    padding: '10px 14px',
                    textAlign: 'center',
                    background: active ? 'transparent' : t.color,
                    color: active ? t.color : '#0d1117',
                    border: `1px solid ${t.color}`,
                    borderRadius: 10,
                    fontSize: 13,
                    fontWeight: 600,
                    textDecoration: 'none',
                  }}
                >
                  {active ? 'Active' : t.cta}
                </a>
              )}
            </article>
          )
        })}
      </div>
      {err && (
        <div
          role="alert"
          style={{
            marginTop: 14,
            padding: '8px 12px',
            border: '1px solid #f59e0b',
            borderRadius: 8,
            background: 'rgba(245,158,11,0.08)',
            color: '#f59e0b',
            fontSize: 13,
          }}
        >
          {err}
        </div>
      )}
    </>
  )
}
