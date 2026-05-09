import type { RehearseResult } from "@/lib/rehearse/types";
import { RecommendationBadge } from "./RecommendationBadge";
import { FailureModeList } from "./FailureModeList";

export function RehearseResultCard({ r }: { r: RehearseResult }) {
  const pct = Math.round(r.success_rate * 100);
  const band = Math.round(r.confidence * 100);
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-zinc-200">Prediction</h3>
        <RecommendationBadge rec={r.recommendation} />
      </div>

      <div>
        <div className="flex items-baseline justify-between mb-1">
          <span className="text-xs uppercase text-zinc-500">Task Success Rate</span>
          <span className="text-xs text-zinc-500">±{band}%</span>
        </div>
        <div className="h-3 w-full bg-zinc-800 rounded overflow-hidden">
          <div
            className={`h-full ${pct >= 80 ? "bg-emerald-500" : pct >= 60 ? "bg-amber-500" : "bg-rose-500"}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="mt-1 text-2xl font-semibold text-zinc-100">{pct}%
          <span className="ml-2 text-sm text-zinc-500">({r.runs_succeeded}/{r.runs_total})</span>
        </div>
      </div>

      <div>
        <div className="text-xs uppercase text-zinc-500 mb-1">Failure modes seen</div>
        <FailureModeList modes={r.failure_modes} />
      </div>

      <div className="flex gap-2 pt-2">
        <button className="px-3 py-1.5 rounded-md bg-zinc-800 text-zinc-200 text-sm hover:bg-zinc-700">Save Rehearsal</button>
        {r.replay_uri && (
          <a href={r.replay_uri} target="_blank" className="px-3 py-1.5 rounded-md bg-zinc-800 text-zinc-200 text-sm hover:bg-zinc-700">View Replay</a>
        )}
        <button
          disabled={r.recommendation === "NO-GO"}
          className="px-3 py-1.5 rounded-md bg-sky-600 text-white text-sm hover:bg-sky-500 disabled:opacity-40"
        >Send to Fleet</button>
      </div>
    </div>
  );
}