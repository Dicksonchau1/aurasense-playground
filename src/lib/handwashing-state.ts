// WHO 7-step hand hygiene state machine
// Reference: WHO "How to handrub" — 7 steps after applying soap
// https://www.who.int/publications/m/item/how-to-handrub
//
// Each step has a minimum duration in milliseconds.
// Total recommended duration: 20-30 seconds.

export type StepId =
  | "palm_to_palm"
  | "back_of_hands"
  | "interlaced_fingers"
  | "backs_of_fingers"
  | "thumb_rotation"
  | "fingertip_circles"
  | "wrist_rotation";

export type Step = {
  id: StepId;
  label: string;
  description: string;
  minDurationMs: number;
};

export const WHO_STEPS: Step[] = [
  { id: "palm_to_palm",       label: "Palm to palm",           description: "Rub palms together with fingers interlocked",    minDurationMs: 3000 },
  { id: "back_of_hands",      label: "Back of hands",          description: "Right palm over left dorsum, then switch",        minDurationMs: 3000 },
  { id: "interlaced_fingers", label: "Interlaced fingers",     description: "Palm to palm, fingers interlaced",                minDurationMs: 3000 },
  { id: "backs_of_fingers",   label: "Backs of fingers",       description: "Backs of fingers to opposing palms, locked",      minDurationMs: 3000 },
  { id: "thumb_rotation",     label: "Thumb rotation",         description: "Rotational rubbing of left thumb in right palm",  minDurationMs: 3000 },
  { id: "fingertip_circles",  label: "Fingertip circles",      description: "Fingertips of right hand in left palm, circular", minDurationMs: 3000 },
  { id: "wrist_rotation",     label: "Wrist rotation",         description: "Rotational rubbing around wrists",                minDurationMs: 3000 },
];

export const RECOMMENDED_TOTAL_MS = 20000;

export type StepResult = {
  step: Step;
  detectedMs: number;       // total ms hands were detected during this step
  passed: boolean;          // true if detectedMs >= minDurationMs
};

export type SessionState = {
  startedAt: number | null;
  endedAt: number | null;
  currentStepIndex: number;
  stepResults: StepResult[];
};

export function createInitialState(): SessionState {
  return {
    startedAt: null,
    endedAt: null,
    currentStepIndex: 0,
    stepResults: WHO_STEPS.map((step) => ({
      step,
      detectedMs: 0,
      passed: false,
    })),
  };
}

export function tickStep(
  state: SessionState,
  handsDetected: boolean,
  elapsedMs: number,
): SessionState {
  if (state.currentStepIndex >= WHO_STEPS.length) return state;

  const current = state.stepResults[state.currentStepIndex];
  const updatedDetectedMs = handsDetected
    ? current.detectedMs + elapsedMs
    : current.detectedMs;

  const passed = updatedDetectedMs >= current.step.minDurationMs;
  const shouldAdvance = passed;

  const newResults = [...state.stepResults];
  newResults[state.currentStepIndex] = {
    ...current,
    detectedMs: updatedDetectedMs,
    passed,
  };

  return {
    ...state,
    currentStepIndex: shouldAdvance
      ? state.currentStepIndex + 1
      : state.currentStepIndex,
    stepResults: newResults,
  };
}

export function isSessionComplete(state: SessionState): boolean {
  return state.currentStepIndex >= WHO_STEPS.length;
}

export function summarize(state: SessionState) {
  const totalDetectedMs = state.stepResults.reduce((sum, r) => sum + r.detectedMs, 0);
  const stepsPassed = state.stepResults.filter((r) => r.passed).length;
  return {
    totalDetectedMs,
    stepsPassed,
    stepsTotal: WHO_STEPS.length,
    meetsWhoMinimum: totalDetectedMs >= RECOMMENDED_TOTAL_MS,
  };
}
