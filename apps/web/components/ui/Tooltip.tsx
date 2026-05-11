// Tooltip UI primitive (stub)
import React from "react";
export function Tooltip({ children, label }: { children: React.ReactNode; label: string }) {
  // Stub: no real hover logic
  return <span title={label}>{children}</span>;
}
