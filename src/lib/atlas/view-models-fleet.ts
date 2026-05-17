import type { PerceptionArbitrationDecision } from "./hooks-fleet";
// View-model for perception-aware arbitration (Surface 2)
import type { StatusChipVM, KPIItem } from "./view-models";

function arbitrationTone(outcome: string): StatusChipVM["tone"] {
  switch (outcome) {
    case "accept-handoff":
      return "success";
    case "accept-handoff-with-warning":
      return "warning";
    case "refuse-handoff-insufficient-coverage":
      return "warning";
    case "refuse-handoff-critical-findings":
      return "critical";
    default:
      return "neutral";
  }
}

export function getPerceptionAwareArbitrationPanelVM(
  decision: PerceptionArbitrationDecision
): {
  status: StatusChipVM;
  kpis: KPIItem[];
  reasons: { code: string; message: string }[];
} {
  return {
    status: {
      label: (() => {
        switch (decision.outcome) {
          case "accept-handoff":
            return "Handoff accepted";
          case "accept-handoff-with-warning":
            return "Accepted with warning";
          case "refuse-handoff-insufficient-coverage":
            return "Refused: Insufficient coverage";
          case "refuse-handoff-critical-findings":
            return "Refused: Critical findings";
          default:
            return "Arbitration unknown";
        }
      })(),
      tone: arbitrationTone(decision.outcome)
    },
    kpis: [
      {
        key: "perceptionCoverage",
        label: "Perception Coverage",
        value:
          decision.perceptionCoverage === null
            ? "unknown"
            : `${decision.perceptionCoverage.toFixed(1)}%`,
        tone: decision.perceptionCoverage === null
          ? "neutral"
          : decision.perceptionCoverage >= 95
          ? "success"
          : "warning"
      },
      {
        key: "unreviewedCriticalFindings",
        label: "Unreviewed Critical Findings",
        value:
          decision.unreviewedCriticalFindings === null
            ? "unknown"
            : String(decision.unreviewedCriticalFindings),
        tone: decision.unreviewedCriticalFindings === null
          ? "neutral"
          : decision.unreviewedCriticalFindings > 0
          ? "critical"
          : "success"
      }
    ],
    reasons: decision.reasons
  };
}
// src/lib/atlas/view-models-fleet.ts
// View-model for perception-typed fleet state (Surface 1)

import type { PerceptionTypedFleetState } from "./hooks-fleet";
import type { ChipTone, KPIItem } from "./view-models";

function toneForPerceptionValue(value: string | number | null): ChipTone {
  if (value === null || value === "unknown") return "neutral";
  if (typeof value === "string") {
    if (value === "critical") return "critical";
    if (value === "major") return "warning";
    if (value === "minor") return "info";
    if (value === "none") return "success";
    return "neutral";
  }
  if (typeof value === "number") {
    if (value >= 90) return "success";
    if (value >= 70) return "info";
    if (value >= 50) return "warning";
    return "critical";
  }
  return "neutral";
}

export function getPerceptionTypedFleetStatePanelVM(
  state: PerceptionTypedFleetState
): KPIItem[] {
  return [
    {
      key: "defectSeverityRollup",
      label: "Defect Severity",
      value: state.defectSeverityRollup.value,
      sublabel: `${state.defectSeverityRollup.evidence.length} finding(s)`,
      tone: toneForPerceptionValue(state.defectSeverityRollup.value)
    },
    {
      key: "changeDetectionDeltaSummary",
      label: "Change Detection",
      value: state.changeDetectionDeltaSummary.value,
      sublabel: `${state.changeDetectionDeltaSummary.evidence.length} capture(s)`,
      tone: toneForPerceptionValue(state.changeDetectionDeltaSummary.value)
    },
    {
      key: "structuralConditionScore",
      label: "Structural Condition",
      value:
        state.structuralConditionScore.value === null
          ? "unknown"
          : state.structuralConditionScore.value.toFixed(1),
      sublabel: `${state.structuralConditionScore.evidence.length} capture(s)`,
      tone: toneForPerceptionValue(state.structuralConditionScore.value)
    },
    {
      key: "perceptionCoveragePct",
      label: "Perception Coverage",
      value:
        state.perceptionCoveragePct.value === null
          ? "unknown"
          : `${state.perceptionCoveragePct.value.toFixed(1)}%`,
      sublabel: `${state.perceptionCoveragePct.evidence.length} capture(s)`,
      tone: toneForPerceptionValue(state.perceptionCoveragePct.value)
    },
    {
      key: "unreviewedCriticalFindingsCount",
      label: "Unreviewed Critical Findings",
      value:
        state.unreviewedCriticalFindingsCount.value === null
          ? "unknown"
          : String(state.unreviewedCriticalFindingsCount.value),
      sublabel: `${state.unreviewedCriticalFindingsCount.evidence.length} finding(s)`,
      tone: toneForPerceptionValue(state.unreviewedCriticalFindingsCount.value)
    }
  ];
}
