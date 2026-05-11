export type NEPASource = 'webcam' | 'rtsp'

export interface NEPARegionMeta {
  /** 0-based row index in 3x3 grid */
  row: number
  /** 0-based col index in 3x3 grid */
  col: number
  /** 0–8 index in 3x3 grid (row * 3 + col) */
  index: number
}

export interface NEPAInferenceRequestMeta {
  source: NEPASource
  region: NEPARegionMeta
  userId?: string
}

export interface NEPADetection {
  id: string
  label: string
  confidence: number
  /** [x1,y1,x2,y2] normalized 0–1 in original video space */
  bbox: [number, number, number, number]
}

export interface NEPAWorldModel {
  crack_score: number
  temporal_consistency: number
  lane_entropy: number
  replay_detected: boolean
  [key: string]: unknown
}

export interface NEPAInferenceResponse {
  detections: NEPADetection[]
  world_model: NEPAWorldModel
  /** optional STDP or extra neuromorphic stats */
  stdp?: Record<string, unknown>
}
