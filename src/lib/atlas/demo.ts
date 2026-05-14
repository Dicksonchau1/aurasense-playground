import type {
  AtlasEvent,
  FlightSession,
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

import {
  completeRehearsal,
  createMission,
  exportAuditBundle,
  getReplayAuditBundle,
  promoteMissionToRehearse,
  sendFlightCommand,
  startFlightSession,
  startRehearsal,
  validateMission
} from "./client";

import missionFixture from "./fixtures/mission.json";
import missionValidationFixture from "./fixtures/mission-validation.json";
import rehearseLaunchFixture from "./fixtures/rehearse-launch.json";
import rehearsalVerdictFixture from "./fixtures/rehearsal-verdict.json";
import flightSessionFixture from "./fixtures/flight-session.json";
import telemetryFrameFixture from "./fixtures/telemetry-frame.json";
import replayAuditBundleFixture from "./fixtures/replay-audit-bundle.json";
import atlasEventsFixture from "./fixtures/atlas-events.json";

const DEMO_MODE =
  process.env.NEXT_PUBLIC_ATLAS_DATA_MODE === "demo" ||
  process.env.NEXT_PUBLIC_ATLAS_DATA_MODE === "fixture";

function delay(ms = 180): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function isAtlasDemoMode(): boolean {
  return DEMO_MODE;
}

export async function getDemoMission(): Promise<Mission> {
  await delay();
  return missionFixture as Mission;
}

export async function getDemoMissionValidation(): Promise<MissionValidationResult> {
  await delay();
  return missionValidationFixture as MissionValidationResult;
}

export async function getDemoRehearseLaunch(): Promise<RehearseLaunchResponse> {
  await delay();
  return rehearseLaunchFixture as RehearseLaunchResponse;
}

export async function getDemoRehearsalVerdict(): Promise<RehearsalVerdict> {
  await delay();
  return rehearsalVerdictFixture as RehearsalVerdict;
}

export async function getDemoFlightSession(): Promise<FlightSession> {
  await delay();
  return flightSessionFixture as FlightSession;
}

export async function getDemoReplayAuditBundle(): Promise<ReplayAuditBundle> {
  await delay();
  return replayAuditBundleFixture as ReplayAuditBundle;
}

export async function getDemoAtlasEvents(): Promise<AtlasEvent[]> {
  await delay();
  return atlasEventsFixture as AtlasEvent[];
}

export async function saveMission(input: Mission): Promise<MissionSaveResponse> {
  if (DEMO_MODE) {
    await delay();
    return {
      mission: { ...(missionFixture as Mission), ...input },
      revision_id: "rev_demo_001"
    };
  }
  return createMission(input);
}

export async function runMissionValidation(input: {
  mission_id: string;
  vehicle_id: string;
  ruleset: "atlas-default" | "hkcad" | "org-custom";
}): Promise<MissionValidationResult> {
  if (DEMO_MODE) {
    await delay();
    return missionValidationFixture as MissionValidationResult;
  }
  return validateMission(input);
}

export async function launchRehearsal(input: {
  mission_id: string;
  scenario_id?: string;
  environment_override?: Record<string, unknown>;
}): Promise<RehearseLaunchResponse> {
  if (DEMO_MODE) {
    await delay();
    return rehearseLaunchFixture as RehearseLaunchResponse;
  }
  return promoteMissionToRehearse(input);
}

export async function bootRehearsal(input: {
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
  if (DEMO_MODE) {
    await delay();
    return (rehearseLaunchFixture as RehearseLaunchResponse).scenario_runtime;
  }
  return startRehearsal(input);
}

export async function finalizeRehearsal(sessionId: string): Promise<RehearsalVerdict> {
  if (DEMO_MODE) {
    await delay();
    return {
      ...(rehearsalVerdictFixture as RehearsalVerdict),
      session_id: sessionId
    };
  }
  return completeRehearsal(sessionId);
}

export async function launchFlight(input: {
  mission_id: string;
  vehicle_id: string;
  source_session_id?: string;
}): Promise<FlightSession> {
  if (DEMO_MODE) {
    await delay();
    return {
      ...(flightSessionFixture as FlightSession),
      mission_id: input.mission_id,
      vehicle_id: input.vehicle_id,
      source_session_id:
        input.source_session_id ??
        (flightSessionFixture as FlightSession).source_session_id
    };
  }
  return startFlightSession(input);
}

export async function issueFlightCommand(
  sessionId: string,
  command: OperatorCommand
): Promise<OperatorCommandAck> {
  if (DEMO_MODE) {
    await delay();
    return {
      accepted: true,
      ack_code: "DEMO_OK",
      message: `Demo command accepted for ${sessionId}: ${command.type}`
    };
  }
  return sendFlightCommand(sessionId, command);
}

export async function loadReplayAuditBundle(
  sessionId: string
): Promise<ReplayAuditBundle> {
  if (DEMO_MODE) {
    await delay();
    return {
      ...(replayAuditBundleFixture as ReplayAuditBundle),
      source_session_id:
        sessionId === "sess_live_001"
          ? "sess_rehearse_001"
          : (replayAuditBundleFixture as ReplayAuditBundle).source_session_id
    };
  }
  return getReplayAuditBundle(sessionId);
}

export async function exportReplayAuditBundle(
  sessionId: string,
  format: "bundle" | "mbis" | "hkcad" | "jsonl"
) {
  if (DEMO_MODE) {
    await delay();
    return {
      audit_bundle_id: `audit_demo_${sessionId}_${format}`,
      artifacts: (replayAuditBundleFixture as ReplayAuditBundle).artifacts
    };
  }
  return exportAuditBundle(sessionId, { format });
}

export function getDemoTelemetryFrame() {
  return telemetryFrameFixture;
}
