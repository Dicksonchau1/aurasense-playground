"use client";
import { useState } from "react";

export function PromoteBar({ runId, canPromote }: { runId: string; canPromote: boolean }) {
  const [busy, setBusy] = useState(false);
  return (
    <div className="sticky bottom-4 z-10">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950/90 backdrop-blur p-4 flex items-center justify-between">
        <div>
          <div className="text-sm text-zinc-300">
            {canPromote ? "All gates passed — eligible for fleet rollout." : "Gate failure — fix regressions before promoting."}
          </div>
          <div className="text-xs text-zinc-500">Sweep {runId.slice(0,8)} · auto-files failing cells as regression scenarios.</div>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-sm text-zinc-200">Download report</button>
          <button
            disabled={!canPromote || busy}
            onClick={async () => { setBusy(true); await fetch(`/api/sweeps/${runId}/promote`, { method: "POST" }); }}
            className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 disabled:opacity-40 text-white font-medium">
            🚀 Promote to Fleet
          </button>
        </div>
      </div>
    </div>
  );
}
