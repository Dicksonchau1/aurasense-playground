// Select UI primitive (stub)
import React from "react";
import { cn } from "@/lib/cn";
export function Select({ value, options, onChange, className }: {
  value: string | number;
  options: (string | number)[];
  onChange: (v: string | number) => void;
  className?: string;
}) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)} className={cn("px-2 py-1 rounded bg-bg-1 text-fg-0", className)}>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}
