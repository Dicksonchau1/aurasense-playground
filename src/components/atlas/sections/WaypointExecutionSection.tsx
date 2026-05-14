// ATLAS WaypointExecutionSection: shows waypoint progress and execution rail
import React from 'react';

export function WaypointExecutionSection() {
  // TODO: Replace with real waypoint execution view-model
  const waypoints = [
    { index: 1, label: 'WP1', state: 'active', eta: '00:01', progress: 10 },
    { index: 2, label: 'WP2', state: 'pending', eta: '00:03', progress: 0 },
    { index: 3, label: 'WP3', state: 'pending', eta: '00:05', progress: 0 },
  ];
  const current = waypoints.find(wp => wp.state === 'active') || waypoints[0];
  return (
    <section className="atlas-section waypoint-execution-section">
      <h2>Waypoint Execution</h2>
      <div className="waypoint-rail">
        {waypoints.map(wp => (
          <div key={wp.index} className={`waypoint waypoint--${wp.state}`}>
            <span>{wp.label}</span>
            <span>{wp.state}</span>
            <span>ETA: {wp.eta}</span>
          </div>
        ))}
      </div>
      <div className="route-progress">
        Route Progress: <strong>{current.progress}%</strong>
      </div>
    </section>
  );
}
