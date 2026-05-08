export type PlanKey = 'starter' | 'pro' | 'team' | 'enterprise'

export interface PlanQuota {
  frames_per_day: number   // -1 = unlimited
  videos_per_day: number
  bytes_per_day:  number
  max_seats:      number
  features: {
    audit_chain:        boolean
    world_model_api:    boolean
    webhooks:           boolean
    air_gapped:         boolean
    sse_realtime:       boolean
    rtsp_ingest:        boolean   // V1: RTSP/SRT ingest via edge GPU service
  }
}

export const QUOTAS: Record<PlanKey, PlanQuota> = {
  starter: {
    frames_per_day: 500,
    videos_per_day: 5,
    bytes_per_day:  500 * 1024 * 1024,        // 500 MB
    max_seats:      1,
    features: { audit_chain: true, world_model_api: false, webhooks: false, air_gapped: false, sse_realtime: true, rtsp_ingest: false },
  },
  pro: {
    frames_per_day: -1,
    videos_per_day: 200,
    bytes_per_day:  20 * 1024 * 1024 * 1024,  // 20 GB
    max_seats:      1,
    features: { audit_chain: true, world_model_api: true, webhooks: false, air_gapped: false, sse_realtime: true, rtsp_ingest: true },
  },
  team: {
    frames_per_day: -1,
    videos_per_day: -1,
    bytes_per_day:  200 * 1024 * 1024 * 1024, // 200 GB
    max_seats:      10,
    features: { audit_chain: true, world_model_api: true, webhooks: true, air_gapped: false, sse_realtime: true, rtsp_ingest: true },
  },
  enterprise: {
    frames_per_day: -1,
    videos_per_day: -1,
    bytes_per_day:  -1,
    max_seats:      9999,
    features: { audit_chain: true, world_model_api: true, webhooks: true, air_gapped: true, sse_realtime: true, rtsp_ingest: true },
  },
}

/** Map Stripe price → plan key (consulted in webhook + checkout). */
export function priceToPlan(priceId?: string | null): PlanKey {
  if (!priceId) return 'starter'
  const p = priceId.toLowerCase()
  if (priceId === process.env.STRIPE_PRICE_PRO_MONTHLY)  return 'pro'
  if (priceId === process.env.STRIPE_PRICE_PRO_ANNUAL)   return 'pro'
  if (priceId === process.env.STRIPE_PRICE_TEAM_MONTHLY) return 'team'
  if (priceId === process.env.STRIPE_PRICE_TEAM_ANNUAL)  return 'team'
  if (p.includes('pro'))  return 'pro'
  if (p.includes('team')) return 'team'
  return 'starter'
}

export function planForUser(plan: string | null | undefined): PlanKey {
  if (plan === 'pro' || plan === 'team' || plan === 'enterprise') return plan
  return 'starter'
}
