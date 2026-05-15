// src/components/atlas/sections/PerceptionTypedFleetStateSection.tsx
// Presentational section for perception-typed fleet state (Surface 1)

import React from "react";
import { usePerceptionTypedFleetState } from "../../../lib/atlas/hooks-fleet";
import { getPerceptionTypedFleetStatePanelVM } from "../../../lib/atlas/view-models-fleet";
import SectionCard from "../../../lib/atlas/components/SectionCard";
import KpiCardGrid from "../../../lib/atlas/components/KpiCardGrid";

export default function PerceptionTypedFleetStateSection({
  missionId,
  vehicleId
}: {
  missionId?: string;
  vehicleId?: string;
}) {
  const perceptionState = usePerceptionTypedFleetState({ missionId, vehicleId });
  const kpis = getPerceptionTypedFleetStatePanelVM(perceptionState);

  return (
    <SectionCard title="Perception-Typed Fleet State">
      <KpiCardGrid items={kpis} />
    </SectionCard>
  );
}
