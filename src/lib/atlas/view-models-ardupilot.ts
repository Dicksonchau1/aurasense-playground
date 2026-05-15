import type {
  EvidenceExportState,
  EvidenceExportArtifact,
  ExternalDisclosureState,
  ExternalDisclosureItem
} from "./hooks-ardupilot";
export type EvidenceExportPanelVM = {
  title: string;
  subtitle: string;
  chips: StatusChipVM[];
  kpis: KPIItem[];
  missionLabel: string;
  exportProfileLabel: string;
  destinationChannel: string;
  packageStatus: string;
  signed: boolean;
  chainOfCustodyComplete: boolean;
  packageHash: string;
  exportedAt: string | null;
  rows: {
    id: string;
    label: string;
    kind: string;
    status: string;
    bytesLabel: string;
    checksum: string;
    included: boolean;
    active: boolean;
  }[];
  selectedArtifact: EvidenceExportArtifact | null;
  lastAck: string;
};

export type ExternalDisclosurePanelVM = {
  title: string;
  subtitle: string;
  chips: StatusChipVM[];
  kpis: KPIItem[];
  missionLabel: string;
  disclosurePosture: string;
  regulatorWindowLabel: string;
  rows: {
    id: string;
    recipient: string;
    label: string;
    disclosureType: string;
    status: string;
    severity: string;
    dueLabel: string;
    responsibleRole: string;
    contentSummary: string;
    evidenceRef: string;
    submittedAt: string | null;
    active: boolean;
  }[];
  selectedDisclosure: ExternalDisclosureItem | null;
  lastAck: string;
};
function exportTone(value: string): ChipTone {
  if (value === "blocked") return "critical";
  if (value === "review" || value === "assembling") return "warning";
  return "success";
}

function disclosureTone(value: string): ChipTone {
  if (value === "action-required" || value === "blocked") return "critical";
  if (value === "monitor" || value === "review" || value === "draft") return "warning";
  if (value === "submitted" || value === "ready") return "success";
  return "neutral";
}
export function getEvidenceExportPanelVM(
  state: EvidenceExportState,
  selectedArtifact: EvidenceExportArtifact | null
): EvidenceExportPanelVM {
  const includedCount = state.artifacts.filter((artifact) => artifact.included).length;
  const readyCount = state.artifacts.filter(
    (artifact) => artifact.included && artifact.status === "ready"
  ).length;

  return {
    title: "Evidence export",
    subtitle: "Final outbound package assembly across logs, approvals, receipts, summaries, and payload artifacts.",
    chips: [
      {
        label: state.packageStatus,
        tone: exportTone(state.packageStatus)
      },
      {
        label: state.signed ? "signed" : "unsigned",
        tone: state.signed ? "success" : "warning"
      },
      {
        label: state.destinationChannel,
        tone: "info"
      }
    ],
    kpis: [
      {
        key: "export-included",
        label: "Included artifacts",
        value: `${includedCount}/${state.artifacts.length}`,
        sublabel: state.exportProfileLabel,
        tone: "info"
      },
      {
        key: "export-ready",
        label: "Ready artifacts",
        value: `${readyCount}/${includedCount || 1}`,
        sublabel: state.chainOfCustodyComplete ? "Chain complete" : "Chain incomplete",
        tone: state.chainOfCustodyComplete ? "success" : "warning"
      },
      {
        key: "export-hash",
        label: "Package hash",
        value: state.packageHash,
        sublabel: state.lastAck,
        tone: exportTone(state.packageStatus)
      }
    ],
    missionLabel: state.missionLabel,
    exportProfileLabel: state.exportProfileLabel,
    destinationChannel: state.destinationChannel,
    packageStatus: state.packageStatus,
    signed: state.signed,
    chainOfCustodyComplete: state.chainOfCustodyComplete,
    packageHash: state.packageHash,
    exportedAt: state.exportedAt,
    rows: state.artifacts.map((artifact) => ({
      id: artifact.id,
      label: artifact.label,
      kind: artifact.kind,
      status: artifact.status,
      bytesLabel: artifact.bytesLabel,
      checksum: artifact.checksum,
      included: artifact.included,
      active: artifact.id === state.selectedArtifactId
    })),
    selectedArtifact,
    lastAck: state.lastAck
  };
}

export function getExternalDisclosurePanelVM(
  state: ExternalDisclosureState,
  selectedDisclosure: ExternalDisclosureItem | null
): ExternalDisclosurePanelVM {
  const submittedCount = state.disclosures.filter((item) => item.status === "submitted").length;
  const pendingCount = state.disclosures.filter(
    (item) => item.status === "draft" || item.status === "review"
  ).length;

  return {
    title: "External disclosure",
    subtitle: "Outbound disclosure posture for regulator, client, partner, and internal governance communication paths.",
    chips: [
      {
        label: state.disclosurePosture,
        tone: disclosureTone(state.disclosurePosture)
      },
      {
        label: `${submittedCount} submitted`,
        tone: submittedCount > 0 ? "success" : "neutral"
      },
      {
        label: `${pendingCount} pending`,
        tone: pendingCount > 0 ? "warning" : "success"
      }
    ],
    kpis: [
      {
        key: "disclosure-window",
        label: "Disclosure window",
        value: state.regulatorWindowLabel,
        sublabel: state.missionLabel,
        tone: "info"
      },
      {
        key: "disclosure-posture",
        label: "Posture",
        value: state.disclosurePosture,
        sublabel: state.lastAck,
        tone: disclosureTone(state.disclosurePosture)
      },
      {
        key: "disclosure-selected",
        label: "Selected recipient",
        value: selectedDisclosure?.recipient ?? "—",
        sublabel: selectedDisclosure?.label ?? "No disclosure selected",
        tone: selectedDisclosure ? disclosureTone(selectedDisclosure.status) : "neutral"
      }
    ],
    missionLabel: state.missionLabel,
    disclosurePosture: state.disclosurePosture,
    regulatorWindowLabel: state.regulatorWindowLabel,
    rows: state.disclosures.map((item) => ({
      id: item.id,
      recipient: item.recipient,
      label: item.label,
      disclosureType: item.disclosureType,
      status: item.status,
      severity: item.severity,
      dueLabel: item.dueLabel,
      responsibleRole: item.responsibleRole,
      contentSummary: item.contentSummary,
      evidenceRef: item.evidenceRef,
      submittedAt: item.submittedAt,
      active: item.id === state.selectedDisclosureId
    })),
    selectedDisclosure,
    lastAck: state.lastAck
  };
}
import type {
  CalibrationState,
  FlightModeState,
  ParametersState,
  TelemetryHealthState,
  ArduPilotParameter,
  FailsafeState,
  FailsafePolicyAction,
  MissionCommandsState,
  LogReplayState,
  ReplayEvent,
  WaypointExecutionState,
  PolicyReceiptState,
  PolicyReceipt,
  VehicleLinkState,
  MissionFenceState,
  RecoveryActionsState,
  PayloadControlState,
  ProcedureChecklistState,
  ProcedureChecklistItem,
  MissionTimelineState,
  MissionTimelineEvent,
  EvidenceBundleState,
  OperatorHandoverState,
  OperatorHandoverItem,
  MissionSummaryState,
  DecisionLedgerState,
  DecisionLedgerEntry,
  MissionDebriefState,
  MissionDebriefTag
} from "./hooks-ardupilot";
import type { ChipTone, KPIItem, StatusChipVM } from "./view-models";

// ...rest of the code as provided in user input...
