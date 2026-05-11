/**
 * NEPA gating layer.
 *
 * Consumes a perception result (detections + STDP + world-model output) and
 * decides one of three actions for the agentic-flow / feedback layer:
 *
 *   - 'stay_quiet'           — system is confident, no intervention needed
 *   - 'nudge'                — soft cue (UI hint, gentle audio)
 *   - 'interrupt_for_safety' — hard interrupt; agentic flow MUST surface it
 *
 * The thresholds are env-overridable so operators can tune per-deployment
 * without a code release.
 *
 *   NEPA_GATE_PRED_ERR_NUDGE   default 0.18
 *   NEPA_GATE_PRED_ERR_SAFETY  default 0.32
 *   NEPA_GATE_MIN_DET_SCORE    default 0.45
 *
 * This module is pure and synchronous on purpose: gating must never add
 * measurable latency to the perception path.
 */

import type { NepaInferenceResult } from '@/lib/runtime/types'

export type GateState = 'stay_quiet' | 'nudge' | 'interrupt_for_safety'

export interface GateDecision {
  state: GateState
  reasons: string[]
  prediction_error: number
  top_detection_score: number
  thresholds: {
    pred_err_nudge: number
    pred_err_safety: number
    min_det_score: number
  }
}

function num(name: string, fallback: number): number {
  const raw = process.env[name]
  if (!raw) return fallback
  const v = Number(raw)
  return Number.isFinite(v) ? v : fallback
}

export function gateThresholds() {
  return {
    pred_err_nudge: num('NEPA_GATE_PRED_ERR_NUDGE', 0.18),
    pred_err_safety: num('NEPA_GATE_PRED_ERR_SAFETY', 0.32),
    min_det_score: num('NEPA_GATE_MIN_DET_SCORE', 0.45),
  }
}

export function decideGate(result: NepaInferenceResult): GateDecision {
  const t = gateThresholds()
  const pe = result.world_model?.prediction_error ?? 0
  const top = result.detections?.length
    ? Math.max(...result.detections.map(d => d.score ?? 0))
    : 0

  const reasons: string[] = []
  let state: GateState = 'stay_quiet'

  if (result.world_model?.anomaly_flag) {
    reasons.push('world_model.anomaly_flag')
    state = 'interrupt_for_safety'
  }
  if (pe >= t.pred_err_safety) {
    reasons.push(`prediction_error>=${t.pred_err_safety}`)
    state = 'interrupt_for_safety'
  } else if (pe >= t.pred_err_nudge && state !== 'interrupt_for_safety') {
    reasons.push(`prediction_error>=${t.pred_err_nudge}`)
    state = 'nudge'
  }
  if (top > 0 && top < t.min_det_score && state === 'stay_quiet') {
    reasons.push(`top_detection_score<${t.min_det_score}`)
    state = 'nudge'
  }

  return {
    state,
    reasons,
    prediction_error: pe,
    top_detection_score: top,
    thresholds: t,
  }
}
