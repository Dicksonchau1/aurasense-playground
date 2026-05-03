"use client";

import * as React from "react";
import { useMembershipDrawer } from "@/components/membership-drawer";
import { cn } from "@/lib/cn";

interface LaneToggleProps {
  label: string;
  enabled?: boolean;
  locked?: boolean;
  note?: string;
  defaultChecked?: boolean;
}

export function LaneToggle({
  label,
  enabled = true,
  locked = false,
  note,
  defaultChecked = true,
}: LaneToggleProps) {
  const drawer = useMembershipDrawer();
  const [checked, setChecked] = React.useState(defaultChecked && enabled && !locked);

  if (locked) {
    return (
      <button
        type="button"
        onClick={() => drawer.open(label)}
        className={cn(
          "group inline-flex items-center gap-2 rounded-full border border-white/10",
          "bg-white/[0.02] px-3 py-1.5 text-xs text-zinc-400",
          "transition-colors hover:border-emerald-400/40 hover:text-zinc-200"
        )}
      >
        <span aria-hidden>🔒</span>
        <span>{label}</span>
        {note && (
          <span className="text-[10px] uppercase tracking-wider text-zinc-500 group-hover:text-emerald-300/80">
            {note}
          </span>
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setChecked((v) => !v)}
      aria-pressed={checked}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition-colors",
        checked
          ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-200"
          : "border-white/10 bg-white/[0.02] text-zinc-400 hover:text-zinc-200"
      )}
    >
      <span aria-hidden>{checked ? "✓" : "○"}</span>
      <span>{label}</span>
    </button>
  );
}
