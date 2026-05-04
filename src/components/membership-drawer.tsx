"use client"
import React, { createContext, useContext, useState, useCallback } from 'react'

type PlanKey = 'starter' | 'pro' | 'team' | 'enterprise'

interface DrawerCtx {
  open: (planName?: string) => void
  close: () => void
  isOpen: boolean
}

const Ctx = createContext<DrawerCtx | null>(null)

export function useMembershipDrawer(): DrawerCtx {
  const ctx = useContext(Ctx)
  if (!ctx) return { open: () => {}, close: () => {}, isOpen: false }
  return ctx
}

const PLANS: Array<{ key: PlanKey; name: string; price: string; cta: string }> = [
  { key: 'starter',    name: 'Starter',    price: 'Free',       cta: 'Current plan' },
  { key: 'pro',        name: 'NEPA Pro',   price: 'HK$ 388/mo', cta: 'Upgrade' },
  { key: 'team',       name: 'Team',       price: 'HK$ 1288/mo',cta: 'Start trial' },
  { key: 'enterprise', name: 'Enterprise', price: 'Custom',     cta: 'Contact sales' },
]

export function MembershipDrawerProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const open  = useCallback((_planName?: string) => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])

 async function checkout(plan: PlanKey) {
  if (plan === 'starter') return
  if (plan === 'enterprise') {
    window.location.href = 'mailto:sales@aurasensehk.com?subject=Enterprise%20inquiry'
    return
  }
  try {
    const res = await fetch('/api/billing/checkout', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ plan, annual: false }),
    })

    // Read the body once as text so we can fall through on any failure
    const text = await res.text()
    let j: any = {}
    try { j = text ? JSON.parse(text) : {} } catch {}

    if (res.ok && j.ok && j.url) {
      window.location.href = j.url
      return
    }

    // 401 → redirect to /portal sign-in page
    if (res.status === 401 || j.error === 'auth_required') {
      window.location.href = '/portal?signin=1&plan=' + plan
      return
    }

    if (j.error === 'stripe_not_configured') {
      alert('Billing is not configured yet. Please contact support@aurasensehk.com.')
      return
    }

    alert('Checkout error: ' + (j.error || res.statusText || `HTTP ${res.status}`))
  } catch (err) {
    alert('Checkout failed: ' + (err as Error).message)
  }
}
  return (
    <Ctx.Provider value={{ open, close, isOpen }}>
      {children}
      {isOpen && (
        <div onClick={close} style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)',
          backdropFilter: 'blur(6px)', zIndex: 60,
        }}></div>
      )}
      <aside style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 61,
        width: 'min(440px, 100vw)', background: '#070e1a',
        borderLeft: '1px solid rgba(16,185,129,0.2)',
        transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.3s',
        padding: '24px', color: 'white', overflowY: 'auto',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#10b981' }}>Upgrade AuraSense</h2>
          <button onClick={close} style={{ color: 'rgba(255,255,255,0.5)', background: 'none', border: 'none', cursor: 'pointer' }}>Close</button>
        </div>
        {PLANS.map(p => (
          <div key={p.key} style={{
            padding: 16, marginBottom: 12, borderRadius: 12,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <strong>{p.name}</strong>
              <span style={{ color: '#10b981', fontFamily: 'monospace' }}>{p.price}</span>
            </div>
            <button onClick={() => checkout(p.key)} disabled={p.key === 'starter'} style={{
              width: '100%', padding: '8px 12px', borderRadius: 8,
              background: p.key === 'starter' ? 'rgba(255,255,255,0.05)' : 'rgba(16,185,129,0.15)',
              color: p.key === 'starter' ? 'rgba(255,255,255,0.5)' : '#10b981',
              border: '1px solid rgba(16,185,129,0.3)',
              cursor: p.key === 'starter' ? 'default' : 'pointer',
              fontSize: 12, fontWeight: 600,
            }}>
              {p.cta}
            </button>
          </div>
        ))}
        <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', textAlign: 'center', marginTop: 16 }}>
          Prices in HKD. Cancel anytime. AuraSense Ltd, Kowloon HK.
        </p>
      </aside>
    </Ctx.Provider>
  )
}
