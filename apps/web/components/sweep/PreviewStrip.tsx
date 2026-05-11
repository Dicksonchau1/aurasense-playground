// Placeholder for PreviewStrip. Implement as needed for 1-D sampling distribution visualization.
import type { AxisDef } from "@/lib/sweep/axes";

export function PreviewStrip({ axis }: { axis: AxisDef }) {
  // For discrete/categorical: show vertical bars for each value. For continuous: show 64 bins.
  if (axis.type === "discrete") {
    return (
      <div className="flex gap-1 items-end h-8 mt-2">
        {axis.values.map((v, i) => (
          <div key={i} title={String(v)} className="bg-sky-400/60" style={{ width: 8, height: '100%' }} />
        ))}
        <span className="ml-2 text-xs text-zinc-400">{axis.values.length} values</span>
      </div>
    );
  }
  if (axis.type === "categorical") {
    return (
      <div className="flex gap-1 items-end h-8 mt-2">
        {axis.values.map((v, i) => (
          <div key={i} title={v} className="bg-amber-400/60" style={{ width: 8, height: '100%' }} />
        ))}
        <span className="ml-2 text-xs text-zinc-400">{axis.values.length} categories</span>
      </div>
    );
  }
  if (axis.type === "continuous") {
    // Render 64 bins from min to max
    const bins = 64;
    const step = (axis.max - axis.min) / bins;
    const values = Array.from({ length: bins }, (_, i) => axis.min + i * step);
    return (
      <div className="flex gap-0.5 items-end h-8 mt-2">
        {values.map((v, i) => (
          <div key={i} title={v.toFixed(2)} className="bg-emerald-400/60" style={{ width: 2, height: '100%' }} />
        ))}
        <span className="ml-2 text-xs text-zinc-400">{axis.min}–{axis.max}</span>
      </div>
    );
  }
  return null;
}
}
