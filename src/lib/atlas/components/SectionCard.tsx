import React from "react";

export function SectionCard({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <section className="bg-white rounded-lg shadow p-6 mb-6">
      {title && <h2 className="text-lg font-semibold mb-3">{title}</h2>}
      <div>{children}</div>
    </section>
  );
}
