import { RuntimeAdapter, NepaInferenceResult } from './types'

const BASE = process.env.NEPA_RUNTIME_TRITON!
const TIMEOUT = parseInt(process.env.NEPA_RUNTIME_TIMEOUT_MS ?? '8000', 10)

async function withTimeout<T>(p: Promise<T>): Promise<T> {
  return await Promise.race([
    p,
    new Promise<T>((_, rej) => setTimeout(() => rej(new Error('triton timeout')), TIMEOUT)),
  ])
}

export const tritonAdapter: RuntimeAdapter = {
  name: 'triton',
  async inferFrame(image, meta) {
    const t = Date.now()
    // KFServing v2: model "nepa_frame_multi"
    const body = {
      inputs: [
        { name: 'image', shape: [1], datatype: 'BYTES', data: [image.toString('base64')] },
        { name: 'meta',  shape: [1], datatype: 'BYTES', data: [JSON.stringify(meta)] },
      ],
    }
    const res = await withTimeout(fetch(`${BASE}/v2/models/nepa_frame_multi/infer`, {
      method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body),
    }))
    if (!res.ok) throw new Error(`triton ${res.status}`)
    const j = await res.json()
    // Expect Triton model to pack a JSON blob into output "result"
    const out = j.outputs?.find((o: any) => o.name === 'result')
    const parsed = out ? JSON.parse(Buffer.from(out.data[0], 'base64').toString('utf8')) : {}
    return {
      detections:  parsed.detections ?? [],
      stdp:        parsed.stdp ?? { spike_rate_hz: 0, sparsity: 0, plasticity_events: 0 },
      world_model: parsed.world_model ?? { horizon_frames: 16, prediction_error: 0, anomaly_flag: false },
      latency_ms:  parsed.latency_ms ?? (Date.now() - t),
      runtime:     'triton-' + (parsed.backend ?? 'x86'),
    }
  },
  async health() {
    const res = await withTimeout(fetch(`${BASE}/v2/health/ready`))
    return { ok: res.ok, runtime: 'triton', version: 'v2' }
  },
}
