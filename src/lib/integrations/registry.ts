import { PartnerAdapter } from './contracts';

class PartnerAdapterRegistry {
  private adapters: Map<string, PartnerAdapter> = new Map();

  register(adapter: PartnerAdapter) {
    if (this.adapters.has(adapter.key)) {
      throw new Error(`Adapter with key ${adapter.key} already registered`);
    }
    this.adapters.set(adapter.key, adapter);
  }

  getAdapter(key: string): PartnerAdapter | undefined {
    return this.adapters.get(key);
  }

  listAdapters(): PartnerAdapter[] {
    return Array.from(this.adapters.values());
  }
}

import { mockAdapter } from '../../../backend/service/integrations/mockAdapter';

export const partnerAdapterRegistry = new PartnerAdapterRegistry();
// Register the mock adapter at startup
try {
  partnerAdapterRegistry.register(mockAdapter);
} catch (e) {
  // Ignore duplicate registration in test/dev
}
