// ATLAS LogReplayDetailSection: detailed view for a selected log replay event
import React from 'react';

export function LogReplayDetailSection() {
  // TODO: Replace with real event detail logic
  const event = {
    timestamp: '12:01:00',
    type: 'FAILSAFE',
    message: 'Low battery',
    severity: 'warning',
    source: 'battery',
    details: 'Voltage dropped below threshold. Triggered RTL.'
  };
  return (
    <section className="atlas-section log-replay-detail-section">
      <h2>Log Replay Detail</h2>
      <div><strong>Time:</strong> {event.timestamp}</div>
      <div><strong>Type:</strong> {event.type}</div>
      <div><strong>Message:</strong> {event.message}</div>
      <div><strong>Severity:</strong> {event.severity}</div>
      <div><strong>Source:</strong> {event.source}</div>
      <div><strong>Details:</strong> {event.details}</div>
    </section>
  );
}
