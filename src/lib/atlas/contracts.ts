export type ISODateString = string;
export type MissionId = string;
export type VehicleId = string;
export type ScenarioId = string;
export type SessionId = string;
export type TraceId = string;
export type AuditBundleId = string;

export type Severity = "info" | "warning" | "critical";

export type GeoPoint = {
  lat: number;
  lng: number;
  alt_m?: number;
};

export type GeoPolygon = {
  points: GeoPoint[];
};

export type PayloadProfile = {
  camera: "rgb" | "thermal" | "multispectral";
  overlap_pct?: number;
  inspection_mode?: "crack" | "spalling" | "seepage" | "general";
};

export type EnvironmentPresetRef = {
  preset_id: string;
  label: string;
  wind_profile?: string;
  light_profile?: string;
  dust_profile?: string;
};

export type WaypointAction =
  | "WAYPOINT"
  | "TAKE_PHOTO"
  | "LOITER"
  | "RTL"
  | "LAND";

export type Waypoint = {
  waypoint_id: string;
  seq: number;
  lat: number;
  lng: number;
  alt_m: number;
  speed_ms?: number;
  hold_s?: number;
  heading_deg?: number;
  action?: WaypointAction;
  params?: Record<string, string | number | boolean>;
};

export type Mission = {
  mission_id: MissionId;
  org_id: string;
  title: string;
  description?: string;
  vehicle_id: VehicleId;
  mission_type: "facade_inspection" | "sweep" | "survey" | "training";
  status:
    | "draft"
    | "validated"
    | "rehearsed"
    | "armed"
    | "active"
    | "completed"
    | "aborted";
  waypoints: Waypoint[];
  geofence?: GeoPolygon;
  rally_points?: GeoPoint[];
  payload_profile?: PayloadProfile;
  environment_preset?: EnvironmentPresetRef;
  created_at: ISODateString;
  updated_at: ISODateString;
  created_by: string;
  tags?: string[];
};

export type MissionSaveResponse = {
  mission: Mission;
  revision_id: string;
};

export type MissionViolation = {
  code: string;
  severity: Severity;
  message: string;
  waypoint_id?: string;
  field?: string;
};

export type MissionValidationResult = {
  valid: boolean;
  score: number;
  violations: MissionViolation[];
  recommendations: string[];
};

export type EnvironmentRuntime = {
  wind_speed_ms: number;
  wind_direction_deg: number;
  gust_factor: number;
  sunlight_azimuth_deg: number;
  sunlight_elevation_deg: number;
  dust_density: number;
  visibility_m: number;
  timestamp_hkt: ISODateString;
};

export type ScenarioRuntime = {
  scenario_id: ScenarioId;
  session_id: SessionId;
  mission_id: MissionId;
  vehicle_id: VehicleId;
  environment: EnvironmentRuntime;
  started_at: ISODateString;
  state: "queued" | "running" | "paused" | "completed" | "failed";
};

export type RehearseLaunchResponse = {
  session_id: SessionId;
  mission_snapshot: Mission;
  scenario_runtime: ScenarioRuntime;
  launch_url: string;
};

export type PredictedRisk = {
  risk_id: string;
  category: "windsheer" | "drift" | "visibility" | "collision" | "coverage_gap";
  severity: "low" | "medium" | "high";
  message: string;
  waypoint_id?: string;
  confidence: number;
};

export type SuggestedAdjustment = {
  adjustment_id: string;
  target: "mission" | "environment" | "vehicle_profile";
  field: string;
  current_value: string | number | boolean;
  suggested_value: string | number | boolean;
  reason: string;
};

export type ArtifactKind =
  | "snapshot"
  | "video_clip"
  | "telemetry_csv"
  | "trace_jsonl"
  | "mbis_export"
  | "hkcad_csv";

export type ArtifactRef = {
  artifact_id: string;
  session_id: SessionId;
  kind: ArtifactKind;
  url: string;
  created_at: ISODateString;
};

export type RehearsalVerdict = {
  session_id: SessionId;
  mission_id: MissionId;
  passed: boolean;
  score: number;
  estimated_battery_margin_pct: number;
  predicted_risks: PredictedRisk[];
  suggested_adjustments: SuggestedAdjustment[];
  artifacts: ArtifactRef[];
};

export type FlightSession = {
  session_id: SessionId;
  mission_id: MissionId;
  vehicle_id: VehicleId;
  mode: "rehearsal" | "live";
  source: "mission_core" | "rehearse_promote";
  status:
    | "arming"
    | "armed"
    | "takeoff"
    | "in_mission"
    | "rtl"
    | "landed"
    | "aborted";
  started_at: ISODateString;
  ended_at?: ISODateString;
  source_session_id?: SessionId;
};

export type FlightStartRequest = {
  mission_id: MissionId;
  vehicle_id: VehicleId;
  source_session_id?: SessionId;
};

export type OperatorCommandType =
  | "ARM"
  | "DISARM"
  | "SET_MODE"
  | "TAKEOFF"
  | "RTL"
  | "LAND"
  | "PAUSE_MISSION"
  | "RESUME_MISSION";

export type OperatorCommand = {
  command_id: string;
  session_id: SessionId;
  issued_at: ISODateString;
  issued_by: string;
  type: OperatorCommandType;
  payload: Record<string, string | number | boolean>;
};

export type OperatorCommandAck = {
  accepted: boolean;
  ack_code?: string;
  message?: string;
};

export type TelemetryFrame = {
  session_id: SessionId;
  ts: ISODateString;
  lat: number;
  lng: number;
  alt_m: number;
  ground_speed_ms: number;
  heading_deg: number;
  battery_pct: number;
  gps_fix: number;
  link_quality_pct: number;
  flight_mode: string;
  imu?: {
    roll_deg: number;
    pitch_deg: number;
    yaw_deg: number;
    vibration_index?: number;
  };
};

export type TimelineEvent = {
  event_id: string;
  session_id: SessionId;
  ts: ISODateString;
  source: "mission" | "flight" | "rehearse" | "nepa" | "operator" | "policy";
  type: string;
  severity: Severity;
  message: string;
  data?: Record<string, unknown>;
  prev_hash?: string;
  hash?: string;
};

export type PolicyBlock = {
  code: string;
  message: string;
  blocked: boolean;
  severity: "warning" | "critical";
};

export type DecisionTrace = {
  trace_id: TraceId;
  session_id: SessionId;
  ts: ISODateString;
  decision_type: string;
  context_summary: string;
  inputs: Record<string, unknown>;
  output: Record<string, unknown>;
  confidence?: number;
  policy_blocks?: PolicyBlock[];
};

export type ReplayAuditBundle = {
  session: FlightSession | ScenarioRuntime;
  mission: Mission;
  telemetry_index: {
    samples: number;
    start_ts: ISODateString;
    end_ts: ISODateString;
  };
  events: TimelineEvent[];
  traces: DecisionTrace[];
  artifacts: ArtifactRef[];
  source_session_id?: SessionId;
};

export type AuditExportRequest = {
  format: "bundle" | "mbis" | "hkcad" | "jsonl";
};

export type AuditExportResponse = {
  audit_bundle_id: AuditBundleId;
  artifacts: ArtifactRef[];
};

export type AtlasEvent =
  | { type: "mission.saved"; mission_id: MissionId; revision_id: string }
  | { type: "mission.validated"; mission_id: MissionId; valid: boolean; score: number }
  | { type: "rehearse.started"; session_id: SessionId; mission_id: MissionId }
  | { type: "rehearse.completed"; session_id: SessionId; passed: boolean; score: number }
  | { type: "flight.started"; session_id: SessionId; mission_id: MissionId }
  | { type: "flight.telemetry"; session_id: SessionId; frame: TelemetryFrame }
  | { type: "flight.command_ack"; session_id: SessionId; command_id: string; accepted: boolean }
  | { type: "nepa.suggestion"; session_id: SessionId; trace_id: TraceId; summary: string }
  | { type: "audit.bundle_ready"; session_id: SessionId; audit_bundle_id: AuditBundleId };
