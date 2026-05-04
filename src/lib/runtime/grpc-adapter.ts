import path from 'path'
import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'
import { RuntimeAdapter, NepaInferenceResult, AnomalyEvent } from './types'

const ADDR = process.env.NEPA_RUNTIME_GRPC!
const PROTO_PATH = path.join(process.cwd(), 'src/proto/nepa.proto')

let _client: any = null
function client() {
  if (_client) return _client
  const def = protoLoader.loadSync(PROTO_PATH, { keepCase: false, longs: String, defaults: true, oneofs: true })
  const pkg: any = grpc.loadPackageDefinition(def).nepa.v1
  _client = new pkg.NepaRuntime(ADDR, grpc.credentials.createInsecure())
  return _client
}

function call<T>(method: string, payload: any): Promise<T> {
  return new Promise((resolve, reject) => {
    const c = client()
    const deadline = new Date(Date.now() + parseInt(process.env.NEPA_RUNTIME_TIMEOUT_MS ?? '8000', 10))
    c[method](payload, { deadline }, (err: any, resp: T) => err ? reject(err) : resolve(resp))
  })
}

function mapResult(r: any, started: number): NepaInferenceResult {
  return {
    detections:  (r.detections ?? []).map((d: any) => ({ class: d.class, score: d.score, bbox: d.bbox ?? [] })),
    stdp:        { spike_rate_hz: r.stdp?.spikeRateHz ?? 0, sparsity: r.stdp?.sparsity ?? 0, plasticity_events: r.stdp?.plasticityEvents ?? 0, energy_w: r.stdp?.energyW },
    world_model: { horizon_frames: r.world?.horizonFrames ?? 16, prediction_error: r.world?.predictionError ?? 0, anomaly_flag: !!r.world?.anomalyFlag, latent_dim: r.world?.latentDim },
    latency_ms:  r.latencyMs ?? (Date.now() - started),
    runtime:     r.runtime ?? 'grpc',
  }
}

export const grpcAdapter: RuntimeAdapter = {
  name: 'grpc',
  async inferFrame(image, meta) {
    const t = Date.now()
    const r: any = await call('InferFrame', {
      imageJpeg: image, source: meta.source ?? '', region: meta.region ?? '', userId: meta.userId ?? '',
    })
    return mapResult(r, t)
  },
    async inferVideo(video, meta) {
    const t = Date.now()
    const r: any = await call('InferVideo', {
      videoMp4: video, filename: meta.filename ?? '', userId: meta.userId ?? '',
    })
    return mapResult(r, t)
  },
  async health() {
    try {
      const r: any = await call('Health', {})
      return { ok: !!r.ok, runtime: r.runtime ?? 'grpc', version: r.version, queue_depth: r.queueDepth, uptime_s: r.uptimeS }
    } catch { return { ok: false, runtime: 'grpc' } }
  },
  async streamAnomalies(userId, onA, signal) {
    return new Promise((resolve, reject) => {
      const c = client()
      const stream = c.StreamAnomalies({ userId })
      const abort = () => { try { stream.cancel() } catch {} }
      signal.addEventListener('abort', abort)
      stream.on('data', (a: any) => {
        const evt: AnomalyEvent = {
          id: a.id, kind: a.kind, score: a.score, region: a.region,
          source: a.source, ts_ms: Number(a.tsMs ?? Date.now()), pred_err: a.predErr ?? 0,
        }
        onA(evt)
      })
      stream.on('end',   () => { signal.removeEventListener('abort', abort); resolve() })
      stream.on('error', (e: any) => { signal.removeEventListener('abort', abort); reject(e) })
    })
  },
}
