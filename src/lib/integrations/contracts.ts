import {
  PartnerKey,
  PartnerIntegrationIdentity,
  PartnerCapability,
  PartnerUnitDescriptor,
  PartnerMissionState,
  PartnerHealth,
  PartnerIncident,
  PartnerEvidenceReference,
  PartnerEventTimelineEntry,
  PartnerSyncStatus,
  PartnerPolicyAnnotation,
  Provenance,
} from './types';
import { NormalizedIntegrationError } from './errors';

export interface PartnerAdapter {
  key: PartnerKey;
  displayName: string;
  version: string;
  adapterType: string;
  supportedCapabilities: string[];
  authMode: 'none' | 'apiKey' | 'oauth2' | 'custom';
  status: 'active' | 'inactive' | 'error';
  describe(): Promise<PartnerIntegrationIdentity>;
  validateConfig(config: unknown): Promise<{ valid: boolean; errors?: string[] }>;
  describeCapabilities(): Promise<PartnerCapability[]>;
  getHealth(): Promise<PartnerHealth>;
  listUnits(): Promise<PartnerUnitDescriptor[]>;
  listActiveOperations(): Promise<PartnerMissionState[]>;
  getTimeline(): Promise<PartnerEventTimelineEntry[]>;
  normalizeEvidence(payload: unknown): Promise<PartnerEvidenceReference[]>;
  // Optional advanced methods
  fetchPolicyAnnotations?(): Promise<PartnerPolicyAnnotation[]>;
  fetchSyncStatus?(): Promise<PartnerSyncStatus>;
  // Error normalization
  normalizeError(error: unknown): NormalizedIntegrationError;
}
