import { partnerAdapterRegistry } from '../../src/lib/integrations/registry';
import { mockAdapter } from '../../backend/service/integrations/mockAdapter';

describe('PartnerAdapterRegistry', () => {
  it('registers and retrieves adapters', () => {
    partnerAdapterRegistry.register(mockAdapter);
    const adapter = partnerAdapterRegistry.getAdapter('mock');
    expect(adapter).toBeDefined();
    expect(adapter?.key).toBe('mock');
  });

  it('throws on duplicate registration', () => {
    expect(() => partnerAdapterRegistry.register(mockAdapter)).toThrow();
  });

  it('lists adapters', () => {
    const list = partnerAdapterRegistry.listAdapters();
    expect(list.length).toBeGreaterThan(0);
  });
});
