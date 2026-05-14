// ATLAS AuditShell: integrates LogReplaySection and WaypointExecutionSection
import React from "react";
import { LogReplaySection, WaypointExecutionSection } from "../../../components/atlas/sections";

export default function AuditShell() {
  return (
    <main className="atlas-shell p-8">
      <h1 className="text-2xl font-bold mb-4">ATLAS Audit</h1>
      <LogReplaySection />
      <WaypointExecutionSection />
    </main>
  );
}
