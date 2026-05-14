// src/lib/atlas/view-models.ts

import type {
  FlightSession,
  Mission,
  MissionValidationResult,
  RehearsalVerdict,
  ReplayAuditBundle,
  TimelineEvent
} from "./contracts";

export type ChipTone =
  | "neutral"
  | "info"
  | "success"
  | "warning"
  | "critical"
  | "accent";

export type KPIItem = {
  key: string;
  label: string;
  value: string;
  sublabel?: string;
  tone?: ChipTone;
};

export type StatusChipVM = {
  label: string;
  tone: ChipTone;
};

export type TimelineRowVM = {
  id: string;
  ts: string;
  title: string;
  detail: string;
  tone: ChipTone;
  source: string;
};

function pct(value: number, digits = 1): string {
  return `${value.toFixed(digits)}%`;
}

function num(value: number, digits = 1): string {
  return value.toFixed(digits);
}

function safeDate(value?: string | null): string {
  if (!value) return "—";
  return value;
}

function missionStatusTone(status: Mission["status"]): ChipTone {
  switch (status) {
    case "completed":
      return "success";
    case "active":
    case "armed":
      return "accent";
    case "validated":
    case "rehearsed":
      return "info";
    case "aborted":
      return "critical";
    case "draft":
    default:
      return "neutral";
  }
}

function flightStatusTone(status: FlightSession["status"]): ChipTone {
  switch (status) {
    case "landed":
      return "success";
    case "in_mission":
    case "takeoff":
      return "accent";
    case "arming":
    case "armed":
      return "info";
    case "aborted":
      return "critical";
    case "rtl":
      return "warning";
    default:
      return "neutral";
  }
}

function validationTone(result: MissionValidationResult | null | undefined): ChipTone {
  if (!result) return "neutral";
  if (!result.valid) return "critical";
  if (result.violations.some((v) => v.severity === "critical")) return "critical";
  if (result.violations.length > 0) return "warning";
  return "success";
}

function rehearsalTone(result: RehearsalVerdict | null | undefined): ChipTone {
  if (!result) return "neutral";
  if (!result.passed) return "critical";
  if (result.predicted_risks.some((r) => r.severity === "high")) return "warning";
  return "success";
}

function eventTone(event: TimelineEvent): ChipTone {
  switch (event.severity) {
    case "critical":
      return "critical";
    case "warning":
      return "warning";
    case "info":
    default:
      return event.source === "nepa" ? "accent" : "info";
  }
}

export function getMissionStatusChip(mission: Mission | null | undefined): StatusChipVM {
  if (!mission) {
    return { label: "No mission", tone: "neutral" };
  }
  return {
    label: mission.status.replace(/_/g, " "),
    tone: missionStatusTone(mission.status)
  };
}

export function getValidationStatusChip(
  result: MissionValidationResult | null | undefined
): StatusChipVM {
  if (!result) {
    return { label: "Not validated", tone: "neutral" };
  }
  if (result.valid && result.violations.length === 0) {
    return { label: "Validated", tone: "success" };
  }
  if (result.valid) {
    return { label: "Validated with warnings", tone: "warning" };
  }
  return { label: "Validation failed", tone: "critical" };
}

export function getRehearsalStatusChip(
  result: RehearsalVerdict | null | undefined
): StatusChipVM {
  if (!result) {
    return { label: "Not rehearsed", tone: "neutral" };
  }
  return {
    label: result.passed ? "Rehearsal passed" : "Rehearsal failed",
    tone: rehearsalTone(result)
  };
}

export function getFlightStatusChip(
  session: FlightSession | null | undefined
): StatusChipVM {
  if (!session) {
    return { label: "No flight session", tone: "neutral" };
  }
  return {
    label: session.status.replace(/_/g, " "),
    tone: flightStatusTone(session.status)
  };
}

export function getMissionKpis(
  mission: Mission | null | undefined,
  validation?: MissionValidationResult | null,
  rehearsal?: RehearsalVerdict | null
): KPIItem[] {
  if (!mission) {
    return [
      { key: "mission", label: "Mission", value: "—", tone: "neutral" },
      { key: "waypoints", label: "Waypoints", value: "0", tone: "neutral" },
      { key: "validation", label: "Validation", value: "—", tone: "neutral" },
      { key: "rehearsal", label: "Rehearsal", value: "—", tone: "neutral" }
    ];
  }

  return [
    {
      key: "mission",
      label: "Mission",
      value: mission.title,
      sublabel: mission.mission_type,
      tone: missionStatusTone(mission.status)
    },
    {
      key: "waypoints",
      label: "Waypoints",
      value: String(mission.waypoints.length),
      sublabel: mission.vehicle_id,
      tone: "info"
    },
    {
      key: "validation",
      label: "Validation",
      value: validation ? pct(validation.score) : "Pending",
      sublabel: validation
        ? `${validation.violations.length} issue(s)`
        : "Not run",
      tone: validationTone(validation)
    },
    {
      key: "rehearsal",
      label: "Rehearsal",
      value: rehearsal ? pct(rehearsal.score) : "Pending",
      sublabel: rehearsal
        ? `${pct(rehearsal.estimated_battery_margin_pct)} battery margin`
        : "No verdict",
      tone: rehearsalTone(rehearsal)
    }
  ];
}

export function getFlightKpis(
  session: FlightSession | null | undefined,
  audit?: ReplayAuditBundle | null
): KPIItem[] {
  if (!session) {
    return [
      { key: "session", label: "Flight session", value: "—", tone: "neutral" },
      { key: "status", label: "Status", value: "Idle", tone: "neutral" },
      { key: "events", label: "Events", value: "0", tone: "neutral" },
      { key: "artifacts", label: "Artifacts", value: "0", tone: "neutral" }
    ];
  }

  return [
    {
      key: "session",
      label: "Flight session",
      value: session.session_id,
      sublabel: session.mode,
      tone: flightStatusTone(session.status)
    },
    {
      key: "status",
      label: "Status",
      value: session.status.replace(/_/g, " "),
      sublabel: safeDate(session.started_at),
      tone: flightStatusTone(session.status)
    },
    {
      key: "events",
      label: "Timeline events",
      value: String(audit?.events.length ?? 0),
      sublabel: `${audit?.traces.length ?? 0} trace(s)`,
      tone: "info"
    },
    {
      key: "artifacts",
      label: "Artifacts",
      value: String(audit?.artifacts.length ?? 0),
      sublabel: `${audit?.telemetry_index.samples ?? 0} telemetry samples`,
      tone: "accent"
    }
  ];
}

export function getAuditKpis(
  bundle: ReplayAuditBundle | null | undefined
): KPIItem[] {
  if (!bundle) {
    return [
      { key: "audit", label: "Audit bundle", value: "—", tone: "neutral" },
      { key: "samples", label: "Telemetry", value: "0", tone: "neutral" },
      { key: "traces", label: "Decision traces", value: "0", tone: "neutral" },
      { key: "artifacts", label: "Exports", value: "0", tone: "neutral" }
    ];
  }

  return [
    {
      key: "audit",
      label: "Audit bundle",
      value: bundle.mission.title,
      sublabel: bundle.source_session_id
        ? `linked to rehearsal ${bundle.source_session_id}`
        : "no linked rehearsal",
      tone: "accent"
    },
    {
      key: "samples",
      label: "Telemetry",
      value: String(bundle.telemetry_index.samples),
      sublabel: `${bundle.telemetry_index.start_ts} → ${bundle.telemetry_index.end_ts}`,
      tone: "info"
    },
    {
      key: "traces",
      label: "Decision traces",
      value: String(bundle.traces.length),
      sublabel: `${bundle.events.length} timeline events`,
      tone: "warning"
    },
    {
      key: "artifacts",
      label: "Exports",
      value: String(bundle.artifacts.length),
      sublabel: bundle.artifacts.map((a) => a.kind).join(", "),
      tone: "success"
    }
  ];
}

export function getMissionMetaRows(mission: Mission | null | undefined) {
  if (!mission) {
    return [];
  }

  return [
    { key: "Mission ID", value: mission.mission_id },
    { key: "Vehicle", value: mission.vehicle_id },
    { key: "Created by", value: mission.created_by },
    { key: "Created at", value: mission.created_at },
    { key: "Updated at", value: mission.updated_at },
    { key: "Environment", value: mission.environment_preset?.label ?? "—" }
  ];
}

export function getTimelineRows(
  events: TimelineEvent[] | null | undefined
): TimelineRowVM[] {
  if (!events?.length) return [];

  return events.map((event) => ({
    id: event.event_id,
    ts: event.ts,
    title: event.type.replace(/\./g, " "),
    detail: event.message,
    tone: eventTone(event),
    source: event.source
  }));
}

export function getTopRisks(rehearsal: RehearsalVerdict | null | undefined) {
  if (!rehearsal) return [];

  return rehearsal.predicted_risks
    .slice()
    .sort((a, b) => b.confidence - a.confidence)
    .map((risk) => ({
      id: risk.risk_id,
      title: risk.category,
      detail: risk.message,
      confidence: pct(risk.confidence * 100),
      tone:
        risk.severity === "high"
          ? "critical"
          : risk.severity === "medium"
          ? "warning"
          : "info"
    }));
}

export function getValidationRows(
  validation: MissionValidationResult | null | undefined
) {
  if (!validation) return [];

  return validation.violations.map((violation, index) => ({
    id: `${violation.code}-${index}`,
    title: violation.code,
    detail: violation.message,
    field: violation.field ?? "—",
    waypoint: violation.waypoint_id ?? "—",
    tone:
      violation.severity === "critical"
        ? "critical"
        : violation.severity === "warning"
        ? "warning"
        : "info"
  }));
}

export function getAuditExportRows(bundle: ReplayAuditBundle | null | undefined) {
  if (!bundle) return [];

  return bundle.artifacts.map((artifact) => ({
    id: artifact.artifact_id,
    label: artifact.kind,
    value: artifact.url,
    sublabel: artifact.created_at,
    tone:
      artifact.kind === "mbis_export" || artifact.kind === "hkcad_csv"
        ? "success"
        : artifact.kind === "trace_jsonl"
        ? "accent"
        : "info"
  }));
}

export function getAtlasPageHeaderVM(input: {
  mission?: Mission | null;
  validation?: MissionValidationResult | null;
  rehearsal?: RehearsalVerdict | null;
  session?: FlightSession | null;
}) {
  const title =
    input.mission?.title ??
    (input.session ? `Flight ${input.session.session_id}` : "ATLAS");

  const chips: StatusChipVM[] = [
    getMissionStatusChip(input.mission),
    getValidationStatusChip(input.validation),
    getRehearsalStatusChip(input.rehearsal),
    getFlightStatusChip(input.session)
  ];

  return {
    title,
    subtitle: input.mission?.description ?? "Operational mission surface",
    chips
  };
}
