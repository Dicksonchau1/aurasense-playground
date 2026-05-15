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
