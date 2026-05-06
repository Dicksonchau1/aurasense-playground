'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Mail, Globe } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function sendMagicLink(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError('')
    const sb = createClient()
    const { error: err } = await sb.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    })
    setLoading(false)
    if (err) { setError(err.message); return }
    setSent(true)
  }

  async function signInWithGoogle() {
    setError('')
    const sb = createClient()
    const { error: err } = await sb.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
    if (err) setError(err.message)
  }

  return (
    <div style={{
      minHeight: 'calc(100dvh - 3rem)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px 16px',
    }}>
      <div style={{
        width: '100%', maxWidth: 400,
        background: '#111111', border: '1px solid #262626',
        borderRadius: 16, padding: '32px 28px',
      }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#f5f5f5', margin: 0 }}>Sign in to AuraSense</h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', margin: '6px 0 0' }}>
            Save sessions, share replays, and track progress.
          </p>
        </div>

        {sent ? (
          <div style={{
            padding: '16px', borderRadius: 10,
            background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)',
          }}>
            <p style={{ fontSize: 14, color: '#10b981', margin: 0 }}>
              ✓ Magic link sent to <strong>{email}</strong>. Check your inbox.
            </p>
          </div>
        ) : (
          <>
            <form onSubmit={sendMagicLink} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>Email address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  style={{
                    background: '#0a0a0a', border: '1px solid #333',
                    borderRadius: 8, padding: '10px 12px',
                    color: '#f5f5f5', fontSize: 14, outline: 'none',
                  }}
                />
              </div>
              {error && (
                <p style={{ fontSize: 12, color: '#ef4444', margin: 0 }}>{error}</p>
              )}
              <button
                type="submit"
                disabled={loading}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  padding: '11px', borderRadius: 10, fontSize: 14, fontWeight: 600,
                  background: loading ? 'rgba(16,185,129,0.3)' : 'rgba(16,185,129,0.15)',
                  border: '1px solid rgba(16,185,129,0.35)', color: '#10b981',
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}
              >
                <Mail className="w-4 h-4" />
                {loading ? 'Sending…' : 'Send magic link'}
              </button>
            </form>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
              <div style={{ flex: 1, height: 1, background: '#262626' }} />
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>or</span>
              <div style={{ flex: 1, height: 1, background: '#262626' }} />
            </div>

            <button
              onClick={signInWithGoogle}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                padding: '11px', borderRadius: 10, fontSize: 14, fontWeight: 600,
                background: '#18181b', border: '1px solid #333', color: '#f5f5f5',
                cursor: 'pointer',
              }}
            >
              <Globe className="w-4 h-4" />
              Continue with Google
            </button>
          </>
        )}

        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', marginTop: 20, textAlign: 'center' }}>
          By signing in you agree to our{' '}
          <a href="/terms" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'underline' }}>Terms</a>
          {' '}and{' '}
          <a href="/privacy" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'underline' }}>Privacy Policy</a>.
        </p>
      </div>
    </div>
  )
}
