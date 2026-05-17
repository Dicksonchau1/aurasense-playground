// src/components/atlas/sections/PerceptionAwareArbitrationSection.tsx
// Presentational section for perception-aware arbitration (Surface 2)

import React from "react";
import { usePerceptionAwareArbitration } from "../../../lib/atlas/hooks-fleet";
import { getPerceptionAwareArbitrationPanelVM } from "../../../lib/atlas/view-models-fleet";
import SectionCard from "../../../lib/atlas/components/SectionCard";
import KpiCardGrid from "../../../lib/atlas/components/KpiCardGrid";

export default function PerceptionAwareArbitrationSection({
  missionId,
  vehicleId,
  requiredCoveragePct
}: {
  missionId?: string;
  vehicleId?: string;
  requiredCoveragePct?: number;
}) {
  const arbitration = usePerceptionAwareArbitration({ missionId, vehicleId, requiredCoveragePct });
  const vm = getPerceptionAwareArbitrationPanelVM(arbitration);

  return (
    <SectionCard title="Perception-Aware Arbitration" status={vm.status}>
      <KpiCardGrid items={vm.kpis} />
      <ul className="mt-4 text-sm text-zinc-600">
        {vm.reasons.map((r, i) => (
          <li key={i}>• {r.message}</li>
        ))}
      </ul>
    </SectionCard>
  );
}
