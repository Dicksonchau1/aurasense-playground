/**
 * Next.js 16 proxy (formerly middleware).
 *
 * Two responsibilities:
 *  1. Auth wall — anonymous traffic to protected routes is redirected to /login
 *     with `?next=<original-path>` preserved.
 *  2. Soft tier gating on /rehearse?scenario=<slug> — free-tier visitors hitting
 *     a Nursing+ scenario get redirected to /pricing?upsell=<slug>. This is a
 *     hint, not a security boundary; real enforcement lives in NEPA tier_policy.
 */
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { canAccessScenario, type Tier } from './lib/auth/tier-gate'

// Explicit public path list — everything else requires a session.
const PUBLIC_PATHS = new Set<string>([
  '/login',
  '/pricing',
  '/architecture',
  '/privacy',
  '/terms',
  '/auth/callback',
])

// Public prefixes — wildcard match on path start.
const PUBLIC_PREFIXES = [
  '/api/billing/webhook',
  '/api/v1/coach/scenarios',
  '/api/v1/coach/health',
  '/_next',
  '/favicon',
  '/icons',
]

function isPublic(pathname: string): boolean {
  // /playground preview is public (sign-in required only to start camera).
  if (pathname === '/playground') return true
  if (PUBLIC_PATHS.has(pathname)) return true
  return PUBLIC_PREFIXES.some((p) => pathname.startsWith(p))
}

function tierFromCookie(req: NextRequest): Tier {
  const raw = req.cookies.get('aurasense.tier')?.value
  if (raw === 'nursing' || raw === 'enterprise') return raw
  return 'free'
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Soft tier gate on /rehearse scenario queries — runs whether or not auth is
  // present. If the user is anonymous they'll be auth-walled below anyway.
  if (pathname.startsWith('/rehearse')) {
    const slug = request.nextUrl.searchParams.get('scenario')
    if (slug) {
      const tier = tierFromCookie(request)
      if (!canAccessScenario(tier, slug)) {
        const redirect = new URL('/pricing', request.url)
        redirect.searchParams.set('upsell', slug)
        return NextResponse.redirect(redirect)
      }
    }
  }

  // Build a Supabase SSR client that reads/writes cookies through the response.
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Do NOT inject logic between createServerClient and getUser (Supabase rule).
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Auth wall — non-public path + no session → /login?next=<path>
  if (!isPublic(pathname) && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('next', pathname + (request.nextUrl.search || ''))
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    // Run everywhere except static assets.
    '/((?!_next/static|_next/image|favicon|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
}
