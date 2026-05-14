"use client";
import Card from "../../../components/shell/Card";

export default function Simulation({
  simRunning,
  simLog,
  runSim,
}: {
  simRunning: boolean;
  simLog: string[];
  runSim: () => void;
}) {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      <Card title="Run simulation">
        <div className="text-3xl font-bold" style={{ color: "#1a2a3e" }}>{simRunning ? "Running…" : "Ready"}</div>
        <div className="aura-sub mt-1">Full-physics dynamics, timestamp-aligned with NEPA runtime.</div>
        <button onClick={runSim} disabled={simRunning} className="aura-btn aura-btn-primary mt-4">
          {simRunning ? "Running…" : "Run simulation"}
        </button>
      </Card>
      <Card title="Simulation log">
        <div className="font-mono text-[11px] leading-relaxed max-h-56 overflow-y-auto p-2 rounded" style={{ background: "rgba(20,30,50,0.08)" }}>
          {simLog.map((line, i) => <div key={i}>{line}</div>)}
        </div>
      </Card>
    </div>
  );
}
