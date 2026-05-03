import * as React from "react";
import { cn } from "@/lib/cn";

interface LaneBarProps {
  label: string;
  value: number; // 0..100
}

export function LaneBar({ label, value }: LaneBarProps) {
  const v = Math.max(0, Math.min(100, value));
  const tone =
    v >= 75
      ? "bg-emerald-400"
      : v >= 50
      ? "bg-emerald-400/70"
      : v >= 30
      ? "bg-amber-400/80"
      : "bg-red-400/80";
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between text-xs">
        <span className="text-zinc-400">{label}</span>
        <span className="font-mono tabular-nums text-zinc-200">{v.toFixed(0)}</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.05]">
        <div
          className={cn("h-full rounded-full transition-[width] duration-200", tone)}
          style={{ width: `${v}%` }}
        />
      </div>
    </div>
  );
}
