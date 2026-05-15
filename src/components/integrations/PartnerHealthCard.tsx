import React from 'react';
import { PartnerHealth } from '../../lib/integrations/types';

const PartnerHealthCard: React.FC<{ health: PartnerHealth }> = ({ health }) => (
  <div>
    <h4>Health</h4>
    <div>Status: <b>{health.status}</b></div>
    <div>Last Sync: {health.lastSync}</div>
    {health.details && <div>Details: {health.details}</div>}
    {health.incidents && health.incidents.length > 0 && (
      <div>
        <h5>Incidents</h5>
        <ul>
          {health.incidents.map(inc => (
            <li key={inc.id}>
              [{inc.severity}] {inc.message} ({inc.timestamp})
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
);

export default PartnerHealthCard;
