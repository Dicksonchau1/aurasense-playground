// Toaster UI primitive (stub)
import React, { useState } from "react";
export function Toaster() {
  const [toasts, setToasts] = useState<string[]>([]);
  // This is a stub; real implementation would use context
  return (
    <div className="fixed bottom-4 right-4 space-y-2 z-50">
      {toasts.map((msg, i) => <div key={i} className="bg-bg-2 text-fg-0 px-4 py-2 rounded shadow">{msg}</div>)}
    </div>
  );
}
