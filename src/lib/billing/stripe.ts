import Stripe from 'stripe'

let _stripe: Stripe | null = null
export function stripe(): Stripe {
  if (_stripe) return _stripe
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) throw new Error('STRIPE_SECRET_KEY not set')
  _stripe = new Stripe(key, { apiVersion: '2024-12-18.acacia' as any, typescript: true })
  return _stripe
}

export const HAS_STRIPE = !!process.env.STRIPE_SECRET_KEY
