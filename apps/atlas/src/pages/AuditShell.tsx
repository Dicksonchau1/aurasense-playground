// ATLAS AuditShell: integrates LogReplaySection and WaypointExecutionSection


import React, { useCallback, useRef, useState } from "react";
import {
  LogReplaySection,
  WaypointExecutionSection,
  EvidenceBundleSection,
  EvidenceExportSection,
  ExternalDisclosureSection,
  RegulatoryComplianceSection,
  StakeholderBriefSection
} from "../../../../src/components/atlas/sections";


// Analytics logger: logs to console and sends to backend
async function logAuditEvent(event: string, details?: any) {
  // Console log for dev
  // eslint-disable-next-line no-console
  console.log(`[AUDIT ANALYTICS] ${event}`, details || "");
  // Send to backend (replace '/api/audit-analytics' with your endpoint)
  try {
    await fetch("/api/audit-analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event, details, ts: new Date().toISOString() })
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn("Analytics backend error", e);
  }
}

export default function AuditShell() {
  // Centralized shell state for orchestration
  const [selectedComplianceControl, setSelectedComplianceControl] = useState<string | undefined>();
  const [selectedDisclosureId, setSelectedDisclosureId] = useState<string | undefined>();
  const [selectedArtifactId, setSelectedArtifactId] = useState<string | undefined>();
  const [selectedAudience, setSelectedAudience] = useState<string | undefined>();
  const [complianceSigned, setComplianceSigned] = useState(false);
  const [evidenceExported, setEvidenceExported] = useState(false);
  const [timeline, setTimeline] = useState<Array<{event: string, details?: any, ts: string}>>([]);
  const [undoStack, setUndoStack] = useState<any[]>([]);
  const [redoStack, setRedoStack] = useState<any[]>([]);

  // Section refs for auto-scroll
  const complianceRef = useRef<HTMLDivElement>(null);
  const evidenceRef = useRef<HTMLDivElement>(null);
  const disclosureRef = useRef<HTMLDivElement>(null);
  const stakeholderRef = useRef<HTMLDivElement>(null);

  // Progress indicator: 0-4 steps
  const progress =
    (complianceSigned ? 1 : 0) +
    (selectedAudience ? 1 : 0) +
    (selectedDisclosureId ? 1 : 0) +
    (evidenceExported ? 1 : 0);

  // Analytics + timeline
  const trackEvent = useCallback(async (event: string, details?: any) => {
    setTimeline(tl => [...tl, { event, details, ts: new Date().toISOString() }]);
    await logAuditEvent(event, details);
  }, []);

  // Undo/redo helpers
  const pushUndo = (state: any) => setUndoStack(stack => [...stack, state]);
  const popUndo = () => {
    setUndoStack(stack => stack.slice(0, -1));
    setRedoStack(stack => [...redoStack, getCurrentState()]);
    restoreState(undoStack[undoStack.length - 1]);
  };
  const popRedo = () => {
    setRedoStack(stack => stack.slice(0, -1));
    setUndoStack(stack => [...undoStack, getCurrentState()]);
    restoreState(redoStack[redoStack.length - 1]);
  };
  const getCurrentState = () => ({
    selectedComplianceControl,
    selectedDisclosureId,
    selectedArtifactId,
    selectedAudience,
    complianceSigned,
    evidenceExported
  });
  const restoreState = (s: any) => {
    if (!s) return;
    setSelectedComplianceControl(s.selectedComplianceControl);
    setSelectedDisclosureId(s.selectedDisclosureId);
    setSelectedArtifactId(s.selectedArtifactId);
    setSelectedAudience(s.selectedAudience);
    setComplianceSigned(s.complianceSigned);
    setEvidenceExported(s.evidenceExported);
  };

  // Orchestration handlers
  const handleSignComplianceExport = useCallback(() => {
    pushUndo(getCurrentState());
    setComplianceSigned(true);
    trackEvent("compliance_export_signed");
    // Auto-scroll to evidence export
    setTimeout(() => evidenceRef.current?.scrollIntoView({ behavior: "smooth" }), 200);
  }, [trackEvent]);

  const handleSelectComplianceControl = useCallback((id: string) => {
    pushUndo(getCurrentState());
    setSelectedComplianceControl(id);
    trackEvent("compliance_control_selected", { id });
  }, [trackEvent]);

  const handleSelectDisclosure = useCallback((id: string) => {
    pushUndo(getCurrentState());
    setSelectedDisclosureId(id);
    trackEvent("disclosure_selected", { id });
    setTimeout(() => disclosureRef.current?.scrollIntoView({ behavior: "smooth" }), 200);
  }, [trackEvent]);

  const handleSetDisclosureStatus = useCallback((id: string, status: string) => {
    pushUndo(getCurrentState());
    trackEvent("disclosure_status_set", { id, status });
  }, [trackEvent]);

  const handleSelectArtifact = useCallback((id: string) => {
    pushUndo(getCurrentState());
    setSelectedArtifactId(id);
    trackEvent("evidence_artifact_selected", { id });
  }, [trackEvent]);

  const handleSignExportPackage = useCallback(() => {
    pushUndo(getCurrentState());
    trackEvent("evidence_export_signed");
  }, [trackEvent]);

  const handleExportPackage = useCallback(() => {
    pushUndo(getCurrentState());
    setEvidenceExported(true);
    trackEvent("evidence_exported");
  }, [trackEvent]);

  const handleSetAudience = useCallback((audience: string) => {
    pushUndo(getCurrentState());
    setSelectedAudience(audience);
    trackEvent("stakeholder_audience_set", { audience });
    setTimeout(() => stakeholderRef.current?.scrollIntoView({ behavior: "smooth" }), 200);
  }, [trackEvent]);

  // Validation: only allow evidence export if compliance is signed
  const evidenceExportEnabled = complianceSigned;

  // Final validation: all steps complete
  const allComplete = complianceSigned && selectedAudience && selectedDisclosureId && evidenceExported;

export default function AuditShell() {
  return (
    <main className="atlas-shell p-8" role="main" aria-label="ATLAS Audit Shell">
      <h1 className="text-2xl font-bold mb-4" tabIndex={0} aria-label="ATLAS Audit Shell Title">ATLAS Audit</h1>
      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded h-3 mb-4" aria-label="Progress Bar" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={4} tabIndex={0}>
        <div
          className="bg-blue-600 h-3 rounded"
          style={{ width: `${(progress / 4) * 100}%` }}
        />
      </div>
      <div className="flex gap-2 mb-4" role="group" aria-label="Undo Redo Controls">
        <button
          className="px-2 py-1 bg-gray-100 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={popUndo}
          disabled={undoStack.length === 0}
          aria-label="Undo"
        >Undo</button>
        <button
          className="px-2 py-1 bg-gray-100 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={popRedo}
          disabled={redoStack.length === 0}
          aria-label="Redo"
        >Redo</button>
        <span className="ml-4 text-sm text-gray-600" aria-live="polite">
          {allComplete ? "All steps complete!" : `Progress: ${progress}/4`}
        </span>
      </div>
      <section aria-label="Log Replay Section">
        <LogReplaySection />
      </section>
      <section aria-label="Waypoint Execution Section">
        <WaypointExecutionSection />
      </section>
      <section aria-label="Evidence Bundle Section">
        <EvidenceBundleSection />
      </section>
      <section ref={evidenceRef} aria-label="Evidence Export Section">
        <EvidenceExportSection
          selectedArtifactId={selectedArtifactId}
          onSelectArtifact={handleSelectArtifact}
          onSignExport={handleSignExportPackage}
          onExportPackage={handleExportPackage}
          // Disable export if compliance not signed
          exportEnabled={evidenceExportEnabled}
          complianceSigned={complianceSigned}
        />
      </section>
      <section ref={disclosureRef} aria-label="External Disclosure Section">
        <ExternalDisclosureSection
          selectedDisclosureId={selectedDisclosureId}
          onSelectDisclosure={handleSelectDisclosure}
          onSetDisclosureStatus={handleSetDisclosureStatus}
        />
      </section>
      <section ref={complianceRef} aria-label="Regulatory Compliance Section">
        <RegulatoryComplianceSection
          selectedControlId={selectedComplianceControl}
          onSelectControl={handleSelectComplianceControl}
          onSignExport={handleSignComplianceExport}
          complianceSigned={complianceSigned}
        />
      </section>
      <section ref={stakeholderRef} aria-label="Stakeholder Brief Section">
        <StakeholderBriefSection
          selectedAudience={selectedAudience}
          onSetAudience={handleSetAudience}
        />
      </section>
      {/* Timeline of actions */}
      <section className="mt-8" aria-label="Action Timeline">
        <h2 className="text-lg font-semibold mb-2" tabIndex={0}>Action Timeline</h2>
        <ol className="text-xs bg-gray-50 rounded p-2 max-h-40 overflow-y-auto" aria-live="polite">
          {timeline.map((item, i) => (
            <li key={i} className="mb-1">
              <span className="text-gray-500">[{item.ts}]</span> <b>{item.event}</b>
              {item.details && (
                <span className="ml-2 text-gray-700">{JSON.stringify(item.details)}</span>
              )}
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}
