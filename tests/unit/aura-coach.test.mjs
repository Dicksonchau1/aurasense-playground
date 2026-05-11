// AuraCoach helpers — severity mapping, color mapping, fallback message
// shaping. Mirrors `src/lib/coach/messages.ts` and `types.ts` so the test
// stays runnable under `node --test` without a build step.
import test from 'node:test'
import assert from 'node:assert/strict'

const SEVERITY_COLORS = {
  OBSERVATION: '#22d3ee',
  CORRECTION: '#f59e0b',
  WARNING: '#ef4444',
  PRAISE: '#10b981',
}

function severityFromKpi(kpi) {
  if (kpi.anomalies_count >= 2) return 'WARNING'
  if (kpi.compliance >= 85) return 'PRAISE'
  if (kpi.compliance < 60 || kpi.steadiness < 50) return 'CORRECTION'
  return 'OBSERVATION'
}

function tagFromSeverity(sev) {
  if (sev === 'WARNING') return 'SAFETY'
  if (sev === 'CORRECTION') return 'TECHNIQUE'
  if (sev === 'PRAISE') return 'ENCOURAGEMENT'
  return 'POSTURE'
}

test('severity: WARNING when anomalies >= 2', () => {
  assert.equal(
    severityFromKpi({ coverage: 90, steadiness: 90, compliance: 90, audit_confidence: 90, anomalies_count: 2 }),
    'WARNING'
  )
})

test('severity: PRAISE when compliance >= 85 and no anomalies', () => {
  assert.equal(
    severityFromKpi({ coverage: 80, steadiness: 80, compliance: 90, audit_confidence: 80, anomalies_count: 0 }),
    'PRAISE'
  )
})

test('severity: CORRECTION when compliance < 60', () => {
  assert.equal(
    severityFromKpi({ coverage: 70, steadiness: 70, compliance: 55, audit_confidence: 70, anomalies_count: 0 }),
    'CORRECTION'
  )
})

test('severity: CORRECTION when steadiness < 50', () => {
  assert.equal(
    severityFromKpi({ coverage: 70, steadiness: 40, compliance: 70, audit_confidence: 70, anomalies_count: 0 }),
    'CORRECTION'
  )
})

test('severity: OBSERVATION on baseline', () => {
  assert.equal(
    severityFromKpi({ coverage: 75, steadiness: 75, compliance: 70, audit_confidence: 75, anomalies_count: 0 }),
    'OBSERVATION'
  )
})

test('every severity has a distinct color', () => {
  const values = Object.values(SEVERITY_COLORS)
  assert.equal(new Set(values).size, values.length)
})

test('tag from severity matches expected mapping', () => {
  assert.equal(tagFromSeverity('WARNING'), 'SAFETY')
  assert.equal(tagFromSeverity('CORRECTION'), 'TECHNIQUE')
  assert.equal(tagFromSeverity('PRAISE'), 'ENCOURAGEMENT')
  assert.equal(tagFromSeverity('OBSERVATION'), 'POSTURE')
})
