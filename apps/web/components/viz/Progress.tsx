// Progress visualization component (stub)
import React from "react";
export function Progress({ value, max = 100 }: { value: number; max?: number }) {
  return (
    <div className="w-full h-2 bg-bg-2 rounded">
      <div className="h-2 bg-accent rounded" style={{ width: `${(value / max) * 100}%` }} />
    </div>
  );
}
