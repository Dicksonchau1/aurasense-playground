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
const SECTIONS = ["Parameters","Environment","Drone","Camera","Safety","Audit","Simulation"] as const;
type Section = typeof SECTIONS[number];

export default function AttasPage() {
  const [sec, setSec] = useState<Section>("Parameters");
  const [bld, setBld] = useState(BUILDINGS[0]);
  const [drone, setDrone] = useState(DRONES[0]);
  const [task, setTask] = useState(TASKS[0]);
  const [wind, setWind] = useState(5.2);
  const [sun, setSun] = useState(45);
  const [thermal, setThermal] = useState(true);
  const [simRunning, setSimRunning] = useState(false);
  const [simLog, setSimLog] = useState<string[]>(["09:15:01 Sandbox ready, awaiting run."]);

  function runSim() {
    if (simRunning) return;
    setSimRunning(true);
    const steps = [
      "Initialising physics engine",
      `Loading building ${bld.name}`,
      `Drone ${drone}`,
      `Wind ${wind.toFixed(1)} m/s SW`,
      `Thermal scan ${thermal ? "active" : "off"}`,
      "Simulating trajectory",
      "Running coverage analysis",
      "Checking safety margins",
      "Simulation complete",
    ];
    let i = 0;
    const t = setInterval(() => {
      const stamp = new Date().toLocaleTimeString("en-HK", { hour12: false });
      setSimLog(prev => [...prev, `${stamp} ${steps[i]}`]);
      i++;
      if (i >= steps.length) { clearInterval(t); setSimRunning(false); }
    }, 450);
  }

  return (
    <div className="space-y-5">
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
          <button key={s} onClick={() => setSec(s)} className={`aura-tab ${sec === s ? "aura-tab-active" : ""}`}>{s}</button>
        ))}
      </div>

      {sec === "Parameters" && (
        <div className="grid gap-5 md:grid-cols-2">
          <Card title="Mission setup">
            <div className="space-y-3">
              <div>
                abel className="aura-label">Drone</label>
                <select className="aura-field" value={drone} onChange={e => setDrone(e.target.value)}>
                  {DRONES.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                abel className="aura-label">Task</label>
                <select className="aura-field" value={task} onChange={e => setTask(e.target.value)}>
                  {TASKS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  abel className="aura-label">Wind (m/s): {wind.toFixed(1)}</label>
                  <input type="range" min={0} max={15} step={0.1} value={wind} onChange={e => setWind(parseFloat(e.target.value))} className="w-full" />
                </div>
                <div>
                  abel className="aura-label">Sun angle (°): {sun}</label>
                  <input type="range" min={0} max={90} value={sun} onChange={e => setSun(parseInt(e.target.value))} className="w-full" />
                </div>
              </div>
            </div>
          </Card>
          <Card title="Building target">
            <div className="grid grid-cols-1 gap-2">
              {BUILDINGS.map(b => (
                <button key={b.id} onClick={() => setBld(b)} className="text-left px-3 py-2 rounded-lg border transition"
                  style={{
                    background: bld.id === b.id ? "var(--aura-sel)" : "rgba(255,255,255,0.5)",
                    borderColor: bld.id === b.id ? "rgba(71,105,155,0.4)" : "rgba(255,255,255,0.55)",
                  }}>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-semibold text-sm">{b.name}</div>
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
          <Card title="Wind profile">
            <ul className="text-sm space-y-2">
              ><span className="aura-sub">Type</span><span>Urban canyon</span></li>
              ><span className="aura-sub">Speed</span><span>{wind.toFixed(1)} m/s</span></li>
              ><span className="aura-sub">Gust factor</span><span>1.3</span></li>
              ><span className="aura-sub">Direction</span><span>SW 220°</span></li>
            </ul>
          </Card>
          <Card title="Solar conditions">
            <ul className="text-sm space-y-2">
              ><span className="aura-sub">Angle</span><span>{sun}°</span></li>
              ><span className="aura-sub">Glare risk</span><span className="aura-badge aura-badge-warn">Medium</span></li>
              ><span className="aura-sub">UV index</span><span>7</span></li>
              ><span className="aura-sub">Shadow coverage</span><span>32%</span></li>
            </ul>
          </Card>
          <Card title="Atmosphere">
            <ul className="text-sm space-y-2">
              ><span className="aura-sub">Humidity</span><span>69%</span></li>
              ><span className="aura-sub">Temperature</span><span>28°C</span></li>
              ><span className="aura-sub">Air density</span><span>1.19 kg/m³</span></li>
              ><span className="aura-sub">Turbulence</span><span className="aura-badge">Low</span></li>
            </ul>
          </Card>
        </div>
      )}

      {sec === "Drone" && (
        <div className="grid gap-5 md:grid-cols-2">
          <Card title="Drone specs">
            <ul className="text-sm space-y-2">
              ><span className="aura-sub">Model</span><span>{drone}</span></li>
              ><span className="aura-sub">Payload class</span><span>Medium</span></li>
              ><span className="aura-sub">IP rating</span><span>IP55</span></li>
              ><span className="aura-sub">Max wind</span><span>12 m/s</span></li>
              ><span className="aura-sub">MTOW</span><span>3.78 kg</span></li>
            </ul>
          </Card>
          <Card title="Flight envelope">
            <div className="text-3xl font-bold" style={{ color: "#1a2a3e" }}>41 min</div>
            <div className="aura-sub">Estimated endurance, current profile</div>
            <ul className="text-sm space-y-2 mt-3">
              ><span className="aura-sub">Max altitude</span><span>6000 m</span></li>
              ><span className="aura-sub">Max speed</span><span>23 m/s</span></li>
              ><span className="aura-sub">Hover accuracy</span><span>0.1 m (RTK)</span></li>
              ><span className="aura-sub">Range</span><span>15 km</span></li>
            </ul>
          </Card>
        </div>
      )}

      {sec === "Camera" && <Camera sun={sun} thermal={thermal} setThermal={setThermal} />}
      {sec === "Safety" && <Safety />}
      {sec === "Audit" && <Audit />}
      {sec === "Simulation" && <Simulation simRunning={simRunning} simLog={simLog} runSim={runSim} />}
    </div>
  );
}
