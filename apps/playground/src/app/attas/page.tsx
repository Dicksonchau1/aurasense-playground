"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import Card from "../../components/shell/Card";
import Camera from "./_sections/Camera";
import Safety from "./_sections/Safety";
import Audit from "./_sections/Audit";
import Simulation from "./_sections/Simulation";

const BUILDINGS = [
  { id: "b1", name: "Tower A", desc: "Residential facade", fit: 84 },
  { id: "b2", name: "Tower B", desc: "Glass podium",        fit: 81 },
  { id: "b3", name: "Tower C", desc: "Slim vertical",       fit: 72 },
  { id: "b4", name: "Tower D", desc: "Stepped block",       fit: 68 },
  { id: "b5", name: "Tower E", desc: "Wide commercial",     fit: 83 },
];
const DRONES = ["Matrice 30T", "Matrice 350 RTK", "Mavic 3 Enterprise"];
const TASKS  = ["Facade crack survey", "Thermal anomaly scan", "MBIS facade inspection"];
const SECTIONS = ["Parameters", "Environment", "Drone", "Camera", "Safety", "Audit", "Simulation"] as const;
type Section = typeof SECTIONS[number];

export default function AttasPage() {
  const [sec, setSec]           = useState<Section>("Parameters");
  const [bld, setBld]           = useState(BUILDINGS[0]);
  const [drone, setDrone]       = useState(DRONES[0]);
  const [task, setTask]         = useState(TASKS[0]);
  const [wind, setWind]         = useState(5.2);
  const [sun, setSun]           = useState(45);
  const [thermal, setThermal]   = useState(true);
  const [simRunning, setSimRunning] = useState(false);
  const [simLog, setSimLog]     = useState<string[]>(["09:15:01 Sandbox ready, awaiting run."]);

  function runSim() {
    if (simRunning) return;
    setSimRunning(true);
    const steps = [
      "Initialising physics engine",
      "Loading building " + bld.name,
      "Drone " + drone,
      "Wind " + wind.toFixed(1) + " m/s SW",
      "Thermal scan " + (thermal ? "active" : "off"),
      "Simulating trajectory",
      "Running coverage analysis",
      "Checking safety margins",
      "Simulation complete",
    ];
    let i = 0;
    const t = setInterval(() => {
      const stamp = new Date().toLocaleTimeString("en-HK", { hour12: false });
      setSimLog(prev => [...prev, stamp + " " + steps[i]]);
      i++;
      if (i >= steps.length) { clearInterval(t); setSimRunning(false); }
    }, 450);
  }

  return (
    <div className="space-y-5 p-6" style={{ background: "var(--aura-bg)", minHeight: "100vh" }}>
      <header className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="aura-h1">ATTAS Sandbox</h1>
          <p className="aura-sub mt-1">Plan, simulate, and rehearse drone-based facade inspection missions.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="aura-badge">{drone}</span>
          <span className="aura-score-pill">
            <span className="text-xs uppercase opacity-80">Mission fit</span>
            <span className="text-base font-bold">{bld.fit}</span>
            <span className="opacity-60 text-xs">/100</span>
          </span>
        </div>
      </header>

      <div className="flex flex-wrap gap-1.5 border-b" style={{ borderColor: "var(--aura-line)" }}>
        {SECTIONS.map(s => (
          <button key={s} onClick={() => setSec(s)} className={"aura-tab " + (sec === s ? "aura-tab-active" : "")}>{s}</button>
        ))}
      </div>

      {sec === "Parameters" && (
        <div className="grid gap-5 md:grid-cols-2">
          <Card title="Mission setup">
            <div className="space-y-3">
              <div>
                <label className="aura-label">Drone</label>
                <select className="aura-field" value={drone} onChange={e => setDrone(e.target.value)}>
                  {DRONES.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="aura-label">Task</label>
                <select className="aura-field" value={task} onChange={e => setTask(e.target.value)}>
                  {TASKS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="aura-label">Wind (m/s): {wind.toFixed(1)}</label>
                  <input type="range" min={0} max={15} step={0.1} value={wind}
                    onChange={e => setWind(parseFloat(e.target.value))} className="w-full" />
                </div>
                <div>
                  <label className="aura-label">Sun angle: {sun}°</label>
                  <input type="range" min={0} max={90} value={sun}
                    onChange={e => setSun(parseInt(e.target.value))} className="w-full" />
                </div>
              </div>
            </div>
          </Card>
          <Card title="Building target">
            <div className="grid grid-cols-1 gap-2">
              {BUILDINGS.map(b => (
                <button key={b.id} onClick={() => setBld(b)}
                  className="text-left px-3 py-2 rounded-lg border transition"
                  style={{
                    background: bld.id === b.id ? "var(--aura-sel)" : "rgba(255,255,255,0.5)",
                    borderColor: bld.id === b.id ? "rgba(71,105,155,0.4)" : "rgba(255,255,255,0.55)",
                  }}>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-semibold text-sm" style={{ color: "var(--aura-text)" }}>{b.name}</div>
                      <div className="text-xs aura-sub">{b.desc}</div>
                    </div>
                    <span className="aura-badge">fit {b.fit}</span>
                  </div>
                </button>
              ))}
            </div>
          </Card>
        </div>
      )}

      {sec === "Environment" && (
        <div className="grid gap-5 md:grid-cols-3">
          <Card title="Wind">
            <p className="text-sm" style={{ color: "var(--aura-text)" }}>{wind.toFixed(1)} m/s urban canyon, SW 220°, gust ×1.3</p>
          </Card>
          <Card title="Solar">
            <p className="text-sm" style={{ color: "var(--aura-text)" }}>Angle {sun}°, glare medium, UV 7, shadow 32%</p>
          </Card>
          <Card title="Atmosphere">
            <p className="text-sm" style={{ color: "var(--aura-text)" }}>Humidity 69%, 28°C, density 1.19 kg/m³, turbulence low</p>
          </Card>
        </div>
      )}

      {sec === "Drone" && (
        <div className="grid gap-5 md:grid-cols-2">
          <Card title="Drone specs">
            <p className="text-sm" style={{ color: "var(--aura-text)" }}>{drone} — Medium payload, IP55, max wind 12 m/s, MTOW 3.78 kg</p>
          </Card>
          <Card title="Flight envelope">
            <p className="text-sm" style={{ color: "var(--aura-text)" }}>41 min endurance, 6 000 m max alt, 23 m/s max speed, 0.1 m RTK, 15 km range</p>
          </Card>
        </div>
      )}

      {sec === "Camera"     && <Camera sun={sun} thermal={thermal} setThermal={setThermal} />}
      {sec === "Safety"     && <Safety />}
      {sec === "Audit"      && <Audit />}
      {sec === "Simulation" && <Simulation simRunning={simRunning} simLog={simLog} runSim={runSim} />}
    </div>
  );
}
