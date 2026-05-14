
import React, { useEffect, useState } from "react";
import { fetchJSON } from "../../utils/fetchJSON";
import { useDemoState } from "../../store/demoState";
import { saveNurseRehearseSession, loadNurseRehearseSession, clearNurseRehearseSession } from "../../utils/nurseRehearseSession";

interface Step {
  label: string;
  completed: boolean;
  feedback?: string;
}

const steps: Step[] = [
  { label: "Hand Hygiene: Start", completed: false },
  { label: "Hand Rub", completed: false },
  { label: "Hand Wash", completed: false },
  { label: "Hand Hygiene: Complete", completed: false }
];

export default function NurseRehearseSession({ onComplete }: { onComplete: (result: any) => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [progress, setProgress] = useState(steps);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    // Try to load persisted session
    const persisted = loadNurseRehearseSession();
    if (persisted) {
      setSessionId(persisted.sessionId);
      setCurrentStep(persisted.currentStep);
      setProgress(persisted.progress);
      setFeedback(persisted.feedback);
    } else {
      setSessionId("mock-session-1");
    }
  }, []);


  const handleNext = async () => {
    setLoading(true);
    try {
      // Simulate backend feedback
      const data = await fetchJSON("/api/rehearse-nurse");
      setFeedback(data.session.feedback);
      const updated = progress.map((step, idx) =>
        idx === currentStep ? { ...step, completed: true, feedback: data.session.feedback } : step
      );
      setProgress(updated);
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
        // Persist state
        saveNurseRehearseSession({
          sessionId,
          currentStep: currentStep + 1,
          progress: updated,
          feedback: data.session.feedback
        });
      } else {
        // Complete
        clearNurseRehearseSession();
        // Send result to backend
        const result = {
          sessionId,
          steps: updated,
          anomalies: [],
        };
        try {
          const backendResult = await fetchJSON("/api/rehearse-nurse/complete", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(result)
          });
          onComplete(backendResult);
        } catch (err) {
          // Fallback to local result if backend fails
          onComplete({
            ...result,
            verdict: "pass",
            summary: "Hand hygiene module completed successfully.",
            timestamp: new Date().toISOString(),
            backendError: true
          });
        }
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 rounded-lg p-6 w-full max-w-xl mx-auto">
      <h3 className="text-xl font-bold mb-4">Nurse Rehearse: Hand Hygiene</h3>
      <div className="flex flex-row gap-2 mb-4">
        {progress.map((step, idx) => (
          <div key={step.label} className={`flex-1 px-2 py-1 rounded text-xs text-center ${idx === currentStep ? "bg-blue-600 text-white" : step.completed ? "bg-green-500 text-white" : "bg-gray-700 text-gray-300"}`}>
            {step.label}
          </div>
        ))}
      </div>
      <div className="mb-4">
        <div className="text-lg font-semibold mb-2">Current Step:</div>
        <div className="text-base mb-2">{progress[currentStep].label}</div>
        {feedback && <div className="text-sm text-blue-300 mb-2">Feedback: {feedback}</div>}
      </div>
      <button
        className="btn btn-primary w-full mb-2"
        onClick={handleNext}
        disabled={loading || progress[currentStep].completed}
      >
        {currentStep < steps.length - 1 ? "Next Step" : "Finish Module"}
      </button>
      {error && <div className="text-red-400 text-xs mt-2">{error}</div>}
    </div>
  );
}
