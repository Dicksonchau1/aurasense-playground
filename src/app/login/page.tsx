'use client'
export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErr(''); setBusy(true)
    const sb = createClient()
    const { error } = await sb.auth.signInWithPassword({ email, password })
    setBusy(false)
    if (error) { setErr(error.message); return }
    const params = new URLSearchParams(window.location.search)
    window.location.href = params.get('redirect') ?? '/'
  }

  return (
    <main style={{ minHeight: '100vh', background: '#070e1a', color: '#e6edf3', display: 'grid', placeItems: 'center', fontFamily: 'system-ui' }}>
      <form onSubmit={onSubmit} style={{ background: '#0d1117', border: '1px solid #30363d', borderRadius: 12, padding: 28, width: 360 }}>
        <p style={{ fontSize: 10, letterSpacing: 3, color: '#34d399', textTransform: 'uppercase', margin: 0 }}>AuraSense</p>
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: '6px 0 18px' }}>Sign in</h1>
        abel style={{ display: 'block', fontSize: 11, color: '#8b949e', marginBottom: 4 }}>Email</label>
        <input value={email} onChange={e => setEmail(e.target.value)} type="email" required style={{ width: '100%', padding: '10px 12px', background: '#161b22', border: '1px solid #30363d', borderRadius: 6, color: '#e6edf3', marginBottom: 12, fontSize: 13 }} />
        abel style={{ display: 'block', fontSize: 11, color: '#8b949e', marginBottom: 4 }}>Password</label>
        <input value={password} onChange={e => setPassword(e.target.value)} type="password" required style={{ width: '100%', padding: '10px 12px', background: '#161b22', border: '1px solid #30363d', borderRadius: 6, color: '#e6edf3', marginBottom: 16, fontSize: 13 }} />
        {err ? <p style={{ color: '#f85149', fontSize: 12, marginBottom: 12 }}>{err}</p> : null}
        <button type="submit" disabled={busy} style={{ width: '100%', padding: '10px', background: '#10b981', color: '#062017', border: 'none', borderRadius: 6, fontWeight: 700, cursor: busy ? 'wait' : 'pointer' }}>
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </main>
  )
}
