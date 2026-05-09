"use client";
import { useState } from "react";
import { useRehearse } from "@/hooks/useRehearse";
import { RehearseSkeleton } from "./RehearseSkeleton";
import { RehearseResultCard } from "./RehearseResultCard";
import type { EnvSandbox } from "@/lib/rehearse/types";

type Props = {
  missionId: string;
  policy: string;
  env: EnvSandbox;
  onMissionChange?: () => void;
  onPolicyChange?: () => void;
};

export function RehearsePanel({ missionId, policy, env, onMissionChange, onPolicyChange }: Props) {
  const { status, run } = useRehearse();
  const [n, setN] = useState(12);

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-zinc-100">🎬 Rehearse Sandbox — Task Success Prediction (v1)</h2>
        <span className="text-xs text-zinc-500">Playground v1</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
        <Field label="Mission" value={missionId} onEdit={onMissionChange} />
        <Field label="Policy"  value={policy}    onEdit={onPolicyChange}  />
        <Field label="Conditions" value={`${env.date} ${env.time_of_day}, ${env.wind_avg_mps} m/s ${env.wind_direction_deg}°`} />
      </div>

      <div className="flex items-center gap-3">
        <label className="text-sm text-zinc-400">Rehearsal runs</label>
        <select value={n} onChange={(e) => setN(+e.target.value)} className="bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-sm">
          {[6, 12, 24].map((v) => <option key={v} value={v}>{v}</option>)}
        </select>
        <span className="text-xs text-zinc-500">~{Math.round((n / 12) * 2)} min on 1× L4</span>
      </div>

      <button
        onClick={() => run({ mission_id: missionId, policy, env, n_seeds: 3, n_perturbations: Math.max(1, n / 3) })}
        disabled={status.state === "queued" || status.state === "running"}
        className="w-full py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-medium disabled:opacity-40"
      >
        {status.state === "running" ? "Rehearsing…" : "▶  Run Rehearsal"}
      </button>

      <div className="border-t border-zinc-800 pt-4">
        {status.state === "idle" && <p className="text-sm text-zinc-500">Run a rehearsal to predict task success.</p>}
        {(status.state === "queued" || status.state === "running") && (
          <RehearseSkeleton
            progress={status.state === "running" ? status.progress : 0.05}
            eta_s={status.state === "running" ? status.eta_s : 120}
          />
        )}
        {status.state === "done"  && <RehearseResultCard r={status.result} />}
        {status.state === "error" && <p className="text-sm text-rose-400">Error: {status.message}</p>}
      </div>
    </div>
  );
}

function Field({ label, value, onEdit }: { label: string; value: string; onEdit?: () => void }) {
  return (
    <div className="rounded-lg bg-zinc-900/60 border border-zinc-800 px-3 py-2">
      <div className="text-[10px] uppercase tracking-wide text-zinc-500">{label}</div>
      <div className="flex items-center justify-between">
        <div className="text-zinc-200 truncate">{value}</div>
        {onEdit && <button onClick={onEdit} className="text-xs text-sky-400 hover:underline">change</button>}
      </div>
    </div>
  );
}