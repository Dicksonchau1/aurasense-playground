import React, { useEffect, useState } from 'react';
import styles from './KpiCardsAndRobots.module.css';

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
      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <div className={styles.kpiTitle}>Active missions</div>
          <div className={styles.kpiValue}>{kpi.activeMissions}</div>
        </div>
        <div className={styles.kpiCard}>
          <div className={styles.kpiTitle}>Robots online</div>
          <div className={styles.kpiValue}>{kpi.robotsOnline}/{kpi.robotsTotal}</div>
        </div>
        <div className={styles.kpiCard}>
          <div className={styles.kpiTitle}>Pending decisions</div>
          <div className={styles.kpiValue}>{kpi.pendingDecisions}</div>
        </div>
        <div className={styles.kpiCard}>
          <div className={styles.kpiTitle}>Autonomy ratio</div>
          <div className={styles.kpiValue}>{kpi.autonomyRatio}%</div>
        </div>
      </div>
      <div>
        <h3 style={{color:'#ffd335',marginBottom:8}}>Robots overview</h3>
        <div className={styles.robotsGrid}>
          {robots.map(robot => (
            <div key={robot.id} className={styles.robotCard}>
              <span className={[
                styles.robotStatus,
                robot.status === 'alert' ? styles.alert : '',
                robot.status === 'maintenance' ? styles.maintenance : ''
              ].join(' ')}>
                {robot.status.charAt(0).toUpperCase() + robot.status.slice(1)}
              </span>
              <div className={styles.robotTitle}>{robot.model} #{robot.id}</div>
              <div className={styles.robotMeta}>Battery: {robot.battery}%</div>
              <div className={styles.robotMeta}>Region: {robot.region}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
