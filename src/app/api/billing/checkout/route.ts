import { NextRequest, NextResponse } from 'next/server'
import { stripe, HAS_STRIPE } from '@/lib/billing/stripe'
import { admin } from '@/lib/supabase/admin'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const PRICE_MAP: Record<string, string | undefined> = {
  'pro:monthly':  process.env.STRIPE_PRICE_PRO_MONTHLY,
  'pro:annual':   process.env.STRIPE_PRICE_PRO_ANNUAL,
  'team:monthly': process.env.STRIPE_PRICE_TEAM_MONTHLY,
  'team:annual':  process.env.STRIPE_PRICE_TEAM_ANNUAL,
}

export async function POST(req: NextRequest) {
  if (!HAS_STRIPE) return NextResponse.json({ ok: false, error: 'stripe_not_configured' }, { status: 501 })

  const { plan, annual } = await req.json().catch(() => ({}))
  const key = `${plan}:${annual ? 'annual' : 'monthly'}`
  const priceId = PRICE_MAP[key]
  if (!priceId) return NextResponse.json({ ok: false, error: 'unknown_plan', key }, { status: 400 })

  // Auth — must be signed in
  const { createClient } = await import('@/lib/supabase/server')
  const sb = await createClient()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) return NextResponse.json({ ok: false, error: 'auth_required' }, { status: 401 })

  // Reuse existing customer if any
  const { data: existing } = await admin().from('user_plans').select('stripe_customer_id').eq('user_id', user.id).maybeSingle()
  let customerId = existing?.stripe_customer_id ?? undefined
  if (!customerId) {
    const c = await stripe().customers.create({
      email: user.email ?? undefined,
      metadata: { user_id: user.id },
    })
    customerId = c.id
    await admin().from('user_plans').upsert({
      user_id: user.id, plan: 'starter', status: 'active', stripe_customer_id: customerId,
    })
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  const session = await stripe().checkout.sessions.create({
    mode: 'subscription',
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    allow_promotion_codes: true,
    billing_address_collection: 'auto',
    success_url: `${appUrl}/portal?upgraded=1&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url:  `${appUrl}/portal?canceled=1`,
    subscription_data: { metadata: { user_id: user.id, plan } },
    metadata: { user_id: user.id, plan },
  })

  return NextResponse.json({ ok: true, url: session.url })
}
