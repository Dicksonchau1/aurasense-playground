// Main panel for RODA Playground (KPI cards, timeline, robots, etc.)
import React from 'react';

import TimelineAndIncidents from './TimelineAndIncidents';

export default function MainPanel() {
  return (
    <main>
      <KpiCardsAndRobots />
      <TimelineAndIncidents />
    </main>
  );
}
