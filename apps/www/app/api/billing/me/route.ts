import { NextRequest, NextResponse } from 'next/server'
import { logger, getRequestId } from '@/lib/logger'
import { admin } from '@/lib/supabase/admin'
import { QUOTAS, planForUser } from '@/lib/billing/plans'
import { getTodayUsage } from '@/lib/billing/quota'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const requestId = getRequestId(req)
  const { createClient } = await import('@/lib/supabase/server')
  const sb = await createClient()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) {
    logger.error({ msg: 'auth_required', requestId })
    return NextResponse.json({ ok: false, authenticated: false, plan: 'starter', requestId })
  }

  const { data: row } = await admin().from('user_plans').select('*').eq('user_id', user.id).maybeSingle()
  const plan = planForUser(row?.plan)
  const usage = await getTodayUsage(user.id)
  logger.info({ msg: 'me_fetched', userId: user.id, requestId })
  return NextResponse.json({
    ok: true,
    authenticated: true,
    user: { id: user.id, email: user.email },
    plan,
    status: row?.status ?? 'active',
    current_period_end: row?.current_period_end,
    cancel_at_period_end: row?.cancel_at_period_end ?? false,
    quota: QUOTAS[plan],
    usage_today: usage,
    has_subscription: !!row?.stripe_subscription_id,
    requestId,
  })
}
