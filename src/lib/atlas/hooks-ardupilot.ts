"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
"use client";
export type CalibrationStage =
  | "idle"
  | "queued"
  | "running"
  | "success"
  | "warning"
  | "error";

export type CalibrationAxisStep = {
  key: string;
  label: string;
  done: boolean;
};

export type CalibrationState = {
  type: "accelerometer" | "compass";
  status: CalibrationStage;
  progressPct: number;
  currentStepLabel: string;
  steps: CalibrationAxisStep[];
  message: string;
  updatedAt: string;
};

export type FlightModeOption = {
  key: string;
  label: string;
  supported: boolean;
};

export type FlightModeState = {
  currentMode: string;
  targetMode: string | null;
  changing: boolean;
  armable: boolean;
  armed: boolean;
  gpsFix: number;
  batteryPct: number;
  availableModes: FlightModeOption[];
  lastAck: string;
  updatedAt: string;
};

export type ArduPilotParameter = {
  key: string;
  label: string;
  category: "safety" | "navigation" | "battery" | "ekf" | "camera";
  value: string | number | boolean;
  pendingValue?: string | number | boolean;
  unit?: string;
  description: string;
  liveEditable: boolean;
  dirty: boolean;
};

export type ParametersState = {
  parameters: ArduPilotParameter[];
  selectedCategory: "all" | "safety" | "navigation" | "battery" | "ekf" | "camera";
  query: string;
  saving: boolean;
  lastAck: string;
  updatedAt: string;
};

export type TelemetryHealthState = {
  batteryPct: number;
  batteryVoltage: number;
  gpsFix: number;
  satellites: number;
  linkQualityPct: number;
  ekfHealthy: boolean;
  vibrationIndex: number;
  armReady: boolean;
  currentMode: string;
  warnings: string[];
  updatedAt: string;
};

export type FailsafePolicyKey =
  | "battery"
  | "linkLoss"
  | "geofence"
  | "navigation";

export type FailsafePolicyAction =
  | "warn"
  | "hold"
  | "rtl"
  | "land"
  | "disarm-block";

export type FailsafePolicy = {
  key: FailsafePolicyKey;
  label: string;
  action: FailsafePolicyAction;
  enabled: boolean;
  description: string;
  severity: "info" | "warning" | "critical";
};

export type FailsafeState = {
  policies: FailsafePolicy[];
  profileLabel: "conservative" | "balanced" | "permissive";
  lastAck: string;
  saving: boolean;
  updatedAt: string;
};

export type MissionCommandKey =
  | "hold"
  | "resume"
  | "rtl"
  | "land"
  | "pause"
  | "skip-wp";

export type MissionCommandItem = {
  key: MissionCommandKey;
  label: string;
  description: string;
  dangerous?: boolean;
};

export type MissionCommandsState = {
  currentMissionState: "idle" | "running" | "paused" | "holding" | "rtl" | "landing";
  currentWaypoint: number;
  totalWaypoints: number;
  commandBusy: boolean;
  lastCommandKey: MissionCommandKey | null;
  lastAck: string;
  commands: MissionCommandItem[];
  updatedAt: string;
};

export type ReplayEventSeverity = "info" | "warning" | "critical";
export type ReplayPlaybackState = "paused" | "playing";

export type ReplayEvent = {
  id: string;
  ts: string;
  type: "telemetry" | "command" | "failsafe" | "mission" | "audit";
  message: string;
  severity: ReplayEventSeverity;
  source: string;
};

export type LogReplayState = {
  playbackState: ReplayPlaybackState;
  cursorIndex: number;
  selectedEventId: string | null;
  events: ReplayEvent[];
  lastAck: string;
  updatedAt: string;
};

export type WaypointStatus = "completed" | "active" | "upcoming" | "skipped" | "blocked";

export type WaypointExecutionItem = {
  id: string;
  index: number;
  label: string;
  etaSec: number;
  status: WaypointStatus;
};

export type WaypointExecutionState = {
  missionLabel: string;
  progressPct: number;
  currentWaypointIndex: number;
  totalWaypoints: number;
  items: WaypointExecutionItem[];
  lastAck: string;
  updatedAt: string;
};

export type PolicyReceiptOutcome = "allowed" | "blocked" | "advisory";
export type PolicyReceiptSeverity = "info" | "warning" | "critical";

export type PolicyReceipt = {
  id: string;
  ts: string;
  policyName: string;
  outcome: PolicyReceiptOutcome;
  reason: string;
  evidenceHash: string;
  severity: PolicyReceiptSeverity;
};

export type PolicyReceiptState = {
  receipts: PolicyReceipt[];
  selectedReceiptId: string | null;
  lastAck: string;
  updatedAt: string;
};

export type VehicleLinkVerdict = "healthy" | "degraded" | "failover";
export type VehicleLinkChannel = "primary" | "secondary" | "backup";

export type VehicleLinkPath = {
  key: VehicleLinkChannel;
  label: string;
  connected: boolean;
  latencyMs: number;
  packetLossPct: number;
  signalPct: number;
  active: boolean;
};

export type VehicleLinkState = {
  verdict: VehicleLinkVerdict;
  uplinkLatencyMs: number;
  downlinkLatencyMs: number;
  telemetryFreshnessMs: number;
  activeChannel: VehicleLinkChannel;
  fallbackChannel: VehicleLinkChannel;
  paths: VehicleLinkPath[];
  lastAck: string;
  updatedAt: string;
};

export type MissionFenceVerdict = "clear" | "near-boundary" | "breach";
export type MissionFenceZoneState = "safe" | "warning" | "breach";

export type MissionFenceZone = {
  id: string;
  label: string;
  state: MissionFenceZoneState;
  marginMeters: number;
};

export type MissionFenceState = {
  fenceLabel: string;
  verdict: MissionFenceVerdict;
  autoResponse: "warn" | "hold" | "rtl" | "land";
  distanceToBoundaryMeters: number;
  breachCount: number;
  zones: MissionFenceZone[];
  lastAck: string;
  updatedAt: string;
};

export type RecoveryActionKey =
  | "hold-position"
  | "pause-mission"
  | "return-to-launch"
  | "land-now"
  | "safe-disarm";

export type RecoveryAction = {
  key: RecoveryActionKey;
  label: string;
  description: string;
  dangerLevel: "medium" | "high" | "critical";
  available: boolean;
  requiresConfirm: boolean;
};

export type RecoveryActionsState = {
  actions: RecoveryAction[];
  busy: boolean;
  lastIssuedAction: RecoveryActionKey | null;
  lastAck: string;
  updatedAt: string;
};

function nowIso() {
  return new Date().toISOString();
}

function makeAccelSteps(doneCount = 0): CalibrationAxisStep[] {
  const labels = ["Level", "Left", "Right", "Nose Down", "Nose Up", "Back"];
  return labels.map((label, index) => ({
    key: label.toLowerCase().replace(/\s+/g, "-"),
    label,
    done: index < doneCount
  }));
}

function makeCompassSteps(progressPct = 0): CalibrationAxisStep[] {
  return [
    { key: "yaw", label: "Yaw rotation", done: progressPct >= 34 },
    { key: "roll", label: "Roll rotation", done: progressPct >= 67 },
    { key: "pitch", label: "Pitch rotation", done: progressPct >= 100 }
  ];
}

function makeReplayEvents(): ReplayEvent[] {
  return [
    {
      id: "evt-001",
      ts: "2026-05-14T11:21:04Z",
      type: "mission",
      message: "Mission promoted from planning to execution.",
      severity: "info",
      source: "MissionCore"
    },
    {
      id: "evt-002",
      ts: "2026-05-14T11:21:18Z",
      type: "command",
      message: "Operator issued resume command.",
      severity: "info",
      source: "FlightStack"
    },
    {
      id: "evt-003",
      ts: "2026-05-14T11:21:44Z",
      type: "telemetry",
      message: "Link quality dipped below preferred threshold.",
      severity: "warning",
      source: "Telemetry"
    },
    {
      id: "evt-004",
      ts: "2026-05-14T11:22:05Z",
      type: "failsafe",
      message: "Failsafe policy evaluated: hold recommended, RTL not triggered.",
      severity: "warning",
      source: "FailsafeEngine"
    },
    {
      id: "evt-005",
      ts: "2026-05-14T11:22:21Z",
      type: "audit",
      message: "Mission receipt checkpoint written to audit ledger.",
      severity: "info",
      source: "AuditShell"
    }
  ];
}

function makeWaypointItems(): WaypointExecutionItem[] {
  return [
    { id: "wp-01", index: 1, label: "Takeoff corridor", etaSec: 0, status: "completed" },
    { id: "wp-02", index: 2, label: "Facade north anchor", etaSec: 0, status: "completed" },
    { id: "wp-03", index: 3, label: "Tower east sweep", etaSec: 0, status: "completed" },
    { id: "wp-04", index: 4, label: "Inspection arc A", etaSec: 16, status: "active" },
    { id: "wp-05", index: 5, label: "Inspection arc B", etaSec: 42, status: "upcoming" },
    { id: "wp-06", index: 6, label: "Return corridor", etaSec: 97, status: "upcoming" }
  ];
}

function makePolicyReceipts(): PolicyReceipt[] {
  return [
    {
      id: "pr-001",
      ts: "2026-05-14T11:22:04Z",
      policyName: "Battery reserve gate",
      outcome: "allowed",
      reason: "Reserve above configured floor, command path remains open.",
      evidenceHash: "0x8a14f3d2c7e1",
      severity: "info"
    },
    {
      id: "pr-002",
      ts: "2026-05-14T11:22:17Z",
      policyName: "Link degradation governor",
      outcome: "advisory",
      reason: "Primary link quality dropped below preferred envelope; operator caution issued.",
      evidenceHash: "0x34c1a0f98d44",
      severity: "warning"
    },
    {
      id: "pr-003",
      ts: "2026-05-14T11:22:28Z",
      policyName: "Fence breach prevention",
      outcome: "blocked",
      reason: "Outbound command would exceed mission fence corridor.",
      evidenceHash: "0xa95de173b201",
      severity: "critical"
    }
  ];
}

function makeVehicleLinkPaths(): VehicleLinkPath[] {
  return [
    {
      key: "primary",
      label: "Primary telemetry",
      connected: true,
      latencyMs: 78,
      packetLossPct: 1.3,
      signalPct: 91,
      active: true
    },
    {
      key: "secondary",
      label: "Secondary relay",
      connected: true,
      latencyMs: 132,
      packetLossPct: 3.8,
      signalPct: 74,
      active: false
    },
    {
      key: "backup",
      label: "Backup path",
      connected: false,
      latencyMs: 0,
      packetLossPct: 0,
      signalPct: 0,
      active: false
    }
  ];
}

function makeFenceZones(): MissionFenceZone[] {
  return [
    { id: "fz-01", label: "North corridor", state: "safe", marginMeters: 18.4 },
    { id: "fz-02", label: "Facade sweep lane", state: "warning", marginMeters: 6.2 },
    { id: "fz-03", label: "Return lane", state: "safe", marginMeters: 24.7 }
  ];
}

function makeRecoveryActions(): RecoveryAction[] {
  return [
    {
      key: "hold-position",
      label: "Hold position",
      description: "Freeze progression and maintain current controlled hover/hold.",
      dangerLevel: "medium",
      available: true,
      requiresConfirm: false
    },
    {
      key: "pause-mission",
      label: "Pause mission",
      description: "Pause mission execution while preserving vehicle readiness.",
      dangerLevel: "medium",
      available: true,
      requiresConfirm: false
    },
    {
      key: "return-to-launch",
      label: "Return to launch",
      description: "Exit the current mission and execute configured RTL behavior.",
      dangerLevel: "high",
      available: true,
      requiresConfirm: true
    },
    {
      key: "land-now",
      label: "Land now",
      description: "Trigger immediate landing sequence at the current safe opportunity.",
      dangerLevel: "critical",
      available: true,
      requiresConfirm: true
    },
    {
      key: "safe-disarm",
      label: "Safe disarm",
      description: "Disarm vehicle only when landing / motor-safe conditions are satisfied.",
      dangerLevel: "critical",
      available: false,
      requiresConfirm: true
    }
  ];
}

// ...rest of the file as provided in the user request...
