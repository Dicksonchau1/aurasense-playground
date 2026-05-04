'use client'
import React, { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

interface AuditRow {
  id: string
  pipeline: string
  source: string | null
  region: string | null
  image_sha256: string | null
  image_path: string | null
  detections: any
  world_model: any
  row_hash: string
  created_at: string
}

interface MeResponse {
  ok: boolean
  authenticated: boolean
  user?: { id: string; email: string }
  plan?: string
  status?: string
  quota?: any
  usage_today?: any
}

export default function Portal() {
  const params = useSearchParams()
  const router = useRouter()

  const [me, setMe] = useState<MeResponse | null>(null)
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [rows, setRows] = useState<AuditRow[]>([])

  // Fetch current user on mount + after auth callback
  useEffect(() => {
    fetch('/api/billing/me').then(r => r.json()).then(setMe).catch(() => setMe({ ok: false, authenticated: false }))
  }, [])

  // After authentication, if ?plan=pro was set on the URL, auto-checkout
  useEffect(() => {
    if (!me?.authenticated) return
    const plan = params.get('plan')
    if (plan === 'pro' || plan === 'team') {
      fetch('/api/billing/checkout', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ plan, annual: false }),
      })
        .then(r => r.json())
        .then(j => {
          if (j.ok && j.url) window.location.href = j.url
        })
        .catch(() => {})
    }
  }, [me, params])

  // Fetch audit rows when authenticated
  useEffect(() => {
    if (!me?.authenticated) return
    fetch('/api/quota/check').then(r => r.json()).then(j => {
      // also try fetching audit chain
      fetch('/api/billing/me').then(r => r.json()).then(setMe)
    })
    // separate fetch for audit rows would go here once we expose an endpoint
  }, [me?.authenticated])

  async function sendMagicLink(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setSubmitting(true)
    try {
      const { createClient } = await import('@/lib/supabase/client')
      const sb = createClient()
      const { error } = await sb.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${location.origin}/auth/callback?next=/portal${params.toString() ? '?' + params.toString() : ''}`,
        },
      })
      if (error) {
        alert('Sign-in error: ' + error.message)
      } else {
        setSent(true)
      }
    } catch (err) {
      alert('Sign-in failed: ' + (err as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  async function signOut() {
    try {
      const { createClient } = await import('@/lib/supabase/client')
      const sb = createClient()
      await sb.auth.signOut()
      setMe({ ok: false, authenticated: false })
      router.refresh()
    } catch {}
  }

  // ─── UI ─────────────────────────────────────────────
  return (
    <main className="min-h-dvh pt-16 pb-12 px-4" style={{ background: '#070e1a', color: 'white' }}>
      <section className="max-w-3xl mx-auto">
        <div className="mb-6">
          <p className="text-[10px] font-mono uppercase tracking-widest" style={{ color: '#10b981' }}>Portal</p>
          <h1 className="text-2xl font-bold mt-1">AuraSense account</h1>
        </div>

        {/* Loading */}
        {me === null && (
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>Loading…</p>
        )}

        {/* Not authenticated → sign-in form */}
        {me && !me.authenticated && !sent && (
          <div className="rounded-xl p-6 max-w-md"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(16,185,129,0.2)' }}>
            <p className="text-sm mb-4" style={{ color: 'rgba(255,255,255,0.75)' }}>
              Sign in with your email to access NEPA Pro features and your audit log.
            </p>
            <form onSubmit={sendMagicLink} className="space-y-3">
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@auras.ai"
                className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'white',
                }}
              />
              <button
                type="submit"
                disabled={submitting}
                className="w-full px-4 py-2 rounded-lg text-sm font-bold transition-opacity hover:opacity-90 disabled:opacity-50"
                style={{
                  background: 'rgba(16,185,129,0.18)',
                  border: '1px solid rgba(16,185,129,0.35)',
                  color: '#10b981',
                }}
              >
                {submitting ? 'Sending…' : 'Send magic link'}
              </button>
            </form>
            <p className="text-[10px] mt-3" style={{ color: 'rgba(255,255,255,0.4)' }}>
              We will email you a one-time link. No passwords. No tracking.
            </p>
          </div>
        )}

        {/* Magic link sent */}
        {me && !me.authenticated && sent && (
          <div className="rounded-xl p-6 max-w-md"
            style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.25)' }}>
            <p className="text-base font-bold mb-1" style={{ color: '#10b981' }}>📧 Check your inbox</p>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
              Sent a sign-in link to <strong>{email}</strong>. Open it on this device to continue.
            </p>
            {params.get('plan') && (
              <p className="text-[11px] mt-3" style={{ color: 'rgba(255,255,255,0.5)' }}>
                After you sign in, we will redirect you to Stripe checkout for the {params.get('plan')} plan.
              </p>
            )}
          </div>
        )}

        {/* Authenticated */}
        {me && me.authenticated && (
          <>
            <div className="rounded-xl p-4 mb-4 flex items-center justify-between"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(16,185,129,0.2)' }}>
              <div>
                <p className="text-sm font-semibold" style={{ color: 'white' }}>{me.user?.email}</p>
                <p className="text-[11px] mt-0.5" style={{ color: 'rgba(255,255,255,0.55)' }}>
                  Plan: <span style={{ color: '#10b981' }}>{me.plan?.toUpperCase()}</span>
                  {me.status && me.status !== 'active' && (
                    <span className="ml-2" style={{ color: '#f59e0b' }}>· {me.status}</span>
                  )}
                </p>
              </div>
              <button onClick={signOut}
                className="text-[11px] px-3 py-1.5 rounded-lg transition-opacity hover:opacity-80"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)' }}>
                Sign out
              </button>
            </div>

            <div className="rounded-xl p-4"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <p className="text-[10px] font-mono uppercase tracking-widest mb-2" style={{ color: 'rgba(16,185,129,0.7)' }}>
                Today's usage
              </p>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <p className="text-[9px] uppercase" style={{ color: 'rgba(255,255,255,0.4)' }}>Frames</p>
                  <p className="text-base font-mono font-bold" style={{ color: '#10b981' }}>
                    {me.usage_today?.frames ?? 0}
                    <span className="text-[10px] opacity-50">
                      {me.quota?.frames_per_day === -1 ? '' : ` / ${me.quota?.frames_per_day ?? '—'}`}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-[9px] uppercase" style={{ color: 'rgba(255,255,255,0.4)' }}>Videos</p>
                  <p className="text-base font-mono font-bold" style={{ color: '#10b981' }}>
                    {me.usage_today?.videos ?? 0}
                  </p>
                </div>
                <div>
                  <p className="text-[9px] uppercase" style={{ color: 'rgba(255,255,255,0.4)' }}>Bytes</p>
                  <p className="text-base font-mono font-bold" style={{ color: '#10b981' }}>
                    {((me.usage_today?.bytes ?? 0) / 1024 / 1024).toFixed(1)}MB
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-xl p-4"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <p className="text-sm font-semibold mb-2" style={{ color: 'white' }}>Need to upgrade or change billing?</p>
              <button
                onClick={async () => {
                  const r = await fetch('/api/billing/portal', { method: 'POST' })
                  const j = await r.json()
                  if (j.ok && j.url) window.location.href = j.url
                  else alert(j.error || 'Could not open billing portal')
                }}
                className="text-[12px] px-3 py-2 rounded-lg transition-opacity hover:opacity-90"
                style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', color: '#10b981' }}
              >
                Open Stripe billing portal →
              </button>
            </div>
          </>
        )}
      </section>
    </main>
  )
}
