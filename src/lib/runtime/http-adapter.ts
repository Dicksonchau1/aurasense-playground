import { RuntimeAdapter, NepaInferenceResult } from './types'

const BASE = process.env.NEPA_RUNTIME_URL!
const TOKEN = process.env.NEPA_RUNTIME_TOKEN
const TIMEOUT = parseInt(process.env.NEPA_RUNTIME_TIMEOUT_MS ?? '8000', 10)

function headers(extra: Record<string, string> = {}) {
  const h: Record<string, string> = { ...extra }
  if (TOKEN) h['authorization'] = `Bearer ${TOKEN}`
  return h
}

async function withTimeout<T>(p: Promise<T>): Promise<T> {
  return await Promise.race([
    p,
    new Promise<T>((_, rej) => setTimeout(() => rej(new Error('NEPA runtime timeout')), TIMEOUT)),
  ])
}

export const httpAdapter: RuntimeAdapter = {
  name: 'http',
  async inferFrame(image, meta) {
    const t = Date.now()
    const fd = new FormData()
    fd.append('image', new Blob([image], { type: 'image/jpeg' }), 'frame.jpg')
    if (meta.source) fd.append('source', meta.source)
    if (meta.region) fd.append('region', meta.region)
    if (meta.userId) fd.append('user_id', meta.userId)
    const res = await withTimeout(fetch(`${BASE}/infer/frame`, { method: 'POST', body: fd, headers: headers() }))
    if (!res.ok) throw new Error(`runtime ${res.status}`)
    const j = await res.json()
    return {
      detections:  j.detections ?? [],
      stdp:        j.stdp ?? { spike_rate_hz: 0, sparsity: 0, plasticity_events: 0 },
      world_model: j.world_model ?? j.world ?? { horizon_frames: 16, prediction_error: 0, anomaly_flag: false },
      latency_ms:  j.latency_ms ?? (Date.now() - t),
      runtime:     j.runtime ?? 'http',
    }
  },
  async inferVideo(video, meta) {
    const t = Date.now()
    const fd = new FormData()
    fd.append('video', new Blob([video], { type: 'video/mp4' }), meta.filename ?? 'clip.mp4')
    if (meta.userId) fd.append('user_id', meta.userId)
    const res = await withTimeout(fetch(`${BASE}/infer/video`, { method: 'POST', body: fd, headers: headers() }))
    if (!res.ok) throw new Error(`runtime ${res.status}`)
    const j = await res.json()
    return { ...j, latency_ms: j.latency_ms ?? (Date.now() - t), runtime: j.runtime ?? 'http' } as NepaInferenceResult
  },
  async health() {
    const res = await withTimeout(fetch(`${BASE}/health`, { headers: headers() }))
    if (!res.ok) return { ok: false, runtime: 'http' }
    return await res.json()
  },
  async streamAnomalies(userId, onA, signal) {
    const url = `${BASE}/stream/anomalies?user_id=${encodeURIComponent(userId)}`
    const res = await fetch(url, { headers: headers({ accept: 'text/event-stream' }), signal })
    if (!res.body) throw new Error('no stream body')
    const reader = res.body.getReader()
    const dec = new TextDecoder()
    let buf = ''
    while (!signal.aborted) {
      const { value, done } = await reader.read()
      if (done) break
      buf += dec.decode(value, { stream: true })
      const events = buf.split('\n\n')
      buf = events.pop() ?? ''
      for (const block of events) {
        const data = block.split('\n').filter(l => l.startsWith('data:')).map(l => l.slice(5).trim()).join('')
        if (data) try { onA(JSON.parse(data)) } catch {}
      }
    }
  },
}
