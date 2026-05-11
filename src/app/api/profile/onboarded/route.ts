/**
 * POST /api/profile/onboarded — mark the current user as having seen the
 * welcome screen, then return the tier-appropriate redirect.
 *
 * Idempotent: writing `onboarded_at = now()` on a row that already has a
 * value is a no-op from the user's perspective. The endpoint deliberately
 * does NOT enforce "first time only" so users hitting it twice (e.g.
 * accidental double-click) still get the redirect.
 */
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function homeFor(tier: string | undefined): string {
  if (tier === 'enterprise') return '/drone'
  if (tier === 'nursing') return '/rehearse'
  return '/playground'
}

export async function POST() {
  const sb = await createClient()
  const { data } = await sb.auth.getUser()
  const user = data.user
  if (!user) {
    return NextResponse.json({ ok: false, error: 'unauthenticated' }, { status: 401 })
  }

  const { error } = await sb
    .from('profiles')
    .update({ onboarded_at: new Date().toISOString() })
    .eq('id', user.id)

  const store = await cookies()
  const tier = store.get('aurasense.tier')?.value
  const redirect = homeFor(tier)

  return NextResponse.json({
    ok: !error,
    tier: tier ?? 'free',
    redirect,
    ...(error ? { warning: error.message } : {}),
  })
}
