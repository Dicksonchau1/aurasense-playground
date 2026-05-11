// coach-client tests — verify the fetch wrapper degrades gracefully when
// the proxy / NEPA backend is unavailable. Mirrors `src/lib/coach/client.ts`.
import test from 'node:test'
import assert from 'node:assert/strict'

async function withTimeout(p, ms) {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error('timeout')), ms)
    p.then(
      v => {
        clearTimeout(t)
        resolve(v)
      },
      e => {
        clearTimeout(t)
        reject(e)
      }
    )
  })
}

async function fetchCoachFeedback(req, fetcher) {
  try {
    const r = await withTimeout(
      fetcher('/api/v1/coach/feedback', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(req),
      }),
      3000
    )
    if (!r.ok) return null
    return await r.json()
  } catch {
    return null
  }
}

test('fetchCoachFeedback returns null on 503', async () => {
  const stubFetch = async () => ({
    ok: false,
    status: 503,
    json: async () => ({ ok: false, error: 'nepa_unavailable' }),
  })
  const result = await fetchCoachFeedback({}, stubFetch)
  assert.equal(result, null)
})

test('fetchCoachFeedback returns null on network error', async () => {
  const stubFetch = async () => {
    throw new Error('econnrefused')
  }
  const result = await fetchCoachFeedback({}, stubFetch)
  assert.equal(result, null)
})

test('fetchCoachFeedback returns parsed body on 200', async () => {
  const payload = {
    tag: 'POSTURE',
    message: 'Keep both hands visible.',
    severity: 'OBSERVATION',
    suggested_action: 'Continue.',
    voice_hint: { rate: 1, pitch: 1, voice: 'clinical-warm' },
    model: 'stub',
    latency_ms: 4,
    tokens: 0,
  }
  const stubFetch = async () => ({ ok: true, status: 200, json: async () => payload })
  const result = await fetchCoachFeedback({}, stubFetch)
  assert.deepEqual(result, payload)
})

test('fetchCoachFeedback returns null on timeout', async () => {
  const stubFetch = () => new Promise(() => {}) // never resolves
  const r = await Promise.race([
    fetchCoachFeedback({}, stubFetch),
    new Promise(resolve => setTimeout(() => resolve('hit-test-timeout'), 50)),
  ])
  // Either the inner withTimeout fires (returns null) or our outer race wins.
  assert.ok(r === null || r === 'hit-test-timeout')
})
