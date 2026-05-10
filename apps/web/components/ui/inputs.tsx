import React from "react";

export function Slider({ label, value, min, max, step=1, unit, fmt, onChange }: any) {
  return (
    <label className="block py-1.5">
      <div className="flex justify-between text-xs text-zinc-400">
        <span>{label}</span>
        <span className="tabular-nums text-zinc-200">{fmt ? fmt(value) : value}{unit ? ` ${unit}` : ""}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
             onChange={(e) => onChange(+e.target.value)}
             className="mt-1 w-full accent-sky-500"/>
    </label>
  );
}

export function Switch({ label, checked, onChange }: any) {
  return (
    <label className="flex items-center justify-between py-1.5 text-sm text-zinc-300">
      <span>{label}</span>
      <span onClick={() => onChange(!checked)}
            className={`relative inline-block w-9 h-5 rounded-full transition cursor-pointer
                        ${checked ? "bg-sky-500" : "bg-zinc-700"}`}>
        <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition
                        ${checked ? "translate-x-4" : ""}`}/>
      </span>
    </label>
  );
}

export function Select({ label, value, options, onChange }: any) {
  return (
    <label className="block py-1.5">
      <span className="text-xs text-zinc-400">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}
              className="mt-1 w-full bg-zinc-900 border border-zinc-800 rounded-md px-2 py-1.5 text-sm text-zinc-200">
        {options.map((o: any) => (
          <option key={typeof o === "string" ? o : o.v} value={typeof o === "string" ? o : o.v}>
            {typeof o === "string" ? o : o.l}
          </option>
        ))}
      </select>
    </label>
  );
}

export function SegmentedControl({ value, onChange, options }: any) {
  return (
    <div className="inline-flex bg-zinc-900 border border-zinc-800 rounded-lg p-0.5">
      {options.map((o: any) => (
        <button key={o.v} onClick={() => onChange(o.v)}
                className={`px-3 py-1.5 rounded-md text-sm transition
                  ${value === o.v ? "bg-zinc-800 text-zinc-100" : "text-zinc-500 hover:text-zinc-300"}`}>
          {o.l}{o.badge && <span className="ml-2 text-[10px] text-zinc-500">{o.badge}</span>}
        </button>
      ))}
    </div>
  );
}

export function Group({ label, children }: any) {
  return (
    <details open className="border-t border-zinc-800 first:border-t-0 py-3">
      <summary className="cursor-pointer text-sm font-medium text-zinc-200 list-none flex justify-between">
        {label}<span className="text-zinc-500">▾</span>
      </summary>
      <div className="mt-2 space-y-1">{children}</div>
    </details>
  );
}

export function Field({ k, v }: any) {
  return (
    <div className="flex justify-between py-1 text-sm">
      <span className="text-zinc-500">{k}</span>
      <span className="text-zinc-200 font-mono">{v}</span>
    </div>
  );
}

export function Row({ k, v }: any) {
  return (
    <div className="flex justify-between py-0.5 text-xs">
      <span className="text-zinc-500">{k}</span>
      <span className="text-zinc-200 tabular-nums">{v}</span>
    </div>
  );
}
