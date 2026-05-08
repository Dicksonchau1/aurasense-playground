"use client";
import * as React from "react";
import { Lock } from "lucide-react";
import { useMembershipDrawer } from "@/components/membership-drawer";
import { cn } from "@/lib/cn";

interface LaneToggleProps {
  label: string;
  enabled?: boolean;
  locked?: boolean;
  note?: string;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
}

export function LaneToggle({ label, enabled = true, locked = false, note, defaultChecked = true, onChange }: LaneToggleProps) {
  const drawer = useMembershipDrawer();
  const [checked, setChecked] = React.useState(defaultChecked && enabled && !locked);

  function handleClick() {
    if (locked) { drawer.open(label); return; }
    if (!enabled) return;
    const next = !checked;
    setChecked(next);
    onChange?.(next);
  }

  if (locked) {
    return (
      <button type="button" onClick={handleClick}
        className={cn("group inline-flex items-center gap-2 rounded-full border border-white/10","bg-white/[0.02] px-3 py-1.5 text-xs text-zinc-400","transition-colors hover:border-emerald-400/40 hover:text-zinc-200")}>
        <Lock className="w-3 h-3" style={{ color: "var(--lock-red)" }} />
        <span>{label}</span>
        {note && <span className="text-[10px] uppercase tracking-wider text-zinc-500 group-hover:text-emerald-300/80">{note}</span>}
      </button>
    );
  }

  return (
    <button type="button" onClick={handleClick} aria-pressed={checked} disabled={!enabled}
      className={cn("inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition-colors",
        checked ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-200" : "border-white/10 bg-white/[0.02] text-zinc-400 hover:text-zinc-200",
        !enabled && "opacity-40 cursor-not-allowed")}>
      <span aria-hidden>{checked ? "✓" : "○"}</span>
      <span>{label}</span>
    </button>
  );
}
