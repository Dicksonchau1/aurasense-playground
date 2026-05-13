export interface Waypoint {
  id: string;
  seq: number;
  lat: number;
  lon: number;
  alt_m: number;
  hold_s?: number;
  action?: "fly" | "hover" | "capture" | "land";
}

export type ViolationCode =
  | "altitude_exceeds_ceiling"
  | "altitude_below_floor"
  | "leg_distance_exceeds_max"
  | "inside_nfz"
  | "battery_budget_exceeded"
  | "invalid_coords"
  | "duplicate_seq";

export interface Violation {
  waypoint_id: string;
  code: ViolationCode;
  message: string;
  severity: "error" | "warning";
}

export interface ValidationSummary {
  valid: boolean;
  score: number;            // 0..100
  total_distance_m: number;
  estimated_duration_s: number;
  estimated_wh: number;
  battery_margin_pct: number;
}

export interface ValidationResult {
  summary: ValidationSummary;
  violations: Violation[];
  per_waypoint: Record<string, { valid: boolean; codes: ViolationCode[] }>;
}

export interface ValidateRequest {
  drone_id: string;
  waypoints: Waypoint[];
}
