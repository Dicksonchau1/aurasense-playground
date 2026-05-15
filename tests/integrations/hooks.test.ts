import { renderHook } from '@testing-library/react-hooks';
import { usePartnerIntegrations } from '../../src/hooks/usePartnerIntegrations';
import { partnerAdapterRegistry } from '../../src/lib/integrations/registry';
import { mockAdapter } from '../../backend/service/integrations/mockAdapter';

beforeAll(() => {
  partnerAdapterRegistry.register(mockAdapter);
});

describe('usePartnerIntegrations', () => {
  it('loads integrations', async () => {
    const { result, waitForNextUpdate } = renderHook(() => usePartnerIntegrations());
    await waitForNextUpdate();
    expect(result.current.integrations.length).toBeGreaterThan(0);
  });
});
