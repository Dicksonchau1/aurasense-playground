"use client";

import Card from "../../../components/shell/Card";

interface SimProps {
  simRunning: boolean;
  simLog: string[];
  runSim: () => void;
}

export default function Simulation({ simRunning, simLog, runSim }: SimProps) {
  return (
    <div className="grid gap-5 md:grid-cols-3">
      <div className="md:col-span-2">
        <Card title="Simulation log">
          <div className="aura-log">
            {simLog.map((line, i) => (
              <div key={i}>{line}</div>
            ))}
          </div>
          <button
            onClick={runSim}
            disabled={simRunning}
            className="aura-btn mt-3 w-full"
          >
            {simRunning ? "Running…" : "▶  Run simulation"}
          </button>
        </Card>
      </div>
      <Card title="Metrics">
        <div className="space-y-2 text-sm" style={{ color: "var(--aura-text)" }}>
          <div className="flex justify-between">
            <span className="aura-sub">Coverage</span>
            <span className="font-semibold" style={{ color: "var(--aura-ok)" }}>94.2%</span>
          </div>
          <div className="flex justify-between">
            <span className="aura-sub">Flight time est.</span>
            <span>22 min</span>
          </div>
          <div className="flex justify-between">
            <span className="aura-sub">Waypoints</span>
            <span>148</span>
          </div>
          <div className="flex justify-between">
            <span className="aura-sub">Safety score</span>
            <span className="font-semibold" style={{ color: "var(--aura-ok)" }}>91/100</span>
          </div>
          <div className="flex justify-between">
            <span className="aura-sub">Risk level</span>
            <span className="font-semibold" style={{ color: "var(--aura-warn)" }}>Low-Medium</span>
          </div>
          <hr style={{ borderColor: "var(--aura-line)" }} />
          <p className="aura-sub text-xs">Metrics update after each simulation run. Export report to PDF after completion.</p>
        </div>
      </Card>
    </div>
  );
}
