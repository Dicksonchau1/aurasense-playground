"use client";

export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const revalidate = 0;
export const fetchCache = "force-no-store";


import { useEffect, useState } from "react";
import Card from "../../components/shell/Card";
import BuildingPicker, { Building } from "../../components/rehearse3d/BuildingPicker";
import Hud from "../../components/rehearse3d/Hud";
import StatsPanel from "../../components/rehearse3d/StatsPanel";
import dynamic from "next/dynamic";
const Scene = dynamic(() => import("../../components/rehearse3d/Scene"), { ssr: false });

function fmtTime(secs: number) {
  const m = Math.floor(secs / 60).toString().padStart(2, "0");
  const s = Math.floor(secs % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export default function Rehearse3DPage() {
  const [bld, setBld] = useState<Building>({ id: "icc", name: "ICC Tower", sub: "484m Kowloon", status: "s3" });
  const [alt, setAlt] = useState(45);
  const [spd, setSpd] = useState(4);
  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [t, setT] = useState(0);
  const [missionSec, setMissionSec] = useState(0);
  const [defectCount, setDefectCount] = useState(0);
  const [log, setLog] = useState<string[]>(["00:00 System initialised"]);

  useEffect(() => {
    if (!running || paused) return;
    const id = setInterval(() => {
      setT(prev => {
        const next = Math.min(1, prev + 0.0012 * (spd / 4));
        if (next >= 1) setRunning(false);
        return next;
      });
      setMissionSec(s => s + 0.1);
    }, 100);
    return () => clearInterval(id);
  }, [running, paused, spd]);

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

  function start() { if (t < 1) { setRunning(true); setPaused(false); } }
  function pauseToggle() { setPaused(p => !p); }
  function reset() { setRunning(false); setPaused(false); setT(0); setMissionSec(0); setDefectCount(0); }

  return (
    <div className="space-y-5">
      <header className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="aura-h1">Rehearse-3D</h1>
          <p className="aura-sub mt-1">Lawnmower sweep over a 3D building target.</p>
        </div>
        <span className="aura-badge">{bld.name}</span>
      </header>

      <div className="grid gap-5" style={{ gridTemplateColumns: "240px 1fr 320px" }}>
        <div className="space-y-4">
          <Card title="Building target">
            <BuildingPicker active={bld.id} onPick={(b) => { setBld(b); reset(); }} />
          </Card>
          <Card title="Flight params">
            <div className="space-y-3">
              <div>
                <label className="aura-label">Altitude: {alt} m</label>
                <input type="range" min={20} max={100} value={alt} onChange={e => setAlt(parseInt(e.target.value))} className="w-full" />
              </div>
              <div>
                <label className="aura-label">Speed: {spd.toFixed(1)} m/s</label>
                <input type="range" min={1} max={10} value={spd} onChange={e => setSpd(parseFloat(e.target.value))} className="w-full" />
              </div>
            </div>
          </Card>
        </div>

        <div className="relative">
          <Scene building={bld.id} altitude={alt} speed={spd} running={running} paused={paused} />
          <Hud alt={altitudeDisp} spd={running && !paused ? spd : 0} bat={battery} missionTime={fmtTime(missionSec)} coverage={coverage} faces={faces} />
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 pointer-events-auto">
            {!running && t < 1 && (<button onClick={start} className="aura-btn aura-btn-primary">Begin rehearsal</button>)}
            {running && (<button onClick={pauseToggle} className="aura-btn aura-btn-ghost">{paused ? "Resume" : "Pause"}</button>)}
            {(running || t > 0) && (<button onClick={reset} className="aura-btn aura-btn-danger">Reset</button>)}
          </div>
        </div>

        <div>
          <StatsPanel coverage={coverage} defects={defectCount} eta={etaSec > 0 ? etaSec + "s" : "Done"} log={log} />
        </div>
      </div>
    </div>
  );
}
