import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { admin } from '@/lib/supabase/admin'
import { planForUser } from '@/lib/billing/plans'
import { mintEdgeToken } from '@/lib/hmac'
import { planToEdgePlan } from '@/lib/edge-client'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Mint a short-lived HMAC bearer token that the browser can hand to
 * a thin proxy route. NEVER returns the signing secret. The token's
 * plan claim is derived server-side from the authenticated session.
 */
export async function POST() {
  const sb = await createClient()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) {
    return NextResponse.json({ ok: false, error: 'unauthenticated' }, { status: 401 })
  }

  const { data: row } = await admin()
    .from('user_plans')
    .select('plan')
    .eq('user_id', user.id)
    .maybeSingle()
  const internalPlan = planForUser(row?.plan)
  const edgePlan = planToEdgePlan(internalPlan)

  try {
    const { token, payload } = mintEdgeToken({
      userId: user.id,
      plan: edgePlan,
      ttlSeconds: 300,
    })
    return NextResponse.json({
      ok: true,
      token,
      plan: edgePlan,
      internal_plan: internalPlan,
      exp: payload.exp,
    })
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : 'mint_failed' },
      { status: 500 }
    )
  }
}
