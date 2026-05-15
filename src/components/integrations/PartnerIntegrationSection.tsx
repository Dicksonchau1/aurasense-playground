import React from 'react';
import { usePartnerIntegrations } from '../../hooks/usePartnerIntegrations';
import PartnerCapabilityMatrix from './PartnerCapabilityMatrix';
import PartnerHealthCard from './PartnerHealthCard';
import PartnerEvidenceFeed from './PartnerEvidenceFeed';

const PartnerIntegrationSection: React.FC = () => {
  const { integrations, loading, error } = usePartnerIntegrations();

  if (loading) return <div>Loading partner integrations…</div>;
  if (error) return <div>Error: {error}</div>;
  if (!integrations.length) return <div>No partner integrations registered.</div>;

  return (
    <section>
      <h2>Partner Integrations</h2>
      {integrations.map(integration => (
        <div key={integration.key} style={{ marginBottom: 32 }}>
          <h3>{integration.displayName}</h3>
          <div>Status: <b>{integration.status}</b> | Last Sync: {integration.lastSync}</div>
          <PartnerCapabilityMatrix capabilities={integration.capabilities} />
          <PartnerHealthCard health={integration.health} />
          <PartnerEvidenceFeed events={integration.recentEvents} />
        </div>
      ))}
    </section>
  );
};

export default PartnerIntegrationSection;
