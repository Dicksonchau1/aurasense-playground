import { useSweepEvents } from "@/hooks/useSweepEvents";

export function ProgressStrip({ done, total, state }: { done: number; total: number; state: string }) {
  // This would useSweepEvents(runId) in real usage
  // const snapshot = useSweepEvents(runId);
  return (
    <div className="flex items-center gap-3">
      <div className="w-48 h-2 bg-zinc-800 rounded-full overflow-hidden">
        <div className="h-2 bg-sky-500" style={{ width: `${(done/total)*100}%` }}/>
      </div>
      <span className="text-xs text-zinc-400 tabular-nums">{done} / {total}</span>
      <span className="text-xs text-zinc-500">{state}</span>
      {/* <span className="text-xs text-zinc-500">ETA: {snapshot?.eta ?? "--"}s</span> */}
    </div>
  );
}
