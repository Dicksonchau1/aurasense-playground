'use client'
/**
 * Landing page after a successful Stripe Checkout redirect. Verifies the
 * subscription via `/api/billing/me`, shows a welcome message, then
 * redirects to `/rehearse`.
 */
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface BillingMe {
  ok: boolean
  plan: 'starter' | 'pro' | 'team' | 'enterprise'
  has_subscription?: boolean
}

export default function BillingSuccessPage() {
  const router = useRouter()
  const [me, setMe] = useState<BillingMe | null>(null)
  const [redirectIn, setRedirectIn] = useState<number>(2)

  useEffect(() => {
    let cancelled = false
    const fetchMe = async () => {
      try {
        const r = await fetch('/api/billing/me', { cache: 'no-store' })
        if (!r.ok) return
        const j = (await r.json()) as BillingMe
        if (!cancelled) setMe(j)
      } catch {
        /* swallow */
      }
    }
    fetchMe()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!me?.ok) return
    const t1 = setTimeout(() => setRedirectIn(1), 1000)
    const t2 = setTimeout(() => router.push('/rehearse'), 2000)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [me, router])

  return (
    <main
      style={{
        minHeight: '100dvh',
        display: 'grid',
        placeItems: 'center',
        background: '#0d1117',
        color: '#e2e8f0',
        fontFamily: 'Inter, system-ui, sans-serif',
        padding: 24,
      }}
    >
      <div
        style={{
          maxWidth: 480,
          padding: 28,
          border: '1px solid #10b981',
          borderRadius: 16,
          background: '#111827',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: 'rgba(16,185,129,0.15)',
            border: '2px solid #10b981',
            display: 'grid',
            placeItems: 'center',
            margin: '0 auto 12px',
            color: '#10b981',
            fontSize: 28,
          }}
        >
          ✓
        </div>
        <h1 style={{ fontSize: 22, margin: '0 0 6px' }}>
          Welcome to {me?.plan ? capitalize(me.plan) : 'AuraSense'} · tier unlocked
        </h1>
        <p style={{ color: '#8899aa', fontSize: 14 }}>
          Your subscription is active. Redirecting to{' '}
          <code style={{ color: '#22d3ee' }}>/rehearse</code> in {redirectIn}s…
        </p>
        <button
          type="button"
          onClick={() => router.push('/rehearse')}
          style={{
            marginTop: 14,
            padding: '8px 14px',
            border: '1px solid #10b981',
            background: 'rgba(16,185,129,0.12)',
            color: '#10b981',
            borderRadius: 10,
            cursor: 'pointer',
            fontSize: 13,
          }}
        >
          Go now →
        </button>
      </div>
    </main>
  )
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}
