import {
  PartnerIntegrationIdentity,
  PartnerCapability,
  PartnerHealth,
  PartnerEventTimelineEntry,
  PartnerEvidenceReference,
} from './types';

export interface PartnerIntegrationCardViewModel {
  key: string;
  displayName: string;
  status: string;
  lastSync: string;
  capabilities: PartnerCapability[];
  health: PartnerHealth;
  recentEvents: PartnerEventTimelineEntry[];
}

export interface PartnerCapabilityMatrixViewModel {
  capabilities: PartnerCapability[];
  supported: Record<string, boolean>;
}

export interface PartnerHealthCardViewModel {
  health: PartnerHealth;
}

export interface PartnerEvidenceFeedViewModel {
  evidence: PartnerEvidenceReference[];
}
