import type { AxisDef } from "@/lib/sweep/axes";
import { importanceWeight } from "@/lib/sweep/importance";

type Props = {
  axis: AxisDef;
  selected: boolean;
  onSelect: () => void;
  onToggle: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
};

export function AxisChip({ axis, selected, onSelect, onToggle, onDelete, onDuplicate }: Props) {
  const card = axis.type === "continuous"
    ? `${axis.min}–${axis.max} step ${axis.step}`
    : `${axis.values.length} values`;

  return (
    <button
      role="listitem"
      aria-selected={selected}
      onClick={onSelect}
      onKeyDown={(e) => { if (e.key === " ") { e.preventDefault(); onToggle(); } }}
      className={`w-full text-left rounded-lg border px-3 py-2 transition flex items-center gap-3
        ${selected ? "border-sky-500/50 bg-sky-500/5" : "border-zinc-800 bg-zinc-950/40 hover:border-zinc-700"}`}
    >
      <span
        onClick={(e) => { e.stopPropagation(); onToggle(); }}
        className={`w-2 h-2 rounded-full ${axis.enabled ? "bg-emerald-400" : "bg-zinc-600"}`}
        title={axis.enabled ? "enabled" : "muted"}
      />
      <div className="flex-1 min-w-0">
        <div className="text-sm text-zinc-100 truncate">
          {axis.label} {axis.unit && <span className="text-zinc-500">({axis.unit})</span>}
        </div>
        <div className="text-[11px] text-zinc-500 font-mono truncate">{axis.id} · {card}</div>
      </div>
      <span className={`text-[10px] uppercase px-1.5 py-0.5 rounded ${
        axis.importance === "high" ? "bg-rose-500/15 text-rose-300" :
        axis.importance === "low"  ? "bg-zinc-700/40 text-zinc-400" :
                                     "bg-amber-500/15 text-amber-300"}`}>
        {axis.importance ?? "med"}·{importanceWeight(axis).toFixed(1)}
      </span>
      <span className="text-zinc-500 hover:text-zinc-200 px-1" onClick={(e) => { e.stopPropagation(); onDuplicate(); }}>⎘</span>
      <span className="text-zinc-500 hover:text-rose-400 px-1" onClick={(e) => { e.stopPropagation(); onDelete(); }}>×</span>
    </button>
  );
}
