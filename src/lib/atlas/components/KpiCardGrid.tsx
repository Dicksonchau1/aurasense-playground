import React from "react";
import type { KPIItem } from "../view-models";
import { KpiCard } from "./KpiCard";

export function KpiCardGrid({ items }: { items: KPIItem[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      {items.map((item) => (
        <KpiCard item={item} key={item.key} />
      ))}
    </div>
  );
}
