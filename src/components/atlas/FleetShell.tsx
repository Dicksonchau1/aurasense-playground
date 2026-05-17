// src/components/atlas/FleetShell.tsx
// Main shell for mounting ATLAS fleet sections in operational order

import React from "react";
import { PerceptionTypedFleetStateSection, PerceptionAwareArbitrationSection } from "./sections";
// Import other sections as needed, e.g. continuity, coordination, etc.

export default function FleetShell({ missionId, vehicleId }: { missionId?: string; vehicleId?: string }) {
  return (
    <div className="atlas-fleet-shell">
      {/* Coordination/continuity sections would be mounted here */}
      {/* ...existing continuity sections... */}


      {/* Perception-aware substrate surfaces (Surface 1) */}
      <PerceptionTypedFleetStateSection missionId={missionId} vehicleId={vehicleId} />

      {/* Perception-aware arbitration (Surface 2) */}
      <PerceptionAwareArbitrationSection missionId={missionId} vehicleId={vehicleId} />

      {/* ...future mixed-fleet sections... */}
    </div>
  );
}
