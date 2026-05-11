/**
 * Templated fallback coach messages used when NEPA is unreachable.
 * One per scenario, severity-aware. Keeps the coach UX alive even if the
 * backend is down or `OPENROUTER_API_KEY` is unset.
 */
import type { CoachKpi, CoachResponse, CoachScenario, CoachSeverity } from './types'

interface Template {
  observation: string
  correction: string
  warning: string
  praise: string
  suggested: string
}

const TEMPLATES: Record<string, Template> = {
  'who-handwash': {
    observation: 'Keep both hands visible and maintain even soap coverage.',
    correction: 'Slow the motion — aim for at least 4 seconds per step.',
    warning: 'Hands left frame. Re-center and continue interlaced rub.',
    praise: 'Great form. Coverage and timing are on target.',
    suggested: 'Hold each step ~4s.',
  },
  'fall-risk-tug': {
    observation: 'Watch the patient gait and timer together.',
    correction: 'Cue the patient to push from the chair arms.',
    warning: 'TUG over 14s — flag elevated fall risk.',
    praise: 'Clean TUG protocol — clear cues, clean handoff.',
    suggested: 'Mark TUG time now.',
  },
  'bed-mobility': {
    observation: 'Maintain neutral spine while assisting transfer.',
    correction: 'Bend knees, hinge from the hips during the pivot.',
    warning: 'Loss of spinal neutral — pause and reset.',
    praise: 'Excellent body mechanics through the transfer.',
    suggested: 'Reset stance.',
  },
  'wound-dressing': {
    observation: 'Maintain sterile field on the right of the trolley.',
    correction: 'Re-glove — your dominant hand crossed the field.',
    warning: 'Sterile breach detected — abort and re-set.',
    praise: 'Sterile technique held throughout the dressing change.',
    suggested: 'Replace gloves.',
  },
  'iv-setup': {
    observation: 'Vein palpated. Continue with tourniquet and prep.',
    correction: 'Anchor the vein with traction below the site.',
    warning: 'Multiple attempts — escalate per HKHA protocol.',
    praise: 'Clean first-pass cannulation. Good flash check.',
    suggested: 'Anchor below site.',
  },
  'ng-tube': {
    observation: 'Measure NEX before insertion.',
    correction: 'Tilt the head forward as the tube passes the pharynx.',
    warning: 'Patient coughing — withdraw and reassess airway.',
    praise: 'Placement confirmed and secured cleanly.',
    suggested: 'Chin to chest.',
  },
  'trach-care': {
    observation: 'Suction passes look measured and brief.',
    correction: 'Limit each suction pass to under 10 seconds.',
    warning: 'Desaturation risk — pre-oxygenate before next pass.',
    praise: 'Clean trach care with full sterile compliance.',
    suggested: 'Pre-oxygenate.',
  },
}

const GENERIC: Template = {
  observation: 'Keep your form steady and proceed to the next step.',
  correction: 'Adjust your pace and re-check the rubric.',
  warning: 'Anomaly detected — pause and reset technique.',
  praise: 'Great execution — keep the same tempo.',
  suggested: 'Continue.',
}

export function severityFromKpi(kpi: CoachKpi): CoachSeverity {
  if (kpi.anomalies_count >= 2) return 'WARNING'
  if (kpi.compliance >= 85) return 'PRAISE'
  if (kpi.compliance < 60 || kpi.steadiness < 50) return 'CORRECTION'
  return 'OBSERVATION'
}

export function tagFromSeverity(sev: CoachSeverity): string {
  switch (sev) {
    case 'WARNING':
      return 'SAFETY'
    case 'CORRECTION':
      return 'TECHNIQUE'
    case 'PRAISE':
      return 'ENCOURAGEMENT'
    default:
      return 'POSTURE'
  }
}

export function fallbackCoachResponse(
  scenario: CoachScenario,
  kpi: CoachKpi
): CoachResponse {
  const tpl = TEMPLATES[scenario] ?? GENERIC
  const sev = severityFromKpi(kpi)
  const message =
    sev === 'WARNING'
      ? tpl.warning
      : sev === 'PRAISE'
        ? tpl.praise
        : sev === 'CORRECTION'
          ? tpl.correction
          : tpl.observation
  return {
    tag: tagFromSeverity(sev),
    message,
    severity: sev,
    suggested_action: tpl.suggested,
    voice_hint: { rate: 1.0, pitch: 1.0, voice: 'clinical-warm' },
    model: 'fallback-local',
    latency_ms: 0,
    tokens: 0,
  }
}
