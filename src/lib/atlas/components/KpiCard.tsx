import React from "react";
import type { KPIItem } from "../view-models";

export function KpiCard({ item }: { item: KPIItem }) {
  return (
    <div className={`rounded-lg shadow p-4 bg-white flex flex-col gap-1 border-l-4 border-${item.tone ?? "neutral"}-500`}>
      <div className="text-xs text-gray-500 uppercase tracking-wide">{item.label}</div>
      <div className="text-2xl font-bold">{item.value}</div>
      {item.sublabel && <div className="text-xs text-gray-400">{item.sublabel}</div>}
    </div>
  );
}
