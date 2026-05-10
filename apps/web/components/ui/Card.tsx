import React from "react";
export const Card = ({ title, right, children }: any) => (
  <section className="rounded-2xl border border-zinc-800 bg-zinc-950/60 backdrop-blur p-5">
    {(title || right) && (
      <header className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-zinc-100">{title}</h3>
        <div className="text-xs text-zinc-500">{right}</div>
      </header>
    )}
    {children}
  </section>
);
