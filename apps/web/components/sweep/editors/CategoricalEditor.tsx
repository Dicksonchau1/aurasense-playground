// Placeholder for CategoricalEditor. Implement as needed for categorical axis editing.
import { PreviewStrip } from "../PreviewStrip";
import type { CategoricalAxis } from "@/lib/sweep/axes";

export function CategoricalEditor({ axis, onChange }: { axis: CategoricalAxis; onChange: (a: CategoricalAxis) => void }) {
  const setValues = (vals: string[]) => onChange({ ...axis, values: vals });
  return (
    <div className="space-y-2">
      <div className="flex gap-2 items-center">
        <label className="text-xs text-zinc-400">Values:</label>
        <input
          type="text"
          value={axis.values.join(", ")}
          onChange={e => {
            const vals = e.target.value.split(",").map(v => v.trim()).filter(v => v.length > 0);
            setValues(vals);
          }}
          className="w-64 bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-sm text-zinc-100"
        />
      </div>
      <PreviewStrip axis={axis} />
    </div>
  );
}
