import * as React from "react";
import { cn } from "@/lib/cn";

export function Pill({
  children,
  className,
  tone = "neutral",
  ...rest
}: React.HTMLAttributes<HTMLSpanElement> & {
  tone?: "neutral" | "emerald" | "amber" | "muted";
}) {
  const tones: Record<string, string> = {
    neutral: "bg-white/[0.06] text-zinc-200 border-white/10",
    emerald: "bg-emerald-400/15 text-emerald-300 border-emerald-400/30",
    amber: "bg-amber-400/15 text-amber-300 border-amber-400/30",
    muted: "bg-white/[0.03] text-zinc-500 border-white/[0.06]",
  };
  return (
    <span
      {...rest}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium tracking-tight",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
