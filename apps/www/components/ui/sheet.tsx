"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

interface SheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export function Sheet({ open, onClose, title, children }: SheetProps) {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div
        aria-hidden
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-in fade-in"
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          "relative ml-auto h-full w-full max-w-md border-l border-white/10 bg-zinc-950 p-6",
          "shadow-2xl"
        )}
      >
        <header className="mb-6 flex items-start justify-between">
          {title && (
            <h2 className="text-lg font-semibold tracking-tight text-zinc-100">
              {title}
            </h2>
          )}
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-md p-1 text-zinc-400 hover:bg-white/[0.06] hover:text-zinc-100"
          >
            ✕
          </button>
        </header>
        <div className="space-y-4 text-sm text-zinc-300">{children}</div>
      </aside>
    </div>
  );
}
