// Group UI primitive (stub)
import React from "react";
import { cn } from "@/lib/cn";
export function Group({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("flex gap-2", className)}>{children}</div>;
}
