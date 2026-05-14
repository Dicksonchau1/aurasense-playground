import React from "react";
import type { StatusChipVM } from "../view-models";

const toneColors: Record<string, string> = {
  neutral: "bg-gray-200 text-gray-700",
  info: "bg-blue-100 text-blue-700",
  success: "bg-green-100 text-green-700",
  warning: "bg-yellow-100 text-yellow-800",
  critical: "bg-red-100 text-red-700",
  accent: "bg-purple-100 text-purple-700"
};

export function StatusChip({ chip }: { chip: StatusChipVM }) {
  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${toneColors[chip.tone] ?? toneColors.neutral}`}>{chip.label}</span>
  );
}
