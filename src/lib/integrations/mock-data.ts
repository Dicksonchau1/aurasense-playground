import { PartnerIntegrationIdentity, PartnerCapability, PartnerHealth, PartnerUnitDescriptor, PartnerMissionState, PartnerEventTimelineEntry, PartnerEvidenceReference, Provenance } from './types';

const now = new Date().toISOString();

export const mockProvenance: Provenance = {
  adapterKey: 'mock',
  partnerEntityId: 'mock-entity-1',
  sourceTimestamp: now,
  rawPayloadHash: 'abc123',
  normalizationWarnings: [],
};

export const mockIdentity: PartnerIntegrationIdentity = {
  key: 'mock',
  displayName: 'Mock Partner',
  version: '1.0.0',
  adapterType: 'mock',
  provenance: mockProvenance,
};

export const mockCapabilities: PartnerCapability[] = [
  { key: 'telemetry', displayName: 'Telemetry', description: 'Telemetry', supported: true },
  { key: 'commandDispatch', displayName: 'Command Dispatch', description: 'Command Dispatch', supported: false },
  { key: 'evidenceAttachment', displayName: 'Evidence Attachment', description: 'Evidence Attachment', supported: true },
];

export const mockHealth: PartnerHealth = {
  status: 'healthy',
  lastSync: now,
  details: 'All systems nominal',
  incidents: [],
  provenance: mockProvenance,
};

export const mockUnits: PartnerUnitDescriptor[] = [
  { id: 'unit-1', name: 'Unit 1', type: 'robot', status: 'active', provenance: mockProvenance },
];

export const mockMissions: PartnerMissionState[] = [
  { id: 'mission-1', state: 'in-progress', lastUpdate: now, provenance: mockProvenance },
];

export const mockEvents: PartnerEventTimelineEntry[] = [
  { id: 'event-1', type: 'status', message: 'Unit started', timestamp: now, provenance: mockProvenance },
];

export const mockEvidence: PartnerEvidenceReference[] = [
  { id: 'evidence-1', type: 'image', uri: '/mock/image1.jpg', timestamp: now, provenance: mockProvenance },
];
