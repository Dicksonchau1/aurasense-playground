import { useEffect, useState } from 'react';
import { partnerAdapterRegistry } from '../lib/integrations/registry';
import { PartnerIntegrationCardViewModel } from '../lib/integrations/view-models';

export function usePartnerIntegrationDetail(key: string): {
  integration?: PartnerIntegrationCardViewModel;
  loading: boolean;
  error?: string;
} {
  const [integration, setIntegration] = useState<PartnerIntegrationCardViewModel>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  useEffect(() => {
    let cancelled = false;
    async function fetchDetail() {
      setLoading(true);
      try {
        const adapter = partnerAdapterRegistry.getAdapter(key);
        if (!adapter) throw new Error('Adapter not found');
        const [identity, capabilities, health, recentEvents] = await Promise.all([
          adapter.describe(),
          adapter.describeCapabilities(),
          adapter.getHealth(),
          adapter.getTimeline(),
        ]);
        if (!cancelled) setIntegration({
          key: identity.key,
          displayName: identity.displayName,
          status: health.status,
          lastSync: health.lastSync,
          capabilities,
          health,
          recentEvents,
        });
      } catch (e: any) {
        if (!cancelled) setError(e.message || 'Failed to load integration');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchDetail();
    return () => { cancelled = true; };
  }, [key]);

  return { integration, loading, error };
}
