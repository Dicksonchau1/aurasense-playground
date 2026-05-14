"use client";
import Card from "../../../components/shell/Card";

export default function Camera({
  sun,
  thermal,
  setThermal,
}: {
  sun: number;
  thermal: boolean;
  setThermal: (v: boolean) => void;
}) {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      <Card title="Camera config">
        <ul className="text-sm space-y-2">
          ><span className="aura-sub">Lens preset</span><span>Facade 3 (35mm, f/2.8)</span></li>
          >
            <span className="aura-sub">Thermal overlay</span>
            <button onClick={() => setThermal(!thermal)} className={`aura-badge ${thermal ? "aura-badge-success" : ""}`}>
              {thermal ? "Enabled" : "Off"}
            </button>
          </li>
          ><span className="aura-sub">Observation angle</span><span>{sun}°</span></li>
          ><span className="aura-sub">Image format</span><span>RAW + JPEG</span></li>
          ><span className="aura-sub">Resolution</span><span>48 MP</span></li>
          ><span className="aura-sub">Video</span><span>4K 30fps</span></li>
        </ul>
      </Card>
      <Card title="Live preview">
        <div className="aura-viewport-dark aspect-video flex items-center justify-center text-white/70 text-xs font-mono">
          [ camera feed — Facade 3 — {thermal ? "thermal overlay ON" : "RGB"} ]
        </div>
        <div className="flex gap-2 mt-3">
          <button className="aura-btn aura-btn-primary">Snapshot</button>
          <button className="aura-btn aura-btn-ghost">Record</button>
        </div>
      </Card>
    </div>
  );
}
