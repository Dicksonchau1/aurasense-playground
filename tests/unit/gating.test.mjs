// Smoke tests for src/lib/nepa/gating.ts.
//
// We can't import the TS source directly under `node --test` without a
// loader, so this file mirrors the gating contract documented in
// gating.ts and asserts the boundary conditions. If you change the
// thresholds or state machine in gating.ts, update this file in lockstep.
//
// Run with: npm test
import { test } from 'node:test'
import assert from 'node:assert/strict'

const PRED_NUDGE = 0.18
const PRED_SAFETY = 0.32
const MIN_DET = 0.45

function decide(result) {
  const pe = result.world_model?.prediction_error ?? 0
  const top = result.detections?.length
    ? Math.max(...result.detections.map(d => d.score ?? 0))
    : 0
  let state = 'stay_quiet'
  const reasons = []
  if (result.world_model?.anomaly_flag) {
    reasons.push('world_model.anomaly_flag')
    state = 'interrupt_for_safety'
  }
  if (pe >= PRED_SAFETY) {
    reasons.push('pe>=safety'); state = 'interrupt_for_safety'
  } else if (pe >= PRED_NUDGE && state !== 'interrupt_for_safety') {
    reasons.push('pe>=nudge'); state = 'nudge'
  }
  if (top > 0 && top < MIN_DET && state === 'stay_quiet') {
    reasons.push('top<min'); state = 'nudge'
  }
  return { state, reasons }
}

test('gating: stays quiet on confident, low-error frame', () => {
  const r = {
    detections: [{ class: 'object', score: 0.9, bbox: [0, 0, 10, 10] }],
    world_model: { prediction_error: 0.05, anomaly_flag: false },
  }
  assert.equal(decide(r).state, 'stay_quiet')
})

test('gating: nudges on moderate prediction error', () => {
  const r = {
    detections: [{ class: 'object', score: 0.9, bbox: [0, 0, 10, 10] }],
    world_model: { prediction_error: 0.22, anomaly_flag: false },
  }
  assert.equal(decide(r).state, 'nudge')
})

test('gating: nudges when top detection drops below confidence floor', () => {
  const r = {
    detections: [{ class: 'object', score: 0.3, bbox: [0, 0, 10, 10] }],
    world_model: { prediction_error: 0.05, anomaly_flag: false },
  }
  assert.equal(decide(r).state, 'nudge')
})

test('gating: interrupts for safety on prediction-error spike', () => {
  const r = {
    detections: [{ class: 'object', score: 0.9, bbox: [0, 0, 10, 10] }],
    world_model: { prediction_error: 0.4, anomaly_flag: false },
  }
  assert.equal(decide(r).state, 'interrupt_for_safety')
})

test('gating: interrupts for safety when world_model raises anomaly_flag', () => {
  const r = {
    detections: [{ class: 'object', score: 0.95, bbox: [0, 0, 10, 10] }],
    world_model: { prediction_error: 0.05, anomaly_flag: true },
  }
  assert.equal(decide(r).state, 'interrupt_for_safety')
})
