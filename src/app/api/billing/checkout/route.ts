import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const PRICE_MAP: Record<string, string | undefined> = {
  'pro:monthly':  process.env.STRIPE_PRICE_PRO_MONTHLY,
  'pro:annual':   process.env.STRIPE_PRICE_PRO_ANNUAL,
  'team:monthly': process.env.STRIPE_PRICE_TEAM_MONTHLY,
  'team:annual':  process.env.STRIPE_PRICE_TEAM_ANNUAL,
}

export async function POST(req: NextRequest) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ ok: false, error: 'stripe_not_configured' }, { status: 501 })
    }
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return NextResponse.json({ ok: false, error: 'supabase_not_configured' }, { status: 501 })
    }

    const body = await req.json().catch(() => ({}))
    const { plan, annual } = body
    const key = `${plan}:${annual ? 'annual' : 'monthly'}`
    const priceId = PRICE_MAP[key]

    if (!priceId) {
      return NextResponse.json({
        ok: false,
        error: 'price_not_configured',
        detail: `No env var for ${key.toUpperCase().replace(':', '_')}`,
      }, { status: 400 })
    }

    // Auth check
    let user: any = null
    try {
      const { createClient } = await import('@/lib/supabase/server')
      const sb = await createClient()
      const { data } = await sb.auth.getUser()
      user = data?.user
    } catch (e) {
      console.error('[checkout] supabase error:', (e as Error).message)
    }

    if (!user) {
      return NextResponse.json({ ok: false, error: 'auth_required' }, { status: 401 })
    }

    // Stripe SDK
    const Stripe = (await import('stripe')).default
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2024-12-18.acacia' as any,
    } as any)

    // Look up or create customer
    let customerId: string | undefined
    try {
      const { admin } = await import('@/lib/supabase/admin')
      const { data: existing } = await admin()
        .from('user_plans')
        .select('stripe_customer_id')
        .eq('user_id', user.id)
        .maybeSingle()
      customerId = existing?.stripe_customer_id ?? undefined

      if (!customerId) {
        const c = await stripe.customers.create({
          email: user.email ?? undefined,
          metadata: { user_id: user.id },
        })
        customerId = c.id
        await admin().from('user_plans').upsert({
          user_id: user.id,
          plan: 'starter',
          status: 'active',
          stripe_customer_id: customerId,
        })
      }
    } catch (e) {
      console.error('[checkout] customer setup error:', e)
      return NextResponse.json({
        ok: false,
        error: 'customer_setup_failed',
        detail: (e as Error).message,
      }, { status: 500 })
    }

    // Create checkout session
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://playground.aurasensehk.com'
    let session: any
    try {
      session = await stripe.checkout.sessions.create({
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
    } catch (e) {
      console.error('[checkout] session create error:', e)
      return NextResponse.json({
        ok: false,
        error: 'checkout_session_failed',
        detail: (e as Error).message,
      }, { status: 500 })
    }

    return NextResponse.json({ ok: true, url: session.url })
  } catch (e) {
    console.error('[checkout] unhandled:', e)
    return NextResponse.json({
      ok: false,
      error: 'internal_error',
      detail: (e as Error)?.message ?? 'unknown',
    }, { status: 500 })
  }
}
