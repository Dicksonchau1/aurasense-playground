// Dialog UI primitive (stub)
import React from "react";
export function Dialog({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-bg-0 p-6 rounded-xl shadow-lg relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-fg-1">×</button>
        {children}
      </div>
    </div>
  );
}
