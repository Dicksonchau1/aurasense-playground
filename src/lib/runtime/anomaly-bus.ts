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
