import React from 'react';
import { PartnerEventTimelineEntry } from '../../lib/integrations/types';

const PartnerEvidenceFeed: React.FC<{ events: PartnerEventTimelineEntry[] }> = ({ events }) => (
  <div>
    <h4>Recent Events</h4>
    {events.length === 0 ? (
      <div>No recent events.</div>
    ) : (
      <ul>
        {events.map(ev => (
          <li key={ev.id}>
            [{ev.timestamp}] {ev.type}: {ev.message}
          </li>
        ))}
      </ul>
    )}
  </div>
);

export default PartnerEvidenceFeed;
