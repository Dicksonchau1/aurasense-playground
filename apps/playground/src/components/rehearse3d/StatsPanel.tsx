"use client";

export default function StatsPanel({
  coverage, defects, eta, log,
}: { coverage: number; defects: number; eta: string; log: string[] }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="aura-panel text-center">
          <div className="text-xs aura-sub">Area scanned</div>
          <div className="text-xl font-bold font-mono" style={{ color: "#3b5d8d" }}>{Math.round(coverage * 1.68)} m²</div>
        </div>
        <div className="aura-panel text-center">
          <div className="text-xs aura-sub">Defects</div>
          <div className="text-xl font-bold font-mono" style={{ color: "#b45309" }}>{defects}</div>
        </div>
        <div className="aura-panel text-center">
          <div className="text-xs aura-sub">Coverage</div>
          <div className="text-xl font-bold font-mono">{coverage}%</div>
        </div>
        <div className="aura-panel text-center">
          <div className="text-xs aura-sub">ETA</div>
          <div className="text-xl font-bold font-mono">{eta}</div>
        </div>
      </div>
      <div className="aura-panel">
        <div className="text-xs aura-sub uppercase tracking-wider mb-2">Mission log</div>
        <div className="font-mono text-[11px] leading-relaxed max-h-48 overflow-y-auto">
          {log.length === 0 && <div className="opacity-50">Awaiting start…</div>}
          {log.map((l, i) => <div key={i}>{l}</div>)}
        </div>
      </div>
    </div>
  );
}
