// Robots Overview for RODA Playground
import React, { useEffect, useState } from 'react';

interface Robot {
  id: string;
  model: string;
  status: string;
  battery: number;
  region: string;
}

export default function RobotsOverview() {
  const [robots, setRobots] = useState<Robot[]>([]);

  useEffect(() => {
    async function fetchRobots() {
      const res = await fetch('/api/registry/drones');
      const json = await res.json();
      setRobots(json.data.units || []);
    }
    fetchRobots();
  }, []);

  if (!robots.length) return <div>Loading robots...</div>;

  return (
    <div style={{ display: 'flex', gap: 12, overflowX: 'auto', padding: 8 }}>
      {robots.map(robot => (
        <div key={robot.id} className="robot-card" style={{ minWidth: 190, maxWidth: 220, background: '#111827', borderRadius: 14, padding: 10 }}>
          <span className="robot-status-pill" style={{ fontSize: 10, borderRadius: 12, padding: '3px 8px', background: robot.status === 'in_mission' ? 'rgba(22,163,74,0.2)' : 'rgba(234,179,8,0.12)', color: robot.status === 'in_mission' ? '#27e48b' : '#fde68a' }}>{robot.status.replace('_', ' ')}</span>
          <div className="robot-thumb" style={{ height: 60, borderRadius: 10, background: '#1f2937', margin: '8px 0' }}></div>
          <div className="robot-meta" style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
            <div>
              <strong>{robot.model} #{robot.id}</strong>
              <span> · {robot.region}</span>
            </div>
            <span>🔋{robot.battery}%</span>
          </div>
          <div className="robot-controls" style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 11 }}>
            <span>Live feed</span>
            <span>Take over</span>
            <span>Policies</span>
            <span>Logs</span>
          </div>
        </div>
      ))}
    </div>
  );
}
