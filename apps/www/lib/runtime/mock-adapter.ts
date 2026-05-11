import { RuntimeAdapter, NepaInferenceResult, AnomalyEvent } from './types'
import crypto from 'crypto'

const j = (a: number, b: number) => +(Math.random() * (b - a) + a).toFixed(3)

export const mockAdapter: RuntimeAdapter = {
  name: 'mock',
  async inferFrame(_image, _meta): Promise<NepaInferenceResult> {
    return {
      detections: [
        { class: 'movement', score: j(0.7, 0.96), bbox: [12, 18, 80, 90] },
        { class: 'object',   score: j(0.55, 0.88), bbox: [110, 40, 60, 70] },
      ],
      stdp: { spike_rate_hz: j(180, 240), sparsity: j(0.92, 0.97), plasticity_events: Math.floor(j(40, 120)), energy_w: j(0.25, 0.45) },
      world_model: { horizon_frames: 16, prediction_error: j(0.04, 0.18), anomaly_flag: Math.random() > 0.82, latent_dim: 256 },
      latency_ms: Math.floor(j(8, 14)),
      runtime: 'mock',
    }
  },
  async inferVideo(_video, _meta) {
    return mockAdapter.inferFrame(Buffer.alloc(0), {})
  },
  async health() { return { ok: true, runtime: 'mock', version: 'sim-0.4.1', queue_depth: 0, uptime_s: process.uptime() } },
  async streamAnomalies(_userId, onA, signal) {
    while (!signal.aborted) {
      await new Promise(r => setTimeout(r, 3500 + Math.random() * 4000))
      if (signal.aborted) break
      const evt: AnomalyEvent = {
        id: 'anom_' + crypto.randomBytes(4).toString('hex'),
        kind: 'prediction_error_spike',
        score: j(0.6, 0.95),
        region: ['NW','NE','SW','SE','C'][Math.floor(Math.random() * 5)],
        source: 'mock-fleet',
        ts_ms: Date.now(),
        pred_err: j(0.18, 0.42),
      }
      onA(evt)
    }
  },
}
