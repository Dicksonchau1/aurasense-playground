import React from "react";
import { getAuditExportRows } from "../view-models";
import type { ReplayAuditBundle } from "../view-models";

export function AuditExportList({ bundle }: { bundle: ReplayAuditBundle | null | undefined }) {
  const rows = getAuditExportRows(bundle);
  if (!rows.length) return <div className="text-gray-400 text-sm">No audit exports</div>;
  return (
    <ul className="space-y-2">
      {rows.map((row) => (
        <li key={row.id} className={`border-l-4 pl-3 py-2 border-${row.tone}-500 bg-gray-50 rounded shadow-sm`}>
          <div className="flex items-center gap-2">
            <span className="font-semibold">{row.label}</span>
            <span className="text-xs text-gray-500">{row.sublabel}</span>
          </div>
          <div className="text-sm text-blue-700 underline break-all">{row.value}</div>
        </li>
      ))}
    </ul>
  );
}
