"use client";


import { useState } from "react";
import dynamic from "next/dynamic";

const NurseRehearseSession = dynamic(() => import("../../components/rehearseNurse/Session"), { ssr: false });
const NurseRehearseResult = dynamic(() => import("../../components/rehearseNurse/Result"), { ssr: false });
const NurseRehearseInstructorSummary = dynamic(() => import("../../components/rehearseNurse/InstructorSummary"), { ssr: false });

export default function RehearseNursePage() {
  const [result, setResult] = useState<any | null>(null);
  const [showInstructor, setShowInstructor] = useState(false);

  const handleComplete = (res: any) => {
    setResult(res);
  };
  const handleRetry = () => {
    setResult(null);
    setShowInstructor(false);
  };
  const handleReturn = () => {
    window.location.href = "/playground";
  };
  const handleInstructor = () => {
    setShowInstructor(true);
  };
  const handleReturnToResult = () => {
    setShowInstructor(false);
  };

  return (
    <main className="p-4 min-h-screen flex flex-col items-center justify-center">
      <h2 className="text-2xl font-bold mb-4">Nurse Rehearse: Hand Hygiene</h2>
      <div className="mb-4 w-full max-w-xl">
        {!result && !showInstructor && (
          <NurseRehearseSession onComplete={handleComplete} />
        )}
        {result && !showInstructor && (
          <NurseRehearseResult
            result={result}
            onRetry={handleRetry}
            onReturn={handleReturn}
            onInstructor={handleInstructor}
          />
        )}
        {result && showInstructor && (
          <NurseRehearseInstructorSummary
            result={result}
            onReturn={handleReturnToResult}
          />
        )}
      </div>
      <div className="mt-8">
        <a href="/playground" className="text-blue-400 underline text-sm">&larr; Back to Playground</a>
      </div>
    </main>
  );
}
