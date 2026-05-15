// Canonical types for partner integration

export type PartnerKey = string;

export interface PartnerIntegrationIdentity {
  key: PartnerKey;
  displayName: string;
  version: string;
  adapterType: string;
  provenance: Provenance;
}

export interface Provenance {
  adapterKey: string;
  partnerEntityId?: string;
  sourceTimestamp?: string;
  rawPayloadHash?: string;
  normalizationWarnings?: string[];
}

export interface PartnerCapability {
  key: string;
  displayName: string;
  description: string;
  supported: boolean;
}

export interface PartnerUnitDescriptor {
  id: string;
  name: string;
  type: string;
  status: string;
  provenance: Provenance;
}

export interface PartnerMissionState {
  id: string;
  state: string;
  lastUpdate: string;
  provenance: Provenance;
}

export interface PartnerHealth {
  status: 'healthy' | 'degraded' | 'unavailable' | 'stale';
  lastSync: string;
  details?: string;
  incidents?: PartnerIncident[];
  provenance: Provenance;
}

export interface PartnerIncident {
  id: string;
  type: string;
  severity: 'info' | 'warning' | 'critical';
  message: string;
  timestamp: string;
  provenance: Provenance;
}

export interface PartnerEvidenceReference {
  id: string;
  type: string;
  uri: string;
  timestamp: string;
  provenance: Provenance;
}

export interface PartnerEventTimelineEntry {
  id: string;
  type: string;
  message: string;
  timestamp: string;
  relatedEntityId?: string;
  provenance: Provenance;
}

export interface PartnerSyncStatus {
  status: 'ok' | 'partial' | 'stale' | 'error';
  lastSync: string;
  error?: string;
  provenance: Provenance;
}

export interface PartnerPolicyAnnotation {
  id: string;
  policyType: string;
  value: string;
  timestamp: string;
  provenance: Provenance;
}
