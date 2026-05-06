import { createHmac, timingSafeEqual } from 'node:crypto'

export type EdgePlan = 'free' | 'rehearse_pro' | 'enterprise'

export interface EdgeTokenPayload {
  user_id: string
  plan: EdgePlan
  iat: number
  exp: number
}

const ALG = 'HS256'

function b64url(input: Buffer | string): string {
  return Buffer.from(input).toString('base64url')
}

function getSecret(): string {
  const s = process.env.EDGE_SIGNING_SECRET
  if (!s || s.length < 16) {
    throw new Error(
      'EDGE_SIGNING_SECRET is not configured (must be >=16 bytes; recommend 32+).'
    )
  }
  return s
}

/**
 * Mint an HS256 JWT compatible with the feat/edge-service-v1 verifier.
 * Default TTL matches the edge default (300s).
 */
export function mintEdgeToken(opts: {
  userId: string
  plan: EdgePlan
  ttlSeconds?: number
}): { token: string; payload: EdgeTokenPayload } {
  const ttl = Math.max(30, Math.min(opts.ttlSeconds ?? 300, 3600))
  const now = Math.floor(Date.now() / 1000)
  const payload: EdgeTokenPayload = {
    user_id: opts.userId,
    plan: opts.plan,
    iat: now,
    exp: now + ttl,
  }
  const header = b64url(JSON.stringify({ alg: ALG, typ: 'JWT' }))
  const body = b64url(JSON.stringify(payload))
  const sig = createHmac('sha256', getSecret())
    .update(`${header}.${body}`)
    .digest('base64url')
  return { token: `${header}.${body}.${sig}`, payload }
}

/**
 * Verify an edge token (used by tests + defensive checks). Throws on failure.
 */
export function verifyEdgeToken(token: string): EdgeTokenPayload {
  const parts = token.split('.')
  if (parts.length !== 3) throw new Error('malformed token')
  const [header, body, sig] = parts
  const expected = createHmac('sha256', getSecret())
    .update(`${header}.${body}`)
    .digest('base64url')
  const a = Buffer.from(sig)
  const b = Buffer.from(expected)
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    throw new Error('invalid signature')
  }
  const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as EdgeTokenPayload
  if (!payload.user_id || !payload.plan || !payload.exp) throw new Error('missing claims')
  if (payload.exp < Math.floor(Date.now() / 1000)) throw new Error('token expired')
  return payload
}
