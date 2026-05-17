"use client";
import { useEffect, useState } from "react";

// Steps for the nurse closure scenario (can be expanded)
const STEPS = [
  { label: "Hand Hygiene", key: "hand_hygiene" },
  { label: "PPE Donning", key: "ppe_donning" },
  { label: "Wound Assessment", key: "wound_assessment" },
  { label: "Closure Technique", key: "closure_technique" },
  { label: "PPE Doffing", key: "ppe_doffing" },
];

export default function NurseRehearseFlow() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [stepResults, setStepResults] = useState<any[]>([]);
  const [anomalies, setAnomalies] = useState<any[]>([]);
  const [verdict, setVerdict] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Start session on mount
  useEffect(() => {
    fetch("/api/rehearse-nurse/start", { method: "POST" })
      .then((r) => r.json())
      .then((d) => setSessionId(d.sessionId))
      .catch(() => setError("Failed to start session"));
  }, []);

  // Handle step submission
  const handleStep = async () => {
    if (!sessionId) return;
    setLoading(true);
    setError(null);
    try {
      const step = STEPS[currentStep];
      const res = await fetch("/api/rehearse-nurse/step", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, stepIndex: currentStep, stepLabel: step.label }),
      });
      const data = await res.json();
      setStepResults((prev) => [...prev, { ...step, ...data }]);
      // Simulate anomaly detection (expand as needed)
      if (data.feedback && data.feedback.toLowerCase().includes("anomaly")) {
        setAnomalies((prev) => [...prev, { step: step.label, detail: data.feedback }]);
      }
      if (currentStep < STEPS.length - 1) {
        setCurrentStep((s) => s + 1);
      } else {
        // Complete session
        const completeRes = await fetch("/api/rehearse-nurse/complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId, steps: stepResults.concat([{ ...step, ...data }]), anomalies }),
        });
        const completeData = await completeRes.json();
        setVerdict(completeData.verdict);
        setSummary(completeData.summary);
      }
    } catch (e) {
      setError("Step failed");
    } finally {
      setLoading(false);
    }
  };

  if (error) return <div className="text-red-500">{error}</div>;
  if (!sessionId) return <div>Starting session...</div>;
  if (verdict)
    return (
      <div className="p-8 max-w-xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-4">Session Complete</h2>
        <div className="mb-2">Verdict: <span className="font-semibold">{verdict}</span></div>
        <div className="mb-4">{summary}</div>
        <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded" onClick={() => window.location.reload()}>Restart</button>
      </div>
    );
  const step = STEPS[currentStep];
  return (
    <div className="p-8 max-w-xl mx-auto text-center">
      <h2 className="text-2xl font-bold mb-4">Nurse Rehearse: {step.label}</h2>
      <div className="mb-4">Step {currentStep + 1} of {STEPS.length}</div>
      <button
        className="px-6 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        onClick={handleStep}
        disabled={loading}
      >
        {loading ? "Processing..." : `Complete Step: ${step.label}`}
      </button>
      <div className="mt-6 text-left">
        <h3 className="font-semibold">Progress</h3>
        <ul className="list-disc ml-6">
          {stepResults.map((r, i) => (
            <li key={i}>{r.label}: {r.feedback}</li>
          ))}
        </ul>
      </div>
      {anomalies.length > 0 && (
        <div className="mt-4 text-yellow-600">
          <strong>Anomalies:</strong>
          <ul className="list-disc ml-6">
            {anomalies.map((a, i) => (
              <li key={i}>{a.step}: {a.detail}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
