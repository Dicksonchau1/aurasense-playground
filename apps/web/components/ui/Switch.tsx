// Switch UI primitive (stub)
import React from "react";
import { cn } from "@/lib/cn";
export function Switch({ checked, onChange, className }: {
  checked: boolean;
  onChange: (v: boolean) => void;
  className?: string;
}) {
  return (
    <button type="button" role="switch" aria-checked={checked} onClick={() => onChange(!checked)} className={cn("w-10 h-6 rounded-full bg-bg-2 flex items-center", checked && "bg-accent", className)}>
      <span className={cn("inline-block w-5 h-5 bg-white rounded-full transition-transform", checked && "translate-x-4")}/>
    </button>
  );
}
