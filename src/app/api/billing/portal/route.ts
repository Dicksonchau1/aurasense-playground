import { NextResponse } from 'next/server'
import { stripe, HAS_STRIPE } from '@/lib/billing/stripe'
import { admin } from '@/lib/supabase/admin'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST() {
  if (!HAS_STRIPE) return NextResponse.json({ ok: false, error: 'stripe_not_configured' }, { status: 501 })

  const { createClient } = await import('@/lib/supabase/server')
  const sb = await createClient()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) return NextResponse.json({ ok: false, error: 'auth_required' }, { status: 401 })

  const { data } = await admin().from('user_plans').select('stripe_customer_id').eq('user_id', user.id).maybeSingle()
  if (!data?.stripe_customer_id) return NextResponse.json({ ok: false, error: 'no_customer' }, { status: 400 })

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  const session = await stripe().billingPortal.sessions.create({
    customer: data.stripe_customer_id,
    return_url: `${appUrl}/portal`,
  })
  return NextResponse.json({ ok: true, url: session.url })
}
