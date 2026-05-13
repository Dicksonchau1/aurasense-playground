import React from "react";

export default function NurseRehearseResult({ result, onRetry, onReturn, onInstructor }: { result: any, onRetry: () => void, onReturn: () => void, onInstructor: () => void }) {
  return (
    <div className="bg-gray-900 rounded-lg p-6 w-full max-w-xl mx-auto text-center">
      <h3 className="text-2xl font-bold mb-4">Module Complete</h3>
      <div className="mb-2 text-lg">{result.verdict === "pass" ? "✅ Passed" : "❌ Not Passed"}</div>
      <div className="mb-2 text-base">{result.summary}</div>
      {result.anomalies && result.anomalies.length > 0 && (
        <div className="mb-2 text-yellow-300">Major Anomalies: {result.anomalies.join(", ")}</div>
      )}
      <div className="mb-4 text-xs text-gray-400">Session ID: {result.sessionId}<br/>Timestamp: {result.timestamp}</div>
      <div className="flex flex-col gap-2 mt-4">
        <button className="btn btn-primary" onClick={onRetry}>Rehearse Again</button>
        <button className="btn btn-secondary" onClick={onReturn}>Return to Playground</button>
        <button className="btn btn-accent" onClick={onInstructor}>Instructor Summary</button>
      </div>
    </div>
  );
}
