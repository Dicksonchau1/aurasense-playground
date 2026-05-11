export interface StepVerdictEvent {
  kind: "step_verdict";
  session_id: string;
  step_id: string;
  who_step: number;
  passed: boolean;
  confidence: number;
  signature: string;
  ts: string;
}export interface StepVerdictEvent {
  kind: "step_verdict";
  session_id: string;
  step_id: string;
  who_step: number;
  passed: boolean;
  confidence: number;
  signature: string;
  ts: string;
}
