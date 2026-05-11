/**
 * Edge middleware — tier gating on /rehearse?scenario=<slug>.
 *
 * If a free-tier visitor hits a Nursing+ scenario, redirect to
 * /pricing?upsell=<slug>. We can't read Supabase from edge cheaply, so we
 * read the soft `aurasense.tier` cookie set by the auth callback (and
 * default to `free`). The frontend treats this as a hint, not a security
 * boundary — the real enforcement is in the NEPA tier_policy service.
 */
import { NextRequest, NextResponse } from 'next/server'
import { canAccessScenario, type Tier } from './lib/auth/tier-gate'

export const config = {
  matcher: ['/rehearse/:path*'],
}

function tierFromCookie(req: NextRequest): Tier {
  const raw = req.cookies.get('aurasense.tier')?.value
  if (raw === 'nursing' || raw === 'enterprise') return raw
  return 'free'
}

export function middleware(req: NextRequest) {
  const url = req.nextUrl
  const slug = url.searchParams.get('scenario')
  if (!slug) return NextResponse.next()

  const tier = tierFromCookie(req)
  if (canAccessScenario(tier, slug)) return NextResponse.next()

  const redirect = new URL('/pricing', req.url)
  redirect.searchParams.set('upsell', slug)
  return NextResponse.redirect(redirect)
}
