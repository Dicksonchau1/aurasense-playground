// Slice hook: usePerceptionAwareContinuity
// Composes perception-aware continuity timeline from perception-typed fleet state (frontend-only)
export function usePerceptionAwareContinuity(opts?: {
  missionId?: string;
  vehicleId?: string;
}) {
  // Compose perception state using the existing hook
  const perceptionState = usePerceptionTypedFleetState({
    missionId: opts?.missionId,
    vehicleId: opts?.vehicleId
  });

  // Compose continuity timeline
  const timeline = useMemo(
    () => derivePerceptionContinuityTimeline(perceptionState),
    [perceptionState]
  );

  return timeline;
}
// ===== Surface 3: Perception-aware continuity =====

// Perception continuity event type
export type PerceptionContinuityEvent = {
  id: string;
  ts: string;
  type: "perception-coverage-transition" | "vehicle-substitution" | "branch-reconciliation";
  message: string;
  coverageBefore?: number | null;
  coverageAfter?: number | null;
  findingsBefore?: number | null;
  findingsAfter?: number | null;
  evidenceRefs?: PerceptionEvidenceRef[];
};

// Perception continuity timeline shape
export type PerceptionContinuityTimeline = {
  events: PerceptionContinuityEvent[];
  headline: string;
  coverageSummary: string;
  criticalFindingsSummary: string;
};

// Pure function: derive perception-aware continuity timeline
export function derivePerceptionContinuityTimeline(
  fleetState: PerceptionTypedFleetState
): PerceptionContinuityTimeline {
  // Mocked timeline for frontend-only
  const now = new Date();
  const events: PerceptionContinuityEvent[] = [
    {
      id: "evt-1",
      ts: new Date(now.getTime() - 60000).toISOString(),
      type: "perception-coverage-transition",
      message: `Coverage transitioned to ${fleetState.perceptionCoveragePct.value ?? "unknown"}%`,
      coverageAfter: fleetState.perceptionCoveragePct.value,
      evidenceRefs: fleetState.perceptionCoveragePct.evidence
    },
    {
      id: "evt-2",
      ts: new Date(now.getTime() - 30000).toISOString(),
      type: "branch-reconciliation",
      message: `Branch reconciled with perception coverage ${fleetState.perceptionCoveragePct.value ?? "unknown"}%`,
      coverageAfter: fleetState.perceptionCoveragePct.value,
      findingsAfter: fleetState.unreviewedCriticalFindingsCount.value,
      evidenceRefs: fleetState.unreviewedCriticalFindingsCount.evidence
    }
  ];

  const headline = `Perception coverage: ${fleetState.perceptionCoveragePct.value ?? "unknown"}% | Critical findings: ${fleetState.unreviewedCriticalFindingsCount.value ?? "unknown"}`;
  const coverageSummary = fleetState.perceptionCoveragePct.value === null
    ? "Coverage unknown"
    : fleetState.perceptionCoveragePct.value >= 95
    ? "Coverage meets contract envelope"
    : `Coverage below contract: ${fleetState.perceptionCoveragePct.value}%`;
  const criticalFindingsSummary = fleetState.unreviewedCriticalFindingsCount.value === null
    ? "Critical findings unknown"
    : fleetState.unreviewedCriticalFindingsCount.value > 0
    ? `${fleetState.unreviewedCriticalFindingsCount.value} unreviewed critical finding(s)`
    : "No unreviewed critical findings";

  return {
    events,
    headline,
    coverageSummary,
    criticalFindingsSummary
  };
}
import { useMemo } from "react";
// Slice hook: usePerceptionAwareArbitration
// Composes arbitration decision from perception-typed fleet state (frontend-only)
export function usePerceptionAwareArbitration(opts?: {
  missionId?: string;
  vehicleId?: string;
  requiredCoveragePct?: number;
}) {
  // Compose perception state using the existing hook
  const perceptionState = usePerceptionTypedFleetState({
    missionId: opts?.missionId,
    vehicleId: opts?.vehicleId
  });

  // Compose arbitration decision
  const arbitration = useMemo(
    () =>
      derivePerceptionArbitrationDecision(perceptionState, {
        requiredCoveragePct: opts?.requiredCoveragePct
      }),
    [perceptionState, opts?.requiredCoveragePct]
  );

  return arbitration;
}
// ===== Surface 2: Perception-aware arbitration =====

// Arbitration decision outcome
export type PerceptionArbitrationOutcome =
  | "accept-handoff"
  | "refuse-handoff-insufficient-coverage"
  | "refuse-handoff-critical-findings"
  | "accept-handoff-with-warning"
  | "unknown";

// Arbitration decision reason
export type PerceptionArbitrationReason = {
  code:
    | "coverage-ok"
    | "coverage-insufficient"
    | "critical-findings-present"
    | "neutral"
    | "unknown";
  message: string;
};

// Arbitration decision shape
export type PerceptionArbitrationDecision = {
  outcome: PerceptionArbitrationOutcome;
  reasons: PerceptionArbitrationReason[];
  perceptionCoverage: number | null;
  unreviewedCriticalFindings: number | null;
  timestamp: string;
};

// Pure function: derive perception-aware arbitration decision
export function derivePerceptionArbitrationDecision(
  fleetState: PerceptionTypedFleetState,
  opts?: { requiredCoveragePct?: number }
): PerceptionArbitrationDecision {
  const requiredCoverage = opts?.requiredCoveragePct ?? 95;
  const coverage = fleetState.perceptionCoveragePct.value;
  const findings = fleetState.unreviewedCriticalFindingsCount.value;
  const reasons: PerceptionArbitrationReason[] = [];

  if (coverage === null || coverage === undefined) {
    reasons.push({ code: "unknown", message: "Perception coverage unknown" });
  } else if (coverage < requiredCoverage) {
    reasons.push({ code: "coverage-insufficient", message: `Coverage ${coverage}% below required ${requiredCoverage}%` });
  } else {
    reasons.push({ code: "coverage-ok", message: `Coverage ${coverage}% meets requirement` });
  }

  if (findings === null || findings === undefined) {
    reasons.push({ code: "unknown", message: "Critical findings unknown" });
  } else if (findings > 0) {
    reasons.push({ code: "critical-findings-present", message: `${findings} unreviewed critical finding(s)` });
  }

  let outcome: PerceptionArbitrationOutcome = "unknown";
  if (coverage === null || findings === null) {
    outcome = "unknown";
  } else if (coverage < requiredCoverage) {
    outcome = "refuse-handoff-insufficient-coverage";
  } else if (findings > 0) {
    outcome = "refuse-handoff-critical-findings";
  } else {
    outcome = "accept-handoff";
  }

  return {
    outcome,
    reasons,
    perceptionCoverage: coverage,
    unreviewedCriticalFindings: findings,
    timestamp: new Date().toISOString()
  };
}
// src/lib/atlas/hooks-fleet.ts
// Perception-typed FleetState extension for ATLAS (frontend-only)

import type { ISODateString, MissionId, VehicleId } from "./contracts";

// Addressable evidence reference (from NEPA perception layer)
export type PerceptionEvidenceRef = {
  evidenceId: string;
  vehicleId: VehicleId;
  missionId: MissionId;
  capturedAt: ISODateString;
  kind: "capture" | "finding" | "calibration";
  url?: string;
};

// Perception fields for FleetState
export type PerceptionTypedFleetState = {
  defectSeverityRollup: {
    value: "none" | "minor" | "major" | "critical" | "unknown";
    evidence: PerceptionEvidenceRef[];
    calibrated: boolean;
    calibrationMeta?: Record<string, unknown>;
  };
  changeDetectionDeltaSummary: {
    value: string; // e.g. "No change", "Minor delta", "Significant delta", "unknown"
    evidence: PerceptionEvidenceRef[];
    calibrated: boolean;
    calibrationMeta?: Record<string, unknown>;
  };
  structuralConditionScore: {
    value: number | null; // null = unknown
    evidence: PerceptionEvidenceRef[];
    calibrated: boolean;
    calibrationMeta?: Record<string, unknown>;
  };
  perceptionCoveragePct: {
    value: number | null; // 0-100, null = unknown
    evidence: PerceptionEvidenceRef[];
    calibrated: boolean;
    calibrationMeta?: Record<string, unknown>;
  };
  unreviewedCriticalFindingsCount: {
    value: number | null; // null = unknown
    evidence: PerceptionEvidenceRef[];
    calibrated: boolean;
    calibrationMeta?: Record<string, unknown>;
  };
};

// Neutral/unknown defaults for backward compatibility
export function makeNeutralPerceptionFleetState(): PerceptionTypedFleetState {
  return {
    defectSeverityRollup: {
      value: "unknown",
      evidence: [],
      calibrated: false
    },
    changeDetectionDeltaSummary: {
      value: "unknown",
      evidence: [],
      calibrated: false
    },
    structuralConditionScore: {
      value: null,
      evidence: [],
      calibrated: false
    },
    perceptionCoveragePct: {
      value: null,
      evidence: [],
      calibrated: false
    },
    unreviewedCriticalFindingsCount: {
      value: null,
      evidence: [],
      calibrated: false
    }
  };
}

// Pure function to derive perception fields from evidence (mocked for frontend-only)

import { useMemo } from "react";

export function derivePerceptionFleetStateFromEvidence(
  evidence: PerceptionEvidenceRef[]
): PerceptionTypedFleetState {
  // In real implementation, this would aggregate/calibrate from NEPA evidence
  // Here, we mock plausible values for demo/testing
  return {
    defectSeverityRollup: {
      value: "minor",
      evidence: evidence.filter(e => e.kind === "finding"),
      calibrated: true,
      calibrationMeta: { method: "mocked" }
    },
    changeDetectionDeltaSummary: {
      value: "Minor delta",
      evidence: evidence.filter(e => e.kind === "capture"),
      calibrated: true,
      calibrationMeta: { method: "mocked" }
    },
    structuralConditionScore: {
      value: 82.5,
      evidence: evidence.filter(e => e.kind === "capture"),
      calibrated: true,
      calibrationMeta: { method: "mocked" }
    },
    perceptionCoveragePct: {
      value: 94.2,
      evidence: evidence.filter(e => e.kind === "capture"),
      calibrated: true,
      calibrationMeta: { method: "mocked" }
    },
    unreviewedCriticalFindingsCount: {
      value: 1,
      evidence: evidence.filter(e => e.kind === "finding"),
      calibrated: true,
      calibrationMeta: { method: "mocked" }
    }
  };
}

// Slice hook: usePerceptionTypedFleetState
// Composes perception fields into FleetState, frontend-only, with mocked evidence
export function usePerceptionTypedFleetState(
  opts?: { missionId?: MissionId; vehicleId?: VehicleId }
): PerceptionTypedFleetState {
  // For frontend-only, mock evidence array
  const evidence: PerceptionEvidenceRef[] = useMemo(() => [
    {
      evidenceId: "mock-capture-1",
      vehicleId: opts?.vehicleId ?? "vehicle-1",
      missionId: opts?.missionId ?? "mission-1",
      capturedAt: new Date().toISOString(),
      kind: "capture",
      url: undefined
    },
    {
      evidenceId: "mock-finding-1",
      vehicleId: opts?.vehicleId ?? "vehicle-1",
      missionId: opts?.missionId ?? "mission-1",
      capturedAt: new Date().toISOString(),
      kind: "finding",
      url: undefined
    },
    {
      evidenceId: "mock-calib-1",
      vehicleId: opts?.vehicleId ?? "vehicle-1",
      missionId: opts?.missionId ?? "mission-1",
      capturedAt: new Date().toISOString(),
      kind: "calibration",
      url: undefined
    }
  ], [opts?.missionId, opts?.vehicleId]);

  // Compose perception fields from evidence
  const perceptionState = useMemo(() => {
    // If no perception evidence, return neutral defaults (backward compatibility)
    if (!evidence || evidence.length === 0) {
      return makeNeutralPerceptionFleetState();
    }
    return derivePerceptionFleetStateFromEvidence(evidence);
  }, [evidence]);

  return perceptionState;
}
