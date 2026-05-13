import * as React from "react";
import { cn } from "@/lib/cn";

export type StatePillStatus = "live" | "degraded" | "offline" | "empty";

const statusStyles: Record<StatePillStatus, string> = {
  live: "bg-emerald-400/15 text-emerald-300 border-emerald-400/30",
  degraded: "bg-amber-400/15 text-amber-300 border-amber-400/30",
  offline: "bg-rose-400/15 text-rose-300 border-rose-400/30",
  empty: "bg-white/[0.06] text-zinc-400 border-white/10",
};

export function StatePill({
  status,
  children,
  className,
  ...rest
}: React.HTMLAttributes<HTMLSpanElement> & { status: StatePillStatus }) {
  return (
    <span
      {...rest}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium tracking-tight",
        statusStyles[status],
        className
      )}
    >
      {children ?? status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
