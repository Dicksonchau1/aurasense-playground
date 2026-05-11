// SegmentedControl UI primitive (stub)
import React from "react";
import { cn } from "@/lib/cn";
export function SegmentedControl({ options, value, onChange, className }: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
  className?: string;
}) {
  return (
    <div className={cn("inline-flex rounded bg-bg-2 p-1", className)}>
      {options.map(opt => (
        <button key={opt} onClick={() => onChange(opt)} className={cn("px-3 py-1 rounded", value === opt ? "bg-accent text-white" : "text-fg-1")}>{opt}</button>
      ))}
    </div>
  );
}
