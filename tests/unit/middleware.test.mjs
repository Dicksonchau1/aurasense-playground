// Middleware logic tests. The real middleware reads cookies + Supabase
// session via `@supabase/ssr`, which we don't import here — we re-state
// the public-path decision rules so they're locked under `node --test`.
// If the middleware's PUBLIC list changes, this test must change too.
import test from 'node:test'
import assert from 'node:assert/strict'

const PUBLIC_PATHS = [
  '/login',
  '/pricing',
  '/architecture',
  '/privacy',
  '/terms',
  '/auth/callback',
  '/billing/webhook',
]
const PUBLIC_PREFIXES = [
  '/api/billing/webhook',
  '/api/v1/coach/scenarios',
  '/_next',
  '/favicon',
  '/icons',
]

function isPublic(pathname) {
  if (pathname === '/playground') return true
  if (PUBLIC_PATHS.includes(pathname)) return true
  return PUBLIC_PREFIXES.some(p => pathname.startsWith(p))
}

function decide(pathname, hasSession) {
  if (pathname === '/' && !hasSession) return { type: 'redirect', to: '/login' }
  if (pathname === '/' && hasSession) return { type: 'redirect-tier' }
  if (!isPublic(pathname) && !hasSession) {
    return { type: 'redirect', to: `/login?next=${pathname}` }
  }
  return { type: 'next' }
}

test('apex /: anon redirected to /login', () => {
  assert.deepEqual(decide('/', false), { type: 'redirect', to: '/login' })
})

test('apex /: authenticated falls through to tier-home redirect', () => {
  assert.deepEqual(decide('/', true), { type: 'redirect-tier' })
})

test('/login itself is public and never redirected', () => {
  assert.deepEqual(decide('/login', false), { type: 'next' })
  assert.deepEqual(decide('/login', true), { type: 'next' })
})

test('/playground is public preview — anon allowed', () => {
  assert.deepEqual(decide('/playground', false), { type: 'next' })
})

test('protected pages: anon → /login with ?next preserved', () => {
  assert.deepEqual(decide('/rehearse', false), {
    type: 'redirect',
    to: '/login?next=/rehearse',
  })
  assert.deepEqual(decide('/drone', false), {
    type: 'redirect',
    to: '/login?next=/drone',
  })
  assert.deepEqual(decide('/welcome', false), {
    type: 'redirect',
    to: '/login?next=/welcome',
  })
  assert.deepEqual(decide('/account', false), {
    type: 'redirect',
    to: '/login?next=/account',
  })
})

test('protected pages: authenticated falls through', () => {
  for (const p of ['/rehearse', '/drone', '/welcome', '/account']) {
    assert.deepEqual(decide(p, true), { type: 'next' })
  }
})

test('public API prefixes are never redirected', () => {
  for (const p of [
    '/api/billing/webhook',
    '/api/v1/coach/scenarios',
    '/_next/static/chunk.js',
    '/favicon.ico',
  ]) {
    assert.deepEqual(decide(p, false), { type: 'next' }, p)
  }
})

test('/pricing and /architecture are public', () => {
  assert.deepEqual(decide('/pricing', false), { type: 'next' })
  assert.deepEqual(decide('/architecture', false), { type: 'next' })
})

test('isPublic returns boolean for every probed path', () => {
  for (const p of ['/login', '/playground', '/pricing', '/architecture', '/rehearse', '/drone']) {
    assert.equal(typeof isPublic(p), 'boolean', p)
  }
})
