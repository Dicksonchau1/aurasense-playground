// KPI Cards for RODA Playground
import React, { useEffect, useState } from 'react';

interface Mission {
  id: string;
  name: string;
  uav: string;
  eta_s?: number;
  scheduled?: string;
}

interface KpiData {
  activeMissions: Mission[];
  robotsOnline: number;
  robotsTotal: number;
  pendingDecisions: number;
  autonomyRatio: number;
  humanOverrides: number;
}

export default function KpiCards() {
  const [data, setData] = useState<KpiData | null>(null);

  useEffect(() => {
    async function fetchData() {
      // Fetch missions
      const missionsRes = await fetch('/api/nepa/missions/active');
      const missionsJson = await missionsRes.json();
      const activeMissions = missionsJson.data.in_flight || [];
      // Fetch robots
      const robotsRes = await fetch('/api/registry/drones');
      const robotsJson = await robotsRes.json();
      const robots = robotsJson.data.units || [];
      const robotsOnline = robots.filter((r: any) => r.status !== 'idle' && r.status !== 'alert').length;
      const robotsTotal = robots.length;
      // Simulate pending decisions and autonomy ratio for now
      setData({
        activeMissions,
        robotsOnline,
        robotsTotal,
        pendingDecisions: 8,
        autonomyRatio: 82,
        humanOverrides: 18,
      });
    }
    fetchData();
  }, []);

  if (!data) return <div>Loading KPIs...</div>;

  return (
    <section style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
      <div className="card">
        <div className="card-header">
          <div className="card-title">Active missions</div>
          <div className="delta positive">+4 vs last hour</div>
        </div>
        <div className="card-main-value">{data.activeMissions.length}</div>
        <div className="card-sub">{data.activeMissions.filter(m => m.uav).length} multi-robot · {data.activeMissions.length - data.activeMissions.filter(m => m.uav).length} single</div>
      </div>
      <div className="card">
        <div className="card-header">
          <div className="card-title">Robots online</div>
          <div className="delta positive">98% uptime</div>
        </div>
        <div className="card-main-value">{data.robotsOnline}/{data.robotsTotal}</div>
        <div className="card-sub">{data.robotsTotal - data.robotsOnline} unit in maintenance</div>
      </div>
      <div className="card">
        <div className="card-header">
          <div className="card-title">Pending decisions</div>
          <div className="delta negative">+3 vs baseline</div>
        </div>
        <div className="card-main-value">{data.pendingDecisions}</div>
        <div className="card-sub">3 safety · 5 navigation</div>
      </div>
      <div className="card">
        <div className="card-header">
          <div className="card-title">Autonomy ratio</div>
          <div className="delta positive">+9% this session</div>
        </div>
        <div className="card-main-value">{data.autonomyRatio}%</div>
        <div className="card-sub">{data.humanOverrides}% human overrides</div>
      </div>
    </section>
  );
}
