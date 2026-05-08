import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { stripe, HAS_STRIPE } from '@/lib/billing/stripe'
import { admin } from '@/lib/supabase/admin'
import { priceToPlan } from '@/lib/billing/plans'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  if (!HAS_STRIPE) return NextResponse.json({ ok: false, error: 'stripe_not_configured' }, { status: 501 })
  const sig = req.headers.get('stripe-signature')
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  if (!sig || !secret) return NextResponse.json({ ok: false, error: 'missing_signature' }, { status: 400 })

  const body = await req.text()
  let event: Stripe.Event
  try {
    event = stripe().webhooks.constructEvent(body, sig, secret)
  } catch (e) {
    return NextResponse.json({ ok: false, error: 'bad_signature', detail: (e as Error).message }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const sub = (event.data.object as any) as Stripe.Subscription | Stripe.Checkout.Session
        const customer = (sub as any).customer as string
        const subId = (event.type === 'checkout.session.completed')
          ? ((sub as Stripe.Checkout.Session).subscription as string)
          : (sub as Stripe.Subscription).id
        if (!subId) break

        const subscription = await stripe().subscriptions.retrieve(subId)
        const priceId = subscription.items.data[0]?.price.id
        const plan    = priceToPlan(priceId)
        const userId  = subscription.metadata.user_id ?? (sub as any).metadata?.user_id

        if (!userId) { console.warn('[stripe webhook] no user_id in metadata'); break }

        await admin().from('user_plans').upsert({
          user_id: userId,
          plan,
          status: subscription.status as any,
          stripe_customer_id: customer,
          stripe_subscription_id: subscription.id,
          stripe_price_id: priceId,
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          cancel_at_period_end: subscription.cancel_at_period_end,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' })
        break
      }
      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription
        await admin().from('user_plans')
          .update({ plan: 'starter', status: 'canceled', updated_at: new Date().toISOString() })
          .eq('stripe_subscription_id', sub.id)
        break
      }
      case 'invoice.payment_failed': {
        const inv = event.data.object as Stripe.Invoice
        const subId = inv.subscription as string
        if (subId) {
          await admin().from('user_plans')
            .update({ status: 'past_due', updated_at: new Date().toISOString() })
            .eq('stripe_subscription_id', subId)
        }
        break
      }
      default:
        // ignore
    }
  } catch (e) {
    console.error('[stripe webhook] handler failed', e)
    return NextResponse.json({ ok: false, error: (e as Error).message }, { status: 500 })
  }

  return NextResponse.json({ ok: true, received: event.type })
}
