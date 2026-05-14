import React from "react";
import { getValidationRows } from "../view-models";
import type { MissionValidationResult } from "../view-models";

export function ValidationList({ validation }: { validation: MissionValidationResult | null | undefined }) {
  const rows = getValidationRows(validation);
  if (!rows.length) return <div className="text-gray-400 text-sm">No validation issues</div>;
  return (
    <ul className="space-y-2">
      {rows.map((row) => (
        <li key={row.id} className={`border-l-4 pl-3 py-2 border-${row.tone}-500 bg-gray-50 rounded shadow-sm`}>
          <div className="flex items-center gap-2">
            <span className="font-semibold">{row.title}</span>
            <span className="text-xs text-gray-500">Waypoint: {row.waypoint}</span>
            <span className="text-xs text-gray-400">Field: {row.field}</span>
          </div>
          <div className="text-sm text-gray-700">{row.detail}</div>
        </li>
      ))}
    </ul>
  );
}
