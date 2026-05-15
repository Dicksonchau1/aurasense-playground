"use client";

import Card from "../../../components/shell/Card";

interface CameraProps {
  sun: number;
  thermal: boolean;
  setThermal: (v: boolean) => void;
}

const SENSORS = [
  { label: "RGB",     detail: "Sony IMX586 4K, 12 mm EFL, f/2.8" },
  { label: "Thermal", detail: "FLIR Boson+ 640, 9 mm, NETD ≤20 mK" },
  { label: "LiDAR",   detail: "Livox Mid-70, 70° FOV, 0.05° accuracy" },
];

export default function Camera({ sun, thermal, setThermal }: CameraProps) {
  const glare = sun > 60 ? "High" : sun > 30 ? "Medium" : "Low";
  const glareColor = sun > 60 ? "var(--aura-err)" : sun > 30 ? "var(--aura-warn)" : "var(--aura-ok)";

  return (
    <div className="grid gap-5 md:grid-cols-2">
      <Card title="Sensor suite">
        <div className="space-y-2">
          {SENSORS.map(s => (
            <div key={s.label} className="flex justify-between items-start rounded-lg px-3 py-2"
              style={{ background: "var(--aura-sel)", border: "1px solid var(--aura-line)" }}>
              <span className="text-sm font-semibold" style={{ color: "var(--aura-text)" }}>{s.label}</span>
              <span className="text-xs aura-sub text-right max-w-[70%]">{s.detail}</span>
            </div>
          ))}
        </div>
      </Card>
      <Card title="Camera settings">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="aura-label" style={{ marginBottom: 0 }}>Thermal overlay</span>
            <button
              onClick={() => setThermal(!thermal)}
              className="aura-btn text-xs px-3 py-1"
              style={{ background: thermal ? "var(--aura-ok)" : "var(--aura-sub)" }}
            >
              {thermal ? "ON" : "OFF"}
            </button>
          </div>
          <div>
            <span className="aura-label">Solar glare risk</span>
            <span className="text-sm font-semibold" style={{ color: glareColor }}>{glare}</span>
            <span className="aura-sub text-xs ml-2">(sun angle {sun}°)</span>
          </div>
          <div>
            <span className="aura-label">Shutter recommendation</span>
            <span className="text-sm" style={{ color: "var(--aura-text)" }}>
              {thermal ? "1/1000s RGB + 30 fps thermal" : "1/2000s RGB, HDR enabled"}
            </span>
          </div>
          <div>
            <span className="aura-label">Auto-exposure</span>
            <span className="text-sm" style={{ color: "var(--aura-text)" }}>AE locked on facade mid-grey</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
