import React from "react";

export default function NurseRehearseInstructorSummary({ result, onReturn }: { result: any, onReturn: () => void }) {
  return (
    <div className="bg-gray-900 rounded-lg p-6 w-full max-w-xl mx-auto">
      <h3 className="text-xl font-bold mb-4">Instructor Summary</h3>
      <div className="mb-2"><b>Learner:</b> Demo User</div>
      <div className="mb-2"><b>Module:</b> Hand Hygiene</div>
      <div className="mb-2"><b>Result:</b> {result.verdict === "pass" ? "Pass" : "Hold/Fail"}</div>
      <div className="mb-2"><b>Missed Steps:</b> {result.steps.filter((s: any) => !s.completed).map((s: any) => s.label).join(", ") || "None"}</div>
      <div className="mb-2"><b>Anomalies:</b> {result.anomalies && result.anomalies.length > 0 ? result.anomalies.join(", ") : "None"}</div>
      <div className="mb-2"><b>Override/Sign-off:</b> {result.override ? "Yes" : "No"}</div>
      <div className="mt-4 flex flex-col gap-2">
        <button className="btn btn-secondary" onClick={onReturn}>Return to Result</button>
      </div>
    </div>
  );
}
