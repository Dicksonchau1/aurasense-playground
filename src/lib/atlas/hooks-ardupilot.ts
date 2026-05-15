export type EvidenceExportArtifactStatus = "ready" | "pending" | "blocked";
export type EvidenceExportChannel =
  | "internal-archive"
  | "client-package"
  | "regulatory-package"
  | "partner-brief";

export type EvidenceExportArtifact = {
  id: string;
  label: string;
  kind: "log" | "receipt" | "report" | "capture" | "approval" | "summary";
  status: EvidenceExportArtifactStatus;
  bytesLabel: string;
  checksum: string;
  included: boolean;
};

export type EvidenceExportState = {
  missionLabel: string;
  exportProfileLabel: string;
  packageStatus: "assembling" | "review" | "ready" | "blocked";
  destinationChannel: EvidenceExportChannel;
  signed: boolean;
  chainOfCustodyComplete: boolean;
  exportedAt: string | null;
  artifacts: EvidenceExportArtifact[];
  selectedArtifactId: string | null;
  packageHash: string;
  lastAck: string;
  updatedAt: string;
};

export type ExternalDisclosureSeverity = "info" | "warning" | "critical";
export type ExternalDisclosureStatus =
  | "not-required"
  | "draft"
  | "review"
  | "ready"
  | "submitted"
  | "blocked";

export type ExternalDisclosureRecipient =
  | "cad"
  | "client"
  | "partner"
  | "internal-board"
  | "operator-network";

export type ExternalDisclosureItem = {
  id: string;
  recipient: ExternalDisclosureRecipient;
  label: string;
  disclosureType: "mandatory" | "voluntary" | "contractual" | "informational";
  status: ExternalDisclosureStatus;
  severity: ExternalDisclosureSeverity;
  dueLabel: string;
  responsibleRole: string;
  contentSummary: string;
  evidenceRef: string;
  submittedAt: string | null;
};

export type ExternalDisclosureState = {
  missionLabel: string;
  disclosurePosture: "quiet" | "monitor" | "action-required";
  regulatorWindowLabel: string;
  selectedDisclosureId: string | null;
  disclosures: ExternalDisclosureItem[];
  lastAck: string;
  updatedAt: string;
};

function makeEvidenceExportArtifacts(): EvidenceExportArtifact[] {
  return [
    {
      id: "ee-001",
      label: "Mission telemetry log set",
      kind: "log",
      status: "ready",
      bytesLabel: "2.8 MB",
      checksum: "sha256:9fd4a31e",
      included: true
    },
    {
      id: "ee-002",
      label: "Policy receipt ledger",
      kind: "receipt",
      status: "ready",
      bytesLabel: "184 KB",
      checksum: "sha256:13cbf202",
      included: true
    },
    {
      id: "ee-003",
      label: "Incident report snapshot",
      kind: "report",
      status: "ready",
      bytesLabel: "96 KB",
      checksum: "sha256:88aa1bc3",
      included: true
    },
    {
      id: "ee-004",
      label: "Payload capture evidence",
      kind: "capture",
      status: "pending",
      bytesLabel: "14.2 MB",
      checksum: "sha256:pending",
      included: true
    },
    {
      id: "ee-005",
      label: "Approval chain export",
      kind: "approval",
      status: "ready",
      bytesLabel: "44 KB",
      checksum: "sha256:6dc114f7",
      included: true
    },
    {
      id: "ee-006",
      label: "Stakeholder mission summary",
      kind: "summary",
      status: "ready",
      bytesLabel: "112 KB",
      checksum: "sha256:c4de12a8",
      included: true
    }
  ];
}

function makeExternalDisclosureItems(): ExternalDisclosureItem[] {
  return [
    {
      id: "ed-001",
      recipient: "cad",
      label: "Civil Aviation occurrence disclosure posture",
      disclosureType: "mandatory",
      status: "review",
      severity: "warning",
      dueLabel: "Within 96 hours if occurrence is confirmed reportable",
      responsibleRole: "Compliance lead",
      contentSummary: "Current mission has no confirmed major safety occurrence, but route-block and degraded link advisory remain under review for reportability.",
      evidenceRef: "incident-ledger / decision-ledger / rc-ops-review",
      submittedAt: null
    },
    {
      id: "ed-002",
      recipient: "client",
      label: "Client operational mission brief",
      disclosureType: "contractual",
      status: "ready",
      severity: "info",
      dueLabel: "After evidence export signature",
      responsibleRole: "Engagement lead",
      contentSummary: "Client-facing summary can be released once payload completion and final signature are closed.",
      evidenceRef: "stakeholder-brief / client-view / export-profile",
      submittedAt: null
    },
    {
      id: "ed-003",
      recipient: "partner",
      label: "Partner systems coordination note",
      disclosureType: "informational",
      status: "draft",
      severity: "info",
      dueLabel: "Optional after internal review",
      responsibleRole: "Operations lead",
      contentSummary: "Partner note will summarize link behavior, fence block, and recommended tuning updates.",
      evidenceRef: "decision-ledger / risk-register / ops-note",
      submittedAt: null
    },
    {
      id: "ed-004",
      recipient: "internal-board",
      label: "Internal governance board brief",
      disclosureType: "informational",
      status: "ready",
      severity: "info",
      dueLabel: "Immediate",
      responsibleRole: "Founder / mission owner",
      contentSummary: "Internal board brief is ready and can be shared once package review is confirmed.",
      evidenceRef: "stakeholder-brief / board-view",
      submittedAt: null
    }
  ];
}

export function useArduPilotEvidenceExport() {
  const [state, setState] = useState<EvidenceExportState>({
    missionLabel: "Kowloon facade survey / run 04",
    exportProfileLabel: "Audit outbound package / v1",
    packageStatus: "review",
    destinationChannel: "internal-archive",
    signed: false,
    chainOfCustodyComplete: false,
    exportedAt: null,
    artifacts: makeEvidenceExportArtifacts(),
    selectedArtifactId: "ee-001",
    packageHash: "pkg-0x7ab41c92",
    lastAck: "Evidence export package staged for review.",
    updatedAt: nowIso()
  });

  const recomputePackage = useCallback((artifacts: EvidenceExportArtifact[]) => {
    const hasBlocked = artifacts.some((artifact) => artifact.status === "blocked" && artifact.included);
    const hasPending = artifacts.some((artifact) => artifact.status === "pending" && artifact.included);
    const packageStatus =
      hasBlocked ? "blocked" : hasPending ? "review" : "ready";
    const chainOfCustodyComplete =
      artifacts.filter((artifact) => artifact.included).every((artifact) => artifact.status === "ready");

    return {
      packageStatus,
      chainOfCustodyComplete
    } as const;
  }, []);

  const selectArtifact = useCallback((artifactId: string) => {
    setState((prev) => ({
      ...prev,
      selectedArtifactId: artifactId,
      lastAck: `Export artifact ${artifactId} selected.`,
      updatedAt: nowIso()
    }));
  }, []);

  const toggleArtifactIncluded = useCallback((artifactId: string) => {
    setState((prev) => {
      const artifacts = prev.artifacts.map((artifact) =>
        artifact.id === artifactId
          ? { ...artifact, included: !artifact.included }
          : artifact
      );
      const next = recomputePackage(artifacts);

      return {
        ...prev,
        artifacts,
        packageStatus: next.packageStatus,
        chainOfCustodyComplete: next.chainOfCustodyComplete,
        lastAck: `Artifact ${artifactId} inclusion toggled.`,
        updatedAt: nowIso()
      };
    });
  }, [recomputePackage]);

  const setDestinationChannel = useCallback((destinationChannel: EvidenceExportChannel) => {
    setState((prev) => ({
      ...prev,
      destinationChannel,
      lastAck: `Destination channel set to ${destinationChannel}.",
      updatedAt: nowIso()
    }));
  }, []);

  const signExportPackage = useCallback(() => {
    setState((prev) => ({
      ...prev,
      signed: true,
      lastAck: "Evidence export package signed.",
      updatedAt: nowIso()
    }));
  }, []);

  const markArtifactReady = useCallback((artifactId: string) => {
    setState((prev) => {
      const artifacts = prev.artifacts.map((artifact) =>
        artifact.id === artifactId
          ? {
              ...artifact,
              status: "ready" as const,
              checksum:
                artifact.checksum === "sha256:pending"
                  ? "sha256:filled-after-closeout"
                  : artifact.checksum
            }
          : artifact
      );
      const next = recomputePackage(artifacts);

      return {
        ...prev,
        artifacts,
        packageStatus: next.packageStatus,
        chainOfCustodyComplete: next.chainOfCustodyComplete,
        lastAck: `Artifact ${artifactId} marked ready.`,
        updatedAt: nowIso()
      };
    });
  }, [recomputePackage]);

  const exportPackage = useCallback(() => {
    setState((prev) => ({
      ...prev,
      exportedAt:
        prev.packageStatus === "ready" && prev.signed ? nowIso() : prev.exportedAt,
      lastAck:
        prev.packageStatus === "ready" && prev.signed
          ? "Evidence export package sent to outbound channel."
          : "Export blocked until package is ready and signed.",
      updatedAt: nowIso()
    }));
  }, []);

  const selectedArtifact =
    state.artifacts.find((artifact) => artifact.id === state.selectedArtifactId) ?? null;

  return {
    state,
    selectedArtifact,
    selectArtifact,
    toggleArtifactIncluded,
    setDestinationChannel,
    signExportPackage,
    markArtifactReady,
    exportPackage
  };
}

export function useArduPilotExternalDisclosure() {
  const [state, setState] = useState<ExternalDisclosureState>({
    missionLabel: "Kowloon facade survey / run 04",
    disclosurePosture: "monitor",
    regulatorWindowLabel: "Occurrence review window active / 96h reference",
    selectedDisclosureId: "ed-001",
    disclosures: makeExternalDisclosureItems(),
    lastAck: "External disclosure posture computed.",
    updatedAt: nowIso()
  });

  const recomputeDisclosurePosture = useCallback((disclosures: ExternalDisclosureItem[]) => {
    const hasAction = disclosures.some(
      (item) => item.status === "review" || item.status === "blocked"
    );
    const hasDraft = disclosures.some((item) => item.status === "draft");

    return hasAction ? "action-required" : hasDraft ? "monitor" : "quiet";
  }, []);

  const selectDisclosure = useCallback((disclosureId: string) => {
    setState((prev) => ({
      ...prev,
      selectedDisclosureId: disclosureId,
      lastAck: `Disclosure item ${disclosureId} selected.`,
      updatedAt: nowIso()
    }));
  }, []);

  const setDisclosureStatus = useCallback(
    (disclosureId: string, status: ExternalDisclosureStatus) => {
      setState((prev) => {
        const disclosures = prev.disclosures.map((item) =>
          item.id === disclosureId
            ? {
                ...item,
                status,
                submittedAt: status === "submitted" ? nowIso() : item.submittedAt
              }
            : item
        );

        return {
          ...prev,
          disclosures,
          disclosurePosture: recomputeDisclosurePosture(disclosures),
          lastAck: `Disclosure ${disclosureId} set to ${status}.",
          updatedAt: nowIso()
        };
      });
    },
    [recomputeDisclosurePosture]
  );

  const selectedDisclosure =
    state.disclosures.find((item) => item.id === state.selectedDisclosureId) ?? null;

  return {
    state,
    selectedDisclosure,
    selectDisclosure,
    setDisclosureStatus
  };
}
/**
 * ATLAS slice-hook layer.
 *
 * Hooks here own per-section local logic. When MissionStateProvider is
 * mounted, hooks read their initial seed and cross-slice references from
 * useMissionState and sync via small reconciliation effects. When no
 * provider is present, hooks remain isolated and backward compatible.
 *
 * See ./ARCHITECTURE.md for the four-layer model and extension rules.
 */
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
