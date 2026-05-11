// Placeholder for DiscreteEditor. Implement as needed for discrete axis editing.
import { PreviewStrip } from "../PreviewStrip";
import type { DiscreteAxis } from "@/lib/sweep/axes";

export function DiscreteEditor({ axis, onChange }: { axis: DiscreteAxis; onChange: (a: DiscreteAxis) => void }) {
  const setValues = (vals: number[]) => onChange({ ...axis, values: vals });
  return (
    <div className="space-y-2">
      <div className="flex gap-2 items-center">
        <label className="text-xs text-zinc-400">Values:</label>
        <input
          type="text"
          value={axis.values.join(", ")}
          onChange={e => {
            const vals = e.target.value.split(",").map(v => parseFloat(v.trim())).filter(v => !isNaN(v));
            setValues(vals);
          }}
          className="w-64 bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-sm text-zinc-100"
        />
      </div>
      <PreviewStrip axis={axis} />
    </div>
  );
}
