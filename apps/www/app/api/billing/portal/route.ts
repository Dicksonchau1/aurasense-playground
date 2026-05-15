import { NextRequest, NextResponse } from 'next/server'
import { logger, getRequestId } from '@/lib/logger'
import { stripe, HAS_STRIPE } from '@/lib/billing/stripe'
import { admin } from '@/lib/supabase/admin'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const requestId = getRequestId(req)
  if (!HAS_STRIPE) {
    logger.error({ msg: 'stripe_not_configured', requestId })
    return NextResponse.json({ ok: false, error: 'stripe_not_configured', requestId }, { status: 501 })
  }

  const { createClient } = await import('@/lib/supabase/server')
  const sb = await createClient()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) {
    logger.error({ msg: 'auth_required', requestId })
    return NextResponse.json({ ok: false, error: 'auth_required', requestId }, { status: 401 })
  }

  const { data } = await admin().from('user_plans').select('stripe_customer_id').eq('user_id', user.id).maybeSingle()
  if (!data?.stripe_customer_id) {
    logger.error({ msg: 'no_customer', userId: user.id, requestId })
    return NextResponse.json({ ok: false, error: 'no_customer', requestId }, { status: 400 })
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  const session = await stripe().billingPortal.sessions.create({
    customer: data.stripe_customer_id,
    return_url: `${appUrl}/portal`,
  })
  logger.info({ msg: 'portal_session_created', userId: user.id, requestId })
  return NextResponse.json({ ok: true, url: session.url, requestId })
}
