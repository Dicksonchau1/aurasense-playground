/**
 * In-process anomaly pub/sub.
 *
 * SCOPE: single Node.js process. Subscribers and publishers must live in the
 * same instance for events to be delivered. This is fine for:
 *   - local dev
 *   - the Jetson edge runtime (one process per device)
 *   - small Vercel deployments while there is exactly one warm function
 *     handling both `/api/nepa/inference/frame` and `/api/nepa/anomalies/stream`
 *
 * BREAKS UNDER HORIZONTAL SCALE: if Vercel spins up multiple instances, an
 * anomaly published on instance A will not reach an SSE subscriber on
 * instance B. Replace with Upstash Redis pub/sub (or equivalent fan-out)
 * before scaling out. Tracked in AUDIT_2026_05.md §12.
 */
import type { AnomalyEvent } from './types'

type Subscriber = (a: AnomalyEvent) => void
const subs = new Map<string, Set<Subscriber>>()

export function subscribe(userId: string, fn: Subscriber): () => void {
  if (!subs.has(userId)) subs.set(userId, new Set())
  subs.get(userId)!.add(fn)
  return () => {
    subs.get(userId)?.delete(fn)
    if (subs.get(userId)?.size === 0) subs.delete(userId)
  }
}

export function publish(userId: string, evt: AnomalyEvent) {
  subs.get(userId)?.forEach(fn => { try { fn(evt) } catch {} })
  subs.get('*')?.forEach(fn => { try { fn(evt) } catch {} })
}

/** Start the runtime stream for a user — only one upstream per user. */
const upstreams = new Map<string, AbortController>()
export function ensureUpstream(userId: string, runtime: { streamAnomalies?: any; name: string }) {
  if (upstreams.has(userId)) return
  if (!runtime.streamAnomalies) return
  const ac = new AbortController()
  upstreams.set(userId, ac)
  runtime.streamAnomalies(userId, (a: AnomalyEvent) => publish(userId, a), ac.signal)
    .catch((e: any) => console.error('[anomaly-bus] upstream', runtime.name, 'died:', e?.message))
    .finally(() => upstreams.delete(userId))
}
export function stopUpstream(userId: string) {
  upstreams.get(userId)?.abort(); upstreams.delete(userId)
}
