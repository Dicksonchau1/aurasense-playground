// Field UI primitive (stub)
import React from "react";
import { cn } from "@/lib/cn";
export function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={cn("block mb-2", className)}>
      <span className="block text-xs text-fg-1 mb-1">{label}</span>
      {children}
    </label>
  );
}
