// Slider UI primitive (stub)
import React from "react";
import { cn } from "@/lib/cn";
export function Slider({ value, min = 0, max = 100, step = 1, onChange, className }: {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (v: number) => void;
  className?: string;
}) {
  return (
    <input type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(Number(e.target.value))} className={cn("w-full", className)} />
  );
}
