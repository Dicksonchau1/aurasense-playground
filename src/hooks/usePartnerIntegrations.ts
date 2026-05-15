import { useEffect, useState } from 'react';
import { partnerAdapterRegistry } from '../lib/integrations/registry';
import { PartnerIntegrationCardViewModel } from '../lib/integrations/view-models';

export function usePartnerIntegrations(): {
  integrations: PartnerIntegrationCardViewModel[];
  loading: boolean;
  error?: string;
} {
  const [integrations, setIntegrations] = useState<PartnerIntegrationCardViewModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  useEffect(() => {
    let cancelled = false;
    async function fetchIntegrations() {
      setLoading(true);
      try {
        const adapters = partnerAdapterRegistry.listAdapters();
        const results: PartnerIntegrationCardViewModel[] = [];
        for (const adapter of adapters) {
          const [identity, capabilities, health, recentEvents] = await Promise.all([
            adapter.describe(),
            adapter.describeCapabilities(),
            adapter.getHealth(),
            adapter.getTimeline(),
          ]);
          results.push({
            key: identity.key,
            displayName: identity.displayName,
            status: health.status,
            lastSync: health.lastSync,
            capabilities,
            health,
            recentEvents,
          });
        }
        if (!cancelled) setIntegrations(results);
      } catch (e: any) {
        if (!cancelled) setError(e.message || 'Failed to load integrations');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchIntegrations();
    return () => { cancelled = true; };
  }, []);

  return { integrations, loading, error };
}
