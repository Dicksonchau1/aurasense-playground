// Row UI primitive (stub)
import React from "react";
import { cn } from "@/lib/cn";
export function Row({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("flex items-center gap-4", className)}>{children}</div>;
}
