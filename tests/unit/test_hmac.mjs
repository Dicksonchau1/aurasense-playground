// Round-trip test for the edge HMAC token contract.
//
// Mirrors the HS256 layout in src/lib/hmac.ts so we can verify the
// contract from a plain Node test runner without needing a TS loader.
// If src/lib/hmac.ts changes the claim shape or signing alg, update
// this file in lockstep.
//
// Run with: npm test
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createHmac, timingSafeEqual } from 'node:crypto'

const SECRET = 'a'.repeat(32)
process.env.EDGE_SIGNING_SECRET = SECRET

function b64url(input) {
  return Buffer.from(input).toString('base64url')
}

function mint({ userId, plan, ttl = 300 }) {
  const now = Math.floor(Date.now() / 1000)
  const payload = { user_id: userId, plan, iat: now, exp: now + ttl }
  const header = b64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const body = b64url(JSON.stringify(payload))
  const sig = createHmac('sha256', SECRET).update(`${header}.${body}`).digest('base64url')
  return { token: `${header}.${body}.${sig}`, payload }
}

function verify(token) {
  const [header, body, sig] = token.split('.')
  const expected = createHmac('sha256', SECRET).update(`${header}.${body}`).digest('base64url')
  const a = Buffer.from(sig)
  const b = Buffer.from(expected)
  assert.equal(a.length, b.length, 'sig length matches')
  assert.ok(timingSafeEqual(a, b), 'sig is valid')
  const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'))
  assert.ok(payload.user_id, 'has user_id claim')
  assert.ok(payload.plan, 'has plan claim')
  assert.ok(payload.exp > Math.floor(Date.now() / 1000), 'not expired')
  return payload
}

test('edge token: mint → verify round trip', () => {
  const { token, payload } = mint({ userId: 'u_123', plan: 'rehearse_pro' })
  const v = verify(token)
  assert.equal(v.user_id, payload.user_id)
  assert.equal(v.plan, 'rehearse_pro')
})

test('edge token: tampered payload fails signature check', () => {
  const { token } = mint({ userId: 'u_123', plan: 'free' })
  const [header, , sig] = token.split('.')
  const evilPayload = b64url(JSON.stringify({
    user_id: 'u_attacker',
    plan: 'enterprise',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 300,
  }))
  const tampered = `${header}.${evilPayload}.${sig}`
  assert.throws(() => verify(tampered))
})

test('edge token: expired token rejected', () => {
  const { token } = mint({ userId: 'u_123', plan: 'free', ttl: -10 })
  assert.throws(() => verify(token))
})
