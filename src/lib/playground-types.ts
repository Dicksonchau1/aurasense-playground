export type NepaBlockKey =
  | 'early_discard'
  | 'roi_only'
  | 'polygon_zone'
  | 'imu_parse'
  | 'events_only'

export interface NepaDetection {
  /** Class label (e.g. "person", "vehicle"). */
  cls: string
  /** Confidence 0..1. */
  conf: number
  /** Normalised bbox [x, y, w, h] in 0..1 of the displayed video frame. */
  bbox: [number, number, number, number]
  /** Optional per-block latency in ms keyed by block id. */
  block_latency_ms?: Partial<Record<NepaBlockKey, number>>
}

export interface NepaFrameStats {
  ts_ms: number
  p50_ms: number
  p95_ms: number
  fps?: number
  detections?: NepaDetection[]
  /** Active block chain reported by the edge service. */
  chain?: NepaBlockKey[]
}

export interface NepaSseEvent {
  type: 'stats' | 'detections' | 'anomaly' | 'state'
  data: NepaFrameStats | Record<string, unknown>
}

/** Blocks free users may toggle without hitting a paywall. */
export const FREE_BLOCKS: NepaBlockKey[] = ['early_discard', 'roi_only']
/** Blocks gated to paid plans (rehearse_pro / enterprise on the edge). */
export const PRO_BLOCKS: NepaBlockKey[] = ['polygon_zone', 'imu_parse', 'events_only']

export const BLOCK_LABELS: Record<NepaBlockKey, string> = {
  early_discard: 'Early discard',
  roi_only:      'ROI only',
  polygon_zone:  'Polygon zone',
  imu_parse:     'IMU parse',
  events_only:   'Events only',
}
