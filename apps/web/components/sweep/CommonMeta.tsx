import type { AxisDef } from "@/lib/sweep/axes";

export function CommonMeta({ axis, onChange, otherIds }: { axis: AxisDef; onChange:(a:AxisDef)=>void; otherIds:string[] }) {
  const set = (p: Partial<AxisDef>) => onChange({ ...axis, ...p } as AxisDef);
  const idClash = otherIds.includes(axis.id);
  return (
    <div className="grid grid-cols-12 gap-2">
      <Field className="col-span-4" k="id">
        <input value={axis.id} onChange={(e) => set({ id: e.target.value })}
               className={`w-full bg-zinc-900 border rounded px-2 py-1 text-sm text-zinc-100 font-mono
                 ${idClash ? "border-rose-500" : "border-zinc-800"}`}/>
        {idClash && <span className="text-[11px] text-rose-400">duplicate id</span>}
      </Field>
      <Field className="col-span-4" k="label">
        <input value={axis.label} onChange={(e) => set({ label: e.target.value })}
               className="w-full bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-sm text-zinc-100"/>
      </Field>
      <Field className="col-span-2" k="unit">
        <input value={axis.unit ?? ""} onChange={(e) => set({ unit: e.target.value || undefined })}
               className="w-full bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-sm text-zinc-100"/>
      </Field>
      <Field className="col-span-2" k="seeds">
        <input type="number" min={1} max={32} value={axis.seed_count ?? ""}
               onChange={(e) => set({ seed_count: e.target.value ? +e.target.value : undefined })}
               className="w-full bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-sm text-zinc-100"/>
      </Field>
      <Field className="col-span-3" k="enabled">
        <select value={String(axis.enabled)} onChange={(e) => set({ enabled: e.target.value === "true" })}
                className="w-full bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-sm">
          <option value="true">enabled</option><option value="false">muted</option>
        </select>
      </Field>
      <Field className="col-span-3" k="importance">
        <select value={axis.importance ?? "med"} onChange={(e) => set({ importance: e.target.value as any })}
                className="w-full bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-sm">
          <option value="low">low</option><option value="med">med</option><option value="high">high</option>
        </select>
      </Field>
    </div>
  );
}

const Field = ({ k, className, children }: any) => (
  <label className={`block ${className}`}>
    <span className="text-[11px] uppercase tracking-wide text-zinc-500">{k}</span>
    {children}
  </label>
);
