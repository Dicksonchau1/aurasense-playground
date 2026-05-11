/**
 * Coach feedback types — mirrors `services/coach_feedback/service.py` in NEPA.
 * Keep in lockstep with the backend dataclasses.
 */

export type CoachSeverity = 'OBSERVATION' | 'CORRECTION' | 'WARNING' | 'PRAISE'
export type CoachTag =
  | 'POSTURE'
  | 'TECHNIQUE'
  | 'TIMING'
  | 'SAFETY'
  | 'COMPLIANCE'
  | 'ENCOURAGEMENT'

export type CoachScenario =
  | 'who-handwash'
  | 'fall-risk-tug'
  | 'bed-mobility'
  | 'wound-dressing'
  | 'iv-setup'
  | 'ng-tube'
  | 'trach-care'
  | (string & {})

export interface CoachKpi {
  coverage: number
  steadiness: number
  compliance: number
  audit_confidence: number
  anomalies_count: number
}

export interface CoachVerdict {
  ts: number
  step: number
  conf: number
  latency_ms: number
  anomaly?: string
}

export interface CoachRequest {
  session_id: string
  scenario: CoachScenario
  step: number
  total_steps: number
  kpi: CoachKpi
  recent_verdicts: CoachVerdict[]
  elapsed_sec: number
  tier: 'free' | 'nursing' | 'enterprise'
}

export interface CoachVoiceHint {
  rate: number
  pitch: number
  voice: string
}

export interface CoachResponse {
  tag: CoachTag | string
  message: string
  severity: CoachSeverity
  suggested_action: string | null
  voice_hint: CoachVoiceHint
  model: string
  latency_ms: number
  tokens: number
}

export interface CoachScenarioRubric {
  steps: string[]
  key_signals: string[]
  tone: string
}

export type CoachScenarioMap = Record<string, CoachScenarioRubric>

export const SEVERITY_COLORS: Record<CoachSeverity, string> = {
  OBSERVATION: '#22d3ee',
  CORRECTION: '#f59e0b',
  WARNING: '#ef4444',
  PRAISE: '#10b981',
}
