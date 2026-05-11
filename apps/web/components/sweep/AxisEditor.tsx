"use client";
import { useMemo, useState, useEffect, useCallback } from "react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import type { AxisDef, Grid, Sampling } from "@/lib/sweep/axes";
import { validate, type GridIssue } from "@/lib/sweep/validate";
import { estimateCells, estimateCost } from "@/lib/sweep/estimate";
// import { useUndoStack } from "@/hooks/useUndoStack"; // Placeholder for actual hook

import { AxisChip } from "./AxisChip";
import { CommonMeta } from "./CommonMeta";
import { PreviewStrip } from "./PreviewStrip";
import { ValidationStrip } from "./ValidationStrip";
import { ImportExportButtons } from "./ImportExportButtons";
import { DiscreteEditor } from "./editors/DiscreteEditor";
import { ContinuousEditor } from "./editors/ContinuousEditor";
import { CategoricalEditor } from "./editors/CategoricalEditor";

type Props = {
  axes: AxisDef[];
  sampling: Sampling;
  onChange: (next: AxisDef[]) => void;
  onSamplingChange?: (next: Sampling) => void;
};

export function AxisEditor({ axes, sampling, onChange, onSamplingChange }: Props) {
  const grid: Grid = useMemo(() => ({ axes, sampling }), [axes, sampling]);
  const [selected, setSelected] = useState<string | undefined>(axes[0]?.id);
  const cur = axes.find(a => a.id === selected);

  const issues: GridIssue[] = useMemo(() => validate(grid), [grid]);
  const cellCount = useMemo(() => estimateCells(grid), [grid]);
  const cost      = useMemo(() => estimateCost(cellCount), [cellCount]);

  // const { push, undo, redo } = useUndoStack(axes, onChange, 50); // Placeholder for actual hook
  const push = (next: AxisDef[]) => onChange(next);
  const undo = () => {};
  const redo = () => {};

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const meta = e.metaKey || e.ctrlKey;
      if (meta && e.key.toLowerCase() === "z" && !e.shiftKey) { e.preventDefault(); undo(); }
      if (meta && (e.key.toLowerCase() === "y" || (e.shiftKey && e.key.toLowerCase() === "z"))) { e.preventDefault(); redo(); }
      if (meta && e.key.toLowerCase() === "d" && cur) { e.preventDefault(); duplicate(cur.id); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const update = useCallback((next: AxisDef) => {
    const draft = axes.map(a => a.id === next.id ? next : a);
    push(draft);
  }, [axes, push]);

  const toggle = (id: string) =>
    push(axes.map(a => a.id === id ? { ...a, enabled: !a.enabled } : a));

  const remove = (id: string) => {
    const next = axes.filter(a => a.id !== id);
    push(next);
    if (selected === id) setSelected(next[0]?.id);
  };

  const duplicate = (id: string) => {
    const src = axes.find(a => a.id === id); if (!src) return;
    const newId = uniqueId(src.id, axes);
    const dup = { ...src, id: newId, label: `${src.label} (copy)` } as AxisDef;
    push([...axes, dup]);
    setSelected(newId);
  };

  const add = (type: AxisDef["type"]) => {
    const id = uniqueId(`${type}_axis`, axes);
    const base = { id, label: prettyLabel(id), enabled: true, importance: "med" as const };
    const fresh: AxisDef =
      type === "discrete"   ? { ...base, type, values: [0, 1, 2] } :
      type === "continuous" ? { ...base, type, min: 0, max: 1, step: 0.1, scale: "linear" } :
                              { ...base, type, values: ["a", "b"] };
    push([...axes, fresh]);
    setSelected(id);
  };

  // Drag reorder
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );
  const handleDragEnd = (e: any) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldI = axes.findIndex(a => a.id === active.id);
    const newI = axes.findIndex(a => a.id === over.id);
    push(arrayMove(axes, oldI, newI));
  };

  return (
    <div className="grid grid-cols-12 gap-4">
      {/* LEFT: list */}
      <div className="col-span-5">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-semibold text-zinc-200">Axes</h4>
          <ImportExportButtons grid={grid} onImport={(g) => { push(g.axes); onSamplingChange?.(g.sampling); }} />
        </div>

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={axes.map(a => a.id)} strategy={verticalListSortingStrategy}>
            <ul role="list" className="space-y-1.5" aria-label="Sweep axes">
              {axes.map(a => (
                <SortableChip
                  key={a.id} axis={a}
                  selected={selected === a.id}
                  onSelect={() => setSelected(a.id)}
                  onToggle={() => toggle(a.id)}
                  onDelete={() => remove(a.id)}
                  onDuplicate={() => duplicate(a.id)}
                />
              ))}
            </ul>
          </SortableContext>
        </DndContext>

        <div className="flex gap-2 pt-3">
          <button onClick={() => add("discrete")}
            className="px-2 py-1 text-xs rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200">+ discrete</button>
          <button onClick={() => add("continuous")}
            className="px-2 py-1 text-xs rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200">+ continuous</button>
          <button onClick={() => add("categorical")}
            className="px-2 py-1 text-xs rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200">+ categorical</button>
        </div>
      </div>

      {/* RIGHT: detail */}
      <div className="col-span-7" aria-live="polite">
        {cur ? (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 space-y-3">
            <CommonMeta axis={cur} onChange={update} otherIds={axes.filter(a => a.id !== cur.id).map(a => a.id)} />
            {cur.type === "discrete"    && <DiscreteEditor    axis={cur} onChange={update} />}
            {cur.type === "continuous"  && <ContinuousEditor  axis={cur} onChange={update} />}
            {cur.type === "categorical" && <CategoricalEditor axis={cur} onChange={update} />}
            <PreviewStrip axis={cur} />
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-zinc-800 p-10 text-center text-sm text-zinc-500">
            Select or add an axis.
          </div>
        )}
      </div>

      {/* FOOTER: validation + cell count */}
      <div className="col-span-12">
        <ValidationStrip issues={issues} cells={cellCount} cost={cost} />
      </div>
    </div>
  );
}

function SortableChip({ axis, ...rest }: any) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: axis.id });
  const style = { transform: CSS.Transform.toString(transform), transition };
  return (
    <li ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <AxisChip axis={axis} {...rest} />
    </li>
  );
}

function uniqueId(base: string, axes: AxisDef[]): string {
  const slug = base.toLowerCase().replace(/[^a-z0-9_]/g, "_").replace(/^_+|_+$/g, "").slice(0, 40) || "axis";
  let id = slug, n = 2;
  const taken = new Set(axes.map(a => a.id));
  while (taken.has(id)) id = `${slug}_${n++}`;
  return id;
}
function prettyLabel(id: string) {
  return id.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}
