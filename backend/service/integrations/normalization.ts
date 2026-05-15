import { PartnerAdapter } from '../../../src/lib/integrations/contracts';
import { NormalizedIntegrationError } from '../../../src/lib/integrations/errors';

export function normalizeAdapterError(adapter: PartnerAdapter, error: unknown): NormalizedIntegrationError {
  return adapter.normalizeError(error);
}

// Add more normalization helpers as needed for payloads, evidence, etc.
