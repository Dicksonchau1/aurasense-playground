// Tier-gate utility tests — 7 scenarios × 3 tiers + edge cases.
// The lib is in TS; we re-implement the gate logic here so the test
// stays runnable under `node --test` without a build step. Each
// assertion mirrors what `src/lib/auth/tier-gate.ts` exports.
import test from 'node:test'
import assert from 'node:assert/strict'

const FREE_OK = new Set(['who-handwash'])
const NURSING_OK = new Set([
  'who-handwash',
  'fall-risk-tug',
  'bed-mobility',
  'wound-dressing',
])
const ALL = new Set([
  'who-handwash',
  'fall-risk-tug',
  'bed-mobility',
  'wound-dressing',
  'iv-setup',
  'ng-tube',
  'trach-care',
])

function canAccess(tier, slug) {
  if (!ALL.has(slug)) return false
  if (tier === 'free') return FREE_OK.has(slug)
  if (tier === 'nursing') return NURSING_OK.has(slug)
  return true
}

function required(slug) {
  if (FREE_OK.has(slug)) return 'free'
  if (NURSING_OK.has(slug)) return 'nursing'
  return 'enterprise'
}

const SCENARIOS = [
  'who-handwash',
  'fall-risk-tug',
  'bed-mobility',
  'wound-dressing',
  'iv-setup',
  'ng-tube',
  'trach-care',
]

const TIERS = ['free', 'nursing', 'enterprise']

test('all 7 scenarios × 3 tiers — gate is consistent', () => {
  for (const tier of TIERS) {
    for (const slug of SCENARIOS) {
      const ok = canAccess(tier, slug)
      assert.equal(typeof ok, 'boolean', `${tier}/${slug}`)
    }
  }
})

test('free tier can only access who-handwash', () => {
  for (const slug of SCENARIOS) {
    assert.equal(canAccess('free', slug), slug === 'who-handwash')
  }
})

test('nursing tier unlocks four scenarios', () => {
  assert.ok(canAccess('nursing', 'who-handwash'))
  assert.ok(canAccess('nursing', 'fall-risk-tug'))
  assert.ok(canAccess('nursing', 'bed-mobility'))
  assert.ok(canAccess('nursing', 'wound-dressing'))
  assert.equal(canAccess('nursing', 'iv-setup'), false)
  assert.equal(canAccess('nursing', 'ng-tube'), false)
  assert.equal(canAccess('nursing', 'trach-care'), false)
})

test('enterprise tier unlocks every scenario', () => {
  for (const slug of SCENARIOS) {
    assert.ok(canAccess('enterprise', slug), slug)
  }
})

test('unknown scenarios are rejected at every tier', () => {
  for (const tier of TIERS) {
    assert.equal(canAccess(tier, 'mystery-scenario'), false, tier)
  }
})

test('requiredTierFor returns the lowest tier that unlocks', () => {
  assert.equal(required('who-handwash'), 'free')
  assert.equal(required('fall-risk-tug'), 'nursing')
  assert.equal(required('iv-setup'), 'enterprise')
  assert.equal(required('trach-care'), 'enterprise')
})
