'use client'
/**
 * Welcome-screen "Get Started" CTA. Calls the onboarded endpoint, then
 * routes to the tier home. Optimistic loading state; no toast library —
 * we just inline the error.
 */
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  home: string
}

export default function WelcomeCta({ home }: Props) {
  const router = useRouter()
  const [pending, setPending] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  async function onClick() {
    setPending(true)
    setErr(null)
    try {
      const r = await fetch('/api/profile/onboarded', { method: 'POST' })
      if (!r.ok) throw new Error(`server returned ${r.status}`)
      const j = (await r.json().catch(() => ({}))) as { redirect?: string }
      router.push(j.redirect ?? home)
    } catch (e) {
      setErr((e as Error).message || 'something went wrong')
      setPending(false)
    }
  }

  return (
    <div style={{ marginTop: 18 }}>
      <button
        type="button"
        onClick={onClick}
        disabled={pending}
        style={{
          padding: '12px 18px',
          width: '100%',
          background: pending ? 'rgba(16,185,129,0.4)' : '#10b981',
          color: '#0d1117',
          border: 'none',
          borderRadius: 10,
          fontSize: 14,
          fontWeight: 700,
          cursor: pending ? 'wait' : 'pointer',
          transition: 'background 180ms cubic-bezier(0.16,1,0.3,1)',
          letterSpacing: 0.3,
        }}
      >
        {pending ? 'Calibrating…' : 'Get Started →'}
      </button>
      {err && (
        <div
          role="alert"
          style={{
            marginTop: 8,
            padding: '6px 10px',
            border: '1px solid #f59e0b',
            borderRadius: 8,
            color: '#f59e0b',
            fontSize: 12,
          }}
        >
          {err}
        </div>
      )}
    </div>
  )
}
