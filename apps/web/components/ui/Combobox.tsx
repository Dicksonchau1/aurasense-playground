// Combobox UI primitive (stub)
import React, { useState } from "react";
import { cn } from "@/lib/cn";
export function Combobox({ value, options, onChange, placeholder, className }: {
  value?: string;
  options: string[];
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}) {
  const [q, setQ] = useState(value ?? "");
  const filtered = options.filter(o => o.toLowerCase().includes(q.toLowerCase())).slice(0, 8);
  return (
    <div className={cn("relative", className)}>
      <input value={q} onChange={e => setQ(e.target.value)} placeholder={placeholder} className="w-full bg-bg-1 border border-bg-2 rounded px-2 py-1.5 text-sm text-fg-0" />
      {q && filtered.length > 0 && (
        <ul className="absolute left-0 right-0 mt-1 z-10 rounded border border-bg-2 bg-bg-0 max-h-48 overflow-auto">
          {filtered.map(o => (
            <li key={o} onClick={() => { onChange(o); setQ(o); }} className="px-2 py-1 text-sm text-fg-0 hover:bg-bg-2 cursor-pointer">{o}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
