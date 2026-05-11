// Badge UI primitive (stub)
import React from "react";
import { cn } from "@/lib/cn";
export function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={cn("inline-block px-2 py-0.5 rounded bg-bg-2 text-fg-1 text-xs uppercase", className)}>{children}</span>;
}
