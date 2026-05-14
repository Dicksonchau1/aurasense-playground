import React from "react";
import type { TimelineRowVM } from "../view-models";

export function TimelineList({ rows }: { rows: TimelineRowVM[] }) {
  return (
    <ul className="space-y-2">
      {rows.map((row) => (
        <li key={row.id} className={`border-l-4 pl-3 py-2 border-${row.tone}-500 bg-gray-50 rounded shadow-sm`}>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">{row.ts}</span>
            <span className="font-semibold">{row.title}</span>
            <span className="text-xs text-gray-500">({row.source})</span>
          </div>
          <div className="text-sm text-gray-700">{row.detail}</div>
        </li>
      ))}
    </ul>
  );
}
