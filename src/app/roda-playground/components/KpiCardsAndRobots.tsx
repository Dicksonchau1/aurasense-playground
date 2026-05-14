import React, { useEffect, useState } from 'react';

interface Mission {
  id: string;
  name: string;
  uav: string;
  eta_s?: number;
  scheduled?: string;
}

interface Robot {
  id: string;
  model: string;
  status: string;
  battery: number;
  region: string;
}

interface KpiData {
  activeMissions: number;
  robotsOnline: number;
  robotsTotal: number;
  pendingDecisions: number;
  autonomyRatio: number;
  humanOverrides: number;
}

export default function KpiCardsAndRobots() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [robots, setRobots] = useState<Robot[]>([]);
  const [kpi, setKpi] = useState<KpiData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      // Fetch missions
      const missionsRes = await fetch('/api/nepa/missions/active');
      const missionsJson = await missionsRes.json();
      const allMissions = [
        ...(missionsJson.data.in_flight || []),
        ...(missionsJson.data.queued || []),
      ];
      setMissions(allMissions);
      // Fetch robots
      const robotsRes = await fetch('/api/registry/drones');
      const robotsJson = await robotsRes.json();
      setRobots(robotsJson.data.units || []);
      // Compute KPIs
      setKpi({
        activeMissions: missionsJson.data.in_flight?.length || 0,
        robotsOnline: (robotsJson.data.units || []).filter((r: Robot) => r.status !== 'alert' && r.status !== 'maintenance').length,
        robotsTotal: (robotsJson.data.units || []).length,
        pendingDecisions: 8, // Placeholder, replace with real data
        autonomyRatio: 82,   // Placeholder, replace with real data
        humanOverrides: 18,  // Placeholder, replace with real data
      });
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading || !kpi) return <div>Loading...</div>;

  return (
    <section>
      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        <div>
          <div>Active missions</div>
          <div style={{ fontSize: 22 }}>{kpi.activeMissions}</div>
        </div>
        <div>
          <div>Robots online</div>
          <div style={{ fontSize: 22 }}>{kpi.robotsOnline}/{kpi.robotsTotal}</div>
        </div>
        <div>
          <div>Pending decisions</div>
          <div style={{ fontSize: 22 }}>{kpi.pendingDecisions}</div>
        </div>
        <div>
          <div>Autonomy ratio</div>
          <div style={{ fontSize: 22 }}>{kpi.autonomyRatio}%</div>
        </div>
      </div>
      <div>
        <h3>Robots overview</h3>
        <div style={{ display: 'flex', gap: 12 }}>
          {robots.map(robot => (
            <div key={robot.id} style={{ border: '1px solid #333', borderRadius: 10, padding: 12, minWidth: 160 }}>
              <div><strong>{robot.model} #{robot.id}</strong></div>
              <div>Status: {robot.status}</div>
              <div>Battery: {robot.battery}%</div>
              <div>Region: {robot.region}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
