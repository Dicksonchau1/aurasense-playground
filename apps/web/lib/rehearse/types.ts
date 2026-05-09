export type EnvSandbox = {
  time_of_day: string;          // "14:30"
  date: string;                 // "2026-05-09"
  cloud_cover_pct: number;
  wind_avg_mps: number;
  wind_direction_deg: number;
  gust_factor: number;
  turbulence: "perlin_low" | "perlin_med" | "perlin_high" | "windseer_kowloon";
  rain_mm_per_h: number;
  fog_visibility_m: number | null;     // null = ∞
  gps_drift_sigma_m: number;
};

export type RehearseRequest = {
  mission_id: string;
  policy: string;
  env: EnvSandbox;
  n_seeds?: number;             // default 3
  n_perturbations?: number;     // default 4
};

export type FailureMode = { tag: string; count: number; note?: string };

export type RehearseResult = {
  success_rate: number;         // 0..1
  confidence: number;           // ±band, 0..1
  runs_total: number;
  runs_succeeded: number;
  failure_modes: FailureMode[];
  recommendation: "GO" | "HOLD" | "NO-GO";
  replay_uri: string | null;
  run_id: string;
  started_at: string;
  finished_at: string;
};

export type RehearseStatus =
  | { state: "idle" }
  | { state: "queued"; run_id: string }
  | { state: "running"; run_id: string; progress: number; eta_s: number }
  | { state: "done"; result: RehearseResult }
  | { state: "error"; message: string };