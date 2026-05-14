"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import Card from "../../components/shell/Card";
import BuildingPicker, { Building } from "../../components/rehearse3d/BuildingPicker";
import Hud from "../../components/rehearse3d/Hud";
import StatsPanel from "../../components/rehearse3d/StatsPanel";
import Scene from "../../components/rehearse3d/Scene";

function fmtTime(secs: number) {
  const m = Math.floor(secs / 60).toString().padStart(2, "0");
  const s = Math.floor(secs % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export default function Rehearse3DPage() {
  const [bld, setBld] = useState<Building>({ id: "icc", name: "ICC Tower", sub: "484m · 108F · Kowloon Station", status: "s3" });
  const [alt, setAlt] = useState(45);
  const [spd, setSpd] = useState(4);
  const [overlap, setOverlap] = useState(70);
  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [t, setT] = useState(0);
  const [missionSec, setMissionSec] = useState(0);
  const [defectCount, setDefectCount] = useState(0);
  const [lastDefectT, setLastDefectT] = useState(0);
  const [log, setLog] = useState<string[]>([
    "00:00 System initialised · AuraSense Rehearse-3D v2.0",
    "00:00 Building ICC Tower · West Kowloon",
    "00:00 Flight profile · Lawnmower multi-layer sweep",
  ]);

  useEffect(() => {
    if (!running || paused) return;
    const id = setInterval(() => {
      setT(prev => {
        const next = Math.min(1, prev + 0.0012 * (spd / 4));
        if (next >= 1) {
          setRunning(false);
          setLog(l => [`${fmtTime(missionSec)} Mission complete · 100% coverage`, ...l].slice(0, 40));
        }
cd ~/aurasense-platform/apps/playground
mkdir -p src/app/rehearse-3d

cat > src/app/rehearse-3d/page.tsx <<'EOF'
"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import Card from "../../components/shell/Card";
import BuildingPicker, { Building } from "../../components/rehearse3d/BuildingPicker";
import Hud from "../../components/rehearse3d/Hud";
import StatsPanel from "../../components/rehearse3d/StatsPanel";
import Scene from "../../components/rehearse3d/Scene";

function fmtTime(secs: number) {
  const m = Math.floor(secs / 60).toString().padStart(2, "0");
  const s = Math.floor(secs % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

const DEFECTS = [
  { name: "Spalling",      sev: "S3", at: "FL 38"  },
  { name: "Cracking",      sev: "S2", at: "FL 72"  },
  { name: "Efflorescence", sev: "S1", at: "FL 51"  },
  { name: "Seepage",       sev: "S2", at: "FL 88"  },
  { name: "Delamination",  sev: "S3", at: "FL 58"  },
  { name: "Cracking",      sev: "S2", at: "FL 125" },
];

export default function Rehearse3DPage() {
  const [bld, setBld] = useState<Building>({ id: "icc", name: "ICC Tower", sub: "484m · 108F · Kowloon Station", status: "s3" });
  const [alt, setAlt] = useState(45);
  const [spd, setSpd] = useState(4);
  const [overlap, setOverlap] = useState(70);
  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [t, setT] = useState(0);
  const [missionSec, setMissionSec] = useState(0);
  const [defectCount, setDefectCount] = useState(0);
  const [lastDefectT, setLastDefectT] = useState(0);
  const [log, setLog] = useState<string[]>([
    "00:00 System initialised · AuraSense Rehearse-3D v2.0",
    "00:00 Building ICC Tower · West Kowloon",
    "00:00 Flight profile · Lawnmower multi-layer sweep",
  ]);

  // mission tick
  useEffect(() => {
    if (!running || paused) return;
    const id = setInterval(() => {
      setT(prev => {
        const next = Math.min(1, prev + 0.0012 * (spd / 4));
        if (next >= 1) {
          setRunning(false);
          setLog(l => [`${fmtTime(missionSec)} Mission complete · 100% coverage`, ...l].slice(0, 40));
        }
        return next;
      });
      setMissionSec(s => s + 0.1);
    }, 100);
    return () => clearInterval(id);
  }, [running, paused, spd, missionSec]);

  // defect spawner
  useEffect(() => {
    const thresholds = [0.12, 0.25, 0.38, 0.52, 0.65, 0.78];
    thresholds.forEach((th, i) => {
      if (t >= th && lastDefectT < th && i >= defectCount) {
        const d = DEFECTS[i % DEFECTS.length];
        setDefectCount(c => c + 1);
        setLastDefectT(th);
        setLog(l => [`${fmtTime(missionSec)} ${d.sev} · ${d.name} detected at ${d.at}`, ...l].slice(0, 40));
      }
    });
  }, [t, lastDefectT, defectCount, missionSec]);

  const faces = {
    n: Math.min(100, Math.round(Math.max(0, t - 0.05) / 0.15 * 100)),
    e: Math.min(100, Math.round(Math.max(0, t - 0.18) / 0.15 * 100)),
    s: Math.min(100, Math.round(Math.max(0, t - 0.32) / 0.15 * 100)),
    w: Math.min(100, Math.round(Math.max(0, t - 0.46) / 0.15 * 100)),
    r: Math.min(100, Math.round(Math.max(0, t - 0.72) / 0.20 * 100)),
  };
  const coverage = Math.round((faces.n + faces.e + faces.s + faces.w + faces.r) / 5);
  const battery = Math.max(0, Math.round(100 - missionSec * 0.35));
  const altitudeDisp = 5 + (alt - 5) * t;
  const etaSec = Math.round((1 - t) * 420);

  function start() {
    if (t >= 1) return;
    setRunning(true); setPaused(false);
    setLog(l => [`${fmtTime(missionSec)} Rehearsal started · DR-A airborne`, ...l].slice(0, 40));
  }
  function pauseToggle() {
    setPaused(p => {
      setLog(l => [`${fmtTime(missionSec)} ${p ? "Mission resumed" : "Mission paused"}`, ...l].slice(0, 40));
      return !p;
    });
  }
  function reset() {
    setRunning(false); setPaused(false); setT(0); setMissionSec(0); setDefectCount(0); setLastDefectT(0);
    setLog([
      "00:00 System reset · Ready for rehearsal",
      "00:00 Building " + bld.name,
    ]);
  }

  return (
    <div className="space-y-5">
      <header className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="aura-h1">Rehearse-3D</h1>
          <p className="aura-sub mt-1">Lawnmower sweep over a 3D building target. Real-time overlay grounded in physics.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="aura-badge">{bld.name}</span>
          <span className={`aura-badge ${running ? "aura-badge-success" : ""}`}>
            {running ? (paused ? "PAUSED" : "SCANNING") : t >= 1 ? "COMPLETE" : "STANDBY"}
          </span>
        </div>
      </header>

      <div className="grid gap-5" style={{ gridTemplateColumns: "240px 1fr 320px" }}>
        <div className="space-y-4">
          <Card title="Building target">
            <BuildingPicker active={bld.id} onPick={(b) => { setBld(b); reset(); }} />
          </Card>
          <Card title="Flight params">
            <div className="space-y-3">
              <div>
                abel className="aura-label">Altitude: {alt} m</label>
                <input type="range" min={20} max={100} value={alt} onChange={e => setAlt(parseInt(e.target.value))} className="w-full" />
              </div>
              <div>
                abel className="aura-label">Speed: {spd.toFixed(1)} m/s</label>
                <input type="range" min={1} max={10} value={spd} onChange={e => setSpd(parseFloat(e.target.value))} className="w-full" />
              </div>
              <div>
                abel className="aura-label">Overlap: {overlap}%</label>
                <input type="range" min={50} max={90} value={overlap} onChange={e => setOverlap(parseInt(e.target.value))} className="w-full" />
              </div>
            </div>
          </Card>
          <Card title="Weather (Kowloon)">
            <ul className="text-sm space-y-1.5">
              ><span className="aura-sub">Wind</span><span>NE 8 kt</span></li>
              ><span className="aura-sub">Visibility</span><span>10 km</span></li>
              ><span className="aura-sub">Temp</span><span>27°C</span></li>
              ><span className="aura-sub">HKCAD</span><span className="aura-badge aura-badge-success">CLEARED</span></li>
            </ul>
          </Card>
        </div>

        <div className="relative">
          <Scene building={bld.id} altitude={alt} speed={spd} running={running} paused={paused} />
          <Hud
            alt={altitudeDisp}
            spd={running && !paused ? spd : 0}
            bat={battery}
            missionTime={fmtTime(missionSec)}
            coverage={coverage}
            faces={faces}
          />
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 pointer-events-auto">
            {!running && t < 1 && (
              <button onClick={start} className="aura-btn aura-btn-primary">Begin rehearsal</button>
            )}
            {running && (
              <button onClick={pauseToggle} className="aura-btn aura-btn-ghost">{paused ? "Resume" : "Pause"}</button>
            )}
            {(running || t > 0) && (
              <button onClick={reset} className="aura-btn aura-btn-danger">Reset</button>
            )}
            {t >= 1 && (
              <button onClick={reset} className="aura-btn aura-btn-primary">New mission</button>
            )}
          </div>
        </div>

        <div>
          <StatsPanel coverage={coverage} defects={defectCount} eta={etaSec > 0 ? `${etaSec}s` : "Done"} log={log} />
        </div>
      </div>
    </div>
  );
}
