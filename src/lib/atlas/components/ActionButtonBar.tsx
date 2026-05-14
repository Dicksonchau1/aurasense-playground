import React from "react";

export function ActionButtonBar({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-3 mt-4">
      {children}
    </div>
  );
}
