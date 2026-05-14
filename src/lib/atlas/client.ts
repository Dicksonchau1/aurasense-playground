import type {
  AuditExportRequest,
  AuditExportResponse,
  FlightSession,
  FlightStartRequest,
  Mission,
  MissionSaveResponse,
  MissionValidationResult,
  OperatorCommand,
  OperatorCommandAck,
  RehearsalVerdict,
  RehearseLaunchResponse,
  ReplayAuditBundle,
  ScenarioRuntime
} from "./contracts";

type Json = Record<string, unknown>;

async function request<T>(
  input: string,
  init?: RequestInit
): Promise<T> {
  const res = await fetch(input, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {})
    },
    cache: "no-store"
  });

  if (!res.ok) {
    let detail = `Request failed: ${res.status}`;
    try {
      const body = (await res.json()) as Json;
      if (typeof body.error === "string") detail = body.error;
      if (typeof body.message === "string") detail = body.message;
      if (typeof body.detail === "string") detail = body.detail;
    } catch {}
    throw new Error(detail);
  }

  return (await res.json()) as T;
}

export async function createMission(mission: Mission): Promise<MissionSaveResponse> {
  return request<MissionSaveResponse>("/api/atlas/missions", {
    method: "POST",
    body: JSON.stringify(mission)
  });
}

export async function validateMission(input: {
  mission_id: string;
  vehicle_id: string;
  ruleset: "atlas-default" | "hkcad" | "org-custom";
}): Promise<MissionValidationResult> {
  return request<MissionValidationResult>(`/api/atlas/missions/${input.mission_id}/validate`, {
    method: "POST",
    body: JSON.stringify(input)
  });
}

export async function promoteMissionToRehearse(input: {
  mission_id: string;
  scenario_id?: string;
  environment_override?: Record<string, unknown>;
}): Promise<RehearseLaunchResponse> {
  return request<RehearseLaunchResponse>(`/api/atlas/missions/${input.mission_id}/rehearse`, {
    method: "POST",
    body: JSON.stringify(input)
  });
}

export async function startRehearsal(input: {
  mission_id: string;
  vehicle_id: string;
  environment: {
    wind_speed_ms: number;
    wind_direction_deg: number;
    gust_factor: number;
    sunlight_azimuth_deg: number;
    sunlight_elevation_deg: number;
    dust_density: number;
    visibility_m: number;
    timestamp_hkt: string;
  };
}): Promise<ScenarioRuntime> {
  return request<ScenarioRuntime>("/api/atlas/rehearse/start", {
    method: "POST",
    body: JSON.stringify(input)
  });
}

export async function completeRehearsal(sessionId: string): Promise<RehearsalVerdict> {
  return request<RehearsalVerdict>(`/api/atlas/rehearse/${sessionId}/complete`, {
    method: "POST"
  });
}

export async function startFlightSession(
  input: FlightStartRequest
): Promise<FlightSession> {
  return request<FlightSession>("/api/atlas/flight/start", {
    method: "POST",
    body: JSON.stringify(input)
  });
}

export async function sendFlightCommand(
  sessionId: string,
  command: OperatorCommand
): Promise<OperatorCommandAck> {
  return request<OperatorCommandAck>(`/api/atlas/flight/${sessionId}/commands`, {
    method: "POST",
    body: JSON.stringify(command)
  });
}

export async function getReplayAuditBundle(
  sessionId: string
): Promise<ReplayAuditBundle> {
  return request<ReplayAuditBundle>(`/api/atlas/audit/${sessionId}`, {
    method: "GET"
  });
}

export async function exportAuditBundle(
  sessionId: string,
  payload: AuditExportRequest
): Promise<AuditExportResponse> {
  return request<AuditExportResponse>(`/api/atlas/audit/${sessionId}/export`, {
    method: "POST",
    body: JSON.stringify(payload)
  });
}
