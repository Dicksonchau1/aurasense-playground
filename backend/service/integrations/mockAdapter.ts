import { PartnerAdapter } from '../../../src/lib/integrations/contracts';
import { mockIdentity, mockCapabilities, mockHealth, mockUnits, mockMissions, mockEvents, mockEvidence } from '../../../src/lib/integrations/mock-data';
import { NormalizedIntegrationError } from '../../../src/lib/integrations/errors';

export const mockAdapter: PartnerAdapter = {
  key: mockIdentity.key,
  displayName: mockIdentity.displayName,
  version: mockIdentity.version,
  adapterType: mockIdentity.adapterType,
  supportedCapabilities: mockCapabilities.map(c => c.key),
  authMode: 'none',
  status: 'active',
  async describe() { return mockIdentity; },
  async validateConfig() { return { valid: true }; },
  async describeCapabilities() { return mockCapabilities; },
  async getHealth() { return mockHealth; },
  async listUnits() { return mockUnits; },
  async listActiveOperations() { return mockMissions; },
  async getTimeline() { return mockEvents; },
  async normalizeEvidence() { return mockEvidence; },
  normalizeError(error: unknown): NormalizedIntegrationError {
    return {
      category: 'unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
      partnerKey: this.key,
      rawError: error,
    };
  },
};
