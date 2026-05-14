import React from "react";
import type { StatusChipVM } from "../view-models";
import { StatusChip } from "./StatusChip";

export function AtlasPageHeader({ title, subtitle, chips }: { title: string; subtitle?: string; chips: StatusChipVM[] }) {
  return (
    <header className="mb-6">
      <h1 className="text-3xl font-bold mb-1">{title}</h1>
      {subtitle && <p className="text-gray-500 mb-2">{subtitle}</p>}
      <div className="flex gap-2 flex-wrap">
        {chips.map((chip, i) => (
          <StatusChip chip={chip} key={i} />
        ))}
      </div>
    </header>
  );
}
