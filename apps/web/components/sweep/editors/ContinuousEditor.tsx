// Placeholder for ContinuousEditor. Implement as needed for continuous axis editing.
import { PreviewStrip } from "../PreviewStrip";
import type { ContinuousAxis } from "@/lib/sweep/axes";

export function ContinuousEditor({ axis, onChange }: { axis: ContinuousAxis; onChange: (a: ContinuousAxis) => void }) {
  const set = (p: Partial<ContinuousAxis>) => onChange({ ...axis, ...p });
  return (
    <div className="space-y-2">
      <div className="flex gap-2 items-center">
        <label className="text-xs text-zinc-400">Min:</label>
        <input type="number" value={axis.min} onChange={e => set({ min: +e.target.value })}
          className="w-20 bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-sm text-zinc-100" />
        <label className="text-xs text-zinc-400">Max:</label>
        <input type="number" value={axis.max} onChange={e => set({ max: +e.target.value })}
          className="w-20 bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-sm text-zinc-100" />
        <label className="text-xs text-zinc-400">Step:</label>
        <input type="number" value={axis.step} onChange={e => set({ step: +e.target.value })}
          className="w-20 bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-sm text-zinc-100" />
        <label className="text-xs text-zinc-400">Scale:</label>
        <select value={axis.scale ?? "linear"} onChange={e => set({ scale: e.target.value as any })}
          className="w-24 bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-sm">
          <option value="linear">linear</option>
          <option value="log">log</option>
        </select>
      </div>
      <PreviewStrip axis={axis} />
    </div>
  );
}
