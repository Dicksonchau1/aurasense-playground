import React from "react";
import EdSignatureChip from "../components/EdSignatureChip";

export default function SampleReportPage() {
  return (
    <section className="flex flex-col items-center justify-center min-h-[80vh] text-center">
      <h1 className="text-3xl md:text-5xl font-bold mb-4">Sample Signed Report</h1>
      <div className="bg-warning text-black font-bold py-2 px-4 rounded mb-4" style={{transform: 'rotate(-2deg)'}}>REHEARSAL — NEPA Playground · Not for production use</div>
      <div className="bg-surface p-6 rounded shadow w-full max-w-2xl mb-8">
        <div className="font-bold mb-2">Report Title: Façade Inspection Rehearsal</div>
        <div className="mb-2">Scenario: Sample Drone Footage</div>
        <div className="mb-2">Ed25519 Signature: <EdSignatureChip /></div>
        <div className="mb-2">Summary: 12 findings, Residential, 8:30 min, v1.0.0, Audit chain root: <span className="font-mono">abc123...</span></div>
        <div className="mb-2">Findings: <span className="font-mono">[paginated table stub]</span></div>
        <div className="mb-2">MBIS Preview: <span className="font-mono">[watermarked preview stub]</span></div>
        <div className="mb-2">Audit Chain: <span className="font-mono">[timeline stub]</span></div>
        <div className="flex gap-4 mt-4">
          <button className="bg-primary text-black font-bold py-2 px-6 rounded shadow">Download PDF</button>
          <button className="bg-primary text-black font-bold py-2 px-6 rounded shadow">Download JSON</button>
        </div>
        <div className="text-xs mt-2">Verify with: <span className="font-mono">aurastudio audit verify report.json</span></div>
      </div>
      <div className="bg-surface p-4 rounded shadow w-full max-w-xl text-xs">
        <b>Note:</b> This is a real, verifiable signature. Use the public CLI to verify.
      </div>
    </section>
  );
}