import { mintEdgeToken, type EdgePlan } from './hmac'
import type { PlanKey } from './billing/plans'

/**
 * Map the playground's internal plan vocabulary onto the plan whitelist
 * accepted by the edge service auth verifier (free | rehearse_pro | enterprise).
 */
export function planToEdgePlan(plan: PlanKey | string | null | undefined): EdgePlan {
  switch (plan) {
    case 'enterprise':
      return 'enterprise'
    case 'pro':
    case 'team':
      return 'rehearse_pro'
    case 'starter':
    default:
      return 'free'
  }
}

export function getEdgeBaseUrl(): string {
  const url = process.env.EDGE_BASE_URL || 'http://localhost:8000'
  return url.replace(/\/+$/, '')
}

export interface EdgeFetchOptions {
  userId: string
  plan: PlanKey | string
  path: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  body?: unknown
  headers?: Record<string, string>
  ttlSeconds?: number
  /** Pass through for SSE / streaming responses. */
  signal?: AbortSignal
}

/**
 * Server-only fetch wrapper that mints a fresh per-request HMAC token
 * and forwards it as a Bearer credential to the edge service.
 *
 * NEVER call from client components — leaks would expose the signing secret.
 */
export async function edgeFetch(opts: EdgeFetchOptions): Promise<Response> {
  const { token } = mintEdgeToken({
    userId: opts.userId,
    plan: planToEdgePlan(opts.plan),
    ttlSeconds: opts.ttlSeconds,
  })
  const url = `${getEdgeBaseUrl()}${opts.path.startsWith('/') ? '' : '/'}${opts.path}`
  const init: RequestInit = {
    method: opts.method ?? 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      ...(opts.body !== undefined ? { 'content-type': 'application/json' } : {}),
      ...(opts.headers ?? {}),
    },
    signal: opts.signal,
  }
  if (opts.body !== undefined) {
    init.body = typeof opts.body === 'string' ? opts.body : JSON.stringify(opts.body)
  }
  return fetch(url, init)
}
