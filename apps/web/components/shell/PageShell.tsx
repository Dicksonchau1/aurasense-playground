// PageShell shell component (stub)
import React from "react";
import { TopNav } from "./TopNav";
export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-bg-0">
      <TopNav />
      <main className="flex-1 px-6 py-8">{children}</main>
    </div>
  );
}
