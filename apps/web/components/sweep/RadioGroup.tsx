import React from "react";

export function RadioGroup({ value, onChange, options }: any) {
  return (
    <div className="flex gap-3">
      {options.map((o: any) => (
        <label key={o.v} className="flex items-center gap-1 cursor-pointer text-sm">
          <input type="radio" checked={value===o.v} onChange={()=>onChange(o.v)} className="accent-sky-500"/>
          <span>{o.l}</span>
          {o.hint && <span className="text-xs text-zinc-500 ml-1">{o.hint}</span>}
        </label>
      ))}
    </div>
  );
}
