import { PartnerAdapter } from '../../../src/lib/integrations/contracts';

class AdapterRegistry {
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

export const adapterRegistry = new AdapterRegistry();
