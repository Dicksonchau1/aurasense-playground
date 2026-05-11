/**
 * Thin fetch wrapper for the coach feedback API. Each function catches
 * network/HTTP errors and returns `null`/`false` rather than throwing —
 * components are expected to remain mounted even when NEPA is down.
 */
import type {
  CoachRequest,
  CoachResponse,
  CoachScenarioMap,
} from './types'

const VOICE_TIMEOUT_MS = 3000

async function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
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

export async function fetchCoachFeedback(
  req: CoachRequest
): Promise<CoachResponse | null> {
  try {
    const r = await withTimeout(
      fetch('/api/v1/coach/feedback', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(req),
      }),
      VOICE_TIMEOUT_MS
    )
    if (!r.ok) return null
    return (await r.json()) as CoachResponse
  } catch {
    return null
  }
}

export async function fetchCoachScenarios(): Promise<CoachScenarioMap | null> {
  try {
    const r = await fetch('/api/v1/coach/scenarios')
    if (!r.ok) return null
    const j = await r.json()
    if (j && typeof j === 'object' && 'scenarios' in j) {
      return (j as { scenarios: CoachScenarioMap }).scenarios
    }
    return j as CoachScenarioMap
  } catch {
    return null
  }
}

export async function playCoachVoice(
  text: string,
  voiceId = 'default',
  rate = 1.0
): Promise<boolean> {
  try {
    const r = await fetch('/api/v1/coach/voice', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ text: text.slice(0, 200), voice_id: voiceId, rate }),
    })
    if (!r.ok) return false
    const blob = await r.blob()
    const url = URL.createObjectURL(blob)
    const audio = new Audio(url)
    await audio.play().catch(() => undefined)
    return true
  } catch {
    return false
  }
}
