'use client'
import React, { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

// Force dynamic rendering — prevents prerender errors with useSearchParams
export const dynamic = 'force-dynamic'

function PortalInner() {
  const params = useSearchParams()
  const [me, setMe] = useState<any>(null)
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  useEffect(() => {
    fetch('/api/billing/me')
      .then(r => r.json())
      .then(setMe)
      .catch(() => setMe({ ok: false, authenticated: false }))
  }, [])

  async function sendMagicLink(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    try {
      const { createClient } = await import('@/lib/supabase/client')
      const sb = createClient()
      const { error } = await sb.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${location.origin}/auth/callback?next=/portal` },
      })
      if (error) alert(error.message)
      else setSent(true)
    } catch (err) {
      alert('Sign-in failed: ' + (err as Error).message)
    }
  }

  async function signOut() {
    const { createClient } = await import('@/lib/supabase/client')
    await createClient().auth.signOut()
    setMe({ ok: false, authenticated: false })
  }

  if (me === null) {
    return <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>Loading…</p>
  }

  if (!me.authenticated && !sent) {
    return (
      <div className="rounded-xl p-6 max-w-md"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(16,185,129,0.2)' }}>
        <p className="text-sm mb-4" style={{ color: 'rgba(255,255,255,0.75)' }}>
          Sign in to access NEPA Pro and your audit log.
        </p>
        <form onSubmit={sendMagicLink} className="space-y-3">
          <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
            placeholder="you@auras.ai"
            className="w-full px-3 py-2 rounded-lg text-sm outline-none"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }} />
          <button type="submit"
            className="w-full px-4 py-2 rounded-lg text-sm font-bold"
            style={{ background: 'rgba(16,185,129,0.18)', border: '1px solid rgba(16,185,129,0.35)', color: '#10b981' }}>
            Send magic link
          </button>
        </form>
      </div>
    )
  }

  if (!me.authenticated && sent) {
    return (
      <div className="rounded-xl p-6 max-w-md"
        style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.25)' }}>
        <p className="text-base font-bold mb-1" style={{ color: '#10b981' }}>Check your inbox</p>
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
          Sign-in link sent to <strong>{email}</strong>.
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="rounded-xl p-4 mb-4 flex items-center justify-between"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(16,185,129,0.2)' }}>
        <div>
          <p className="text-sm font-semibold">{me.user?.email}</p>
          <p className="text-[11px] mt-0.5" style={{ color: 'rgba(255,255,255,0.55)' }}>
            Plan: <span style={{ color: '#10b981' }}>{me.plan?.toUpperCase()}</span>
          </p>
        </div>
        <button onClick={signOut} className="text-[11px] px-3 py-1.5 rounded-lg"
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
    </>
  )
}

export default function Portal() {
  return (
    <main className="min-h-dvh pt-16 pb-12 px-4" style={{ background: '#070e1a', color: 'white' }}>
      <section className="max-w-3xl mx-auto">
        <div className="mb-6">
          <p className="text-[10px] font-mono uppercase tracking-widest" style={{ color: '#10b981' }}>Portal</p>
          <h1 className="text-2xl font-bold mt-1">AuraSense account</h1>
        </div>
        <Suspense fallback={<p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>Loading…</p>}>
          <PortalInner />
        </Suspense>
      </section>
    </main>
  )
}
