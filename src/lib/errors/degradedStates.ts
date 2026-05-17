// Degraded state detection and helpers for ATLAS
export enum DegradedState {
  NoActiveVehicle = 'NO_ACTIVE_VEHICLE',
  NoSessionSelected = 'NO_SESSION_SELECTED',
  DisconnectedWebSocket = 'DISCONNECTED_WEBSOCKET',
  StaleTelemetry = 'STALE_TELEMETRY',
  RejectedCommand = 'REJECTED_COMMAND',
  PartialApiOutage = 'PARTIAL_API_OUTAGE',
  AuditExportFailure = 'AUDIT_EXPORT_FAILURE',
  EvidencePending = 'EVIDENCE_PENDING',
  ComplianceUnavailable = 'COMPLIANCE_UNAVAILABLE',
}

export function getDegradedStateMessage(state: DegradedState): string {
  switch (state) {
    case DegradedState.NoActiveVehicle:
      return 'No active vehicle connected.';
    case DegradedState.NoSessionSelected:
      return 'No session selected.';
    case DegradedState.DisconnectedWebSocket:
      return 'Lost connection to real-time data. Attempting to reconnect...';
    case DegradedState.StaleTelemetry:
      return 'Telemetry data is stale.';
    case DegradedState.RejectedCommand:
      return 'Operator command was rejected.';
    case DegradedState.PartialApiOutage:
      return 'Some services are currently unavailable.';
    case DegradedState.AuditExportFailure:
      return 'Audit export failed.';
    case DegradedState.EvidencePending:
      return 'Evidence bundle generation is pending.';
    case DegradedState.ComplianceUnavailable:
      return 'Compliance data is unavailable.';
    default:
      return 'Unknown degraded state.';
  }
}
