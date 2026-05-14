import React from "react";
import { getTopRisks } from "../view-models";
import type { RehearsalVerdict } from "../view-models";

export function TopRisksList({ rehearsal }: { rehearsal: RehearsalVerdict | null | undefined }) {
  const risks = getTopRisks(rehearsal);
  if (!risks.length) return <div className="text-gray-400 text-sm">No predicted risks</div>;
  return (
    <ul className="space-y-2">
      {risks.map((risk) => (
        <li key={risk.id} className={`border-l-4 pl-3 py-2 border-${risk.tone}-500 bg-gray-50 rounded shadow-sm`}>
          <div className="flex items-center gap-2">
            <span className="font-semibold">{risk.title}</span>
            <span className="text-xs text-gray-500">Confidence: {risk.confidence}</span>
          </div>
          <div className="text-sm text-gray-700">{risk.detail}</div>
        </li>
      ))}
    </ul>
  );
}
