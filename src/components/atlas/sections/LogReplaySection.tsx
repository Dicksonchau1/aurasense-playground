// ATLAS LogReplaySection: shows replay rail and playback controls
import React from 'react';

export function LogReplaySection() {
  // TODO: Replace with real log replay view-model
  const events = [
    { timestamp: '12:00:01', type: 'ARM', message: 'Vehicle armed', severity: 'info', source: 'system' },
    { timestamp: '12:00:10', type: 'TAKEOFF', message: 'Takeoff initiated', severity: 'info', source: 'autopilot' },
    { timestamp: '12:01:00', type: 'FAILSAFE', message: 'Low battery', severity: 'warning', source: 'battery' },
  ];
  const [selected, setSelected] = React.useState(0);
  return (
    <section className="atlas-section log-replay-section">
      <h2>Log Replay</h2>
      <div className="replay-rail">
        {events.map((evt, i) => (
          <button key={i} className={selected === i ? 'selected' : ''} onClick={() => setSelected(i)}>
            <span>{evt.timestamp}</span> <span>{evt.type}</span>
          </button>
        ))}
      </div>
      <div className="replay-controls">
        <button>Play</button>
        <button>Pause</button>
        <button>Step</button>
        <input type="range" min={0} max={events.length - 1} value={selected} onChange={e => setSelected(Number(e.target.value))} />
      </div>
      <div className="event-detail">
        <div><strong>Time:</strong> {events[selected].timestamp}</div>
        <div><strong>Type:</strong> {events[selected].type}</div>
        <div><strong>Message:</strong> {events[selected].message}</div>
        <div><strong>Severity:</strong> {events[selected].severity}</div>
        <div><strong>Source:</strong> {events[selected].source}</div>
      </div>
    </section>
  );
}
