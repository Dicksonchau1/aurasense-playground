export interface Detection { class: string; score: number; bbox: number[] }
export interface StdpStats { spike_rate_hz: number; sparsity: number; plasticity_events: number; energy_w?: number }
export interface WorldModelStats { horizon_frames: number; prediction_error: number; anomaly_flag: boolean; latent_dim?: number }
export interface NepaInferenceResult {
  detections: Detection[]
  stdp: StdpStats
  world_model: WorldModelStats
  latency_ms: number
  runtime: string
}
export interface RuntimeAdapter {
  name: string
  inferFrame(image: Buffer, meta: { source?: string; region?: string; userId?: string }): Promise<NepaInferenceResult>
  inferVideo?(video: Buffer, meta: { filename?: string; userId?: string }): Promise<NepaInferenceResult>
  health(): Promise<{ ok: boolean; runtime: string; version?: string; queue_depth?: number; uptime_s?: number }>
  streamAnomalies?(userId: string, onAnomaly: (a: AnomalyEvent) => void, signal: AbortSignal): Promise<void>
}
export interface AnomalyEvent {
  id: string; kind: string; score: number; region: string; source: string; ts_ms: number; pred_err: number
}
