/**
 * Shared topbar — logo · NEPA pill · tier badge · account · sign-out.
 *
 * Server component. Reads the Supabase session (when available) so the
 * topbar can show the signed-in identity without an extra round trip from
 * each page.
 */
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

const TIER_COLORS = {
  free: { fg: '#22d3ee', bg: 'rgba(34,211,238,0.12)', border: 'rgba(34,211,238,0.45)' },
  nursing: { fg: '#10b981', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.45)' },
  enterprise: { fg: '#a78bfa', bg: 'rgba(167,139,250,0.12)', border: 'rgba(167,139,250,0.45)' },
} as const

export type TopbarTier = keyof typeof TIER_COLORS

interface TopbarProps {
  tier?: TopbarTier
  /** Override what's shown to the right of the NEPA pill. */
  rightSlot?: React.ReactNode
}

export default async function Topbar({ tier, rightSlot }: TopbarProps) {
  let email: string | null = null
  try {
    const sb = await createClient()
    const { data } = await sb.auth.getUser()
    email = data.user?.email ?? null
  } catch {
    /* unauthenticated */
  }
  const resolvedTier: TopbarTier = tier ?? 'free'
  const palette = TIER_COLORS[resolvedTier]
  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '10px 16px',
        background: 'rgba(13,17,23,0.85)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        borderBottom: '1px solid #1f2d42',
        color: '#e2e8f0',
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: 13,
      }}
    >
      <Link
        href="/"
        style={{
          fontFamily: 'Geist Mono, monospace',
          fontWeight: 700,
          color: '#e2e8f0',
          textDecoration: 'none',
          letterSpacing: 0.6,
        }}
      >
        AURASENSE
      </Link>

      <span
        style={{
          padding: '3px 8px',
          borderRadius: 999,
          fontFamily: 'Geist Mono, monospace',
          fontSize: 10,
          letterSpacing: 0.5,
          background: 'rgba(34,211,238,0.08)',
          border: '1px solid rgba(34,211,238,0.35)',
          color: '#22d3ee',
        }}
      >
        34ms / RODA / VODA·SFSVC / core
      </span>

      <span
        style={{
          padding: '3px 8px',
          borderRadius: 999,
          fontFamily: 'Geist Mono, monospace',
          fontSize: 10,
          letterSpacing: 0.5,
          background: palette.bg,
          border: `1px solid ${palette.border}`,
          color: palette.fg,
          textTransform: 'uppercase',
        }}
      >
        {resolvedTier}
      </span>

      <div style={{ flex: 1 }}>{rightSlot}</div>

      <nav style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Link href="/pricing" style={navLink}>
          Pricing
        </Link>
        <Link href="/architecture" style={navLink}>
          Architecture
        </Link>
        {email ? (
          <>
            <Link href="/account" style={navLink}>
              Account
            </Link>
            <form action="/auth/signout" method="post">
              <button
                type="submit"
                style={{
                  ...navLink,
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  font: 'inherit',
                }}
              >
                Sign out
              </button>
            </form>
          </>
        ) : (
          <Link
            href="/login"
            style={{
              ...navLink,
              border: '1px solid #22d3ee',
              padding: '4px 10px',
              borderRadius: 8,
              color: '#22d3ee',
            }}
          >
            Sign in
          </Link>
        )}
      </nav>
    </header>
  )
}

const navLink: React.CSSProperties = {
  color: '#8899aa',
  textDecoration: 'none',
  fontSize: 12,
  transition: 'color 180ms cubic-bezier(0.16,1,0.3,1)',
}
