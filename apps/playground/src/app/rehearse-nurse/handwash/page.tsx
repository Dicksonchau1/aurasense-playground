
import React from "react";
import { HANDWASH_STEPS } from "./components/mockData";
import { useHandwashSession } from "./components/useHandwashSession";
import HandwashStepList from "./components/HandwashStepList";
import HandwashTimerPanel from "./components/HandwashTimerPanel";

import HandwashAnalyticsPanel, { saveAnalytics } from "./components/HandwashAnalyticsPanel";
import HandwashAnalyticsChart from "./components/HandwashAnalyticsChart";

export default function HandwashPage() {
  const session = useHandwashSession({ steps: HANDWASH_STEPS });

  React.useEffect(() => {
    if (session.sessionState === "completed" && session.summary) {
      saveAnalytics({ timestamp: Date.now(), summary: session.summary });
    }
  }, [session.sessionState, session.summary]);

  return (
    <main className="p-8 max-w-xl mx-auto text-center">
      <h2 className="text-2xl font-bold mb-4">Handwash Module</h2>
      <HandwashAnalyticsChart />
      <HandwashAnalyticsPanel />
      {session.sessionState === "ready" && (
        <>
          <p className="mb-4">Follow the 7-step hand hygiene protocol. Press Start to begin.</p>
          <button
            className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800"
            onClick={session.startSession}
            aria-label="Start handwash session"
          >
            Start Session
          </button>
        </>
      )}
      {session.sessionState === "active" && (
        <>
          <HandwashTimerPanel
            elapsedSeconds={session.elapsedSeconds}
            currentStepLabel={HANDWASH_STEPS[session.activeStepIndex]?.title}
            progressLabel={`Step ${session.activeStepIndex + 1} of ${HANDWASH_STEPS.length}`}
            totalSteps={HANDWASH_STEPS.length}
            activeStep={session.activeStepIndex + 1}
          />
          <HandwashStepList
            steps={HANDWASH_STEPS}
            activeIndex={session.activeStepIndex}
            completedCount={session.completedStepIds.length}
          />
          <div className="flex gap-2 mt-4 justify-center">
            <button
              className="px-3 py-2 rounded bg-green-700 text-white disabled:bg-gray-300"
              onClick={session.advanceStep}
              disabled={!session.canAdvance}
              aria-label="Next handwash step"
            >Next Step</button>
            <button
              className="px-3 py-2 rounded bg-gray-700 text-white disabled:bg-gray-300"
              onClick={session.resetSession}
              disabled={!session.canReset}
              aria-label="Reset session"
            >Reset</button>
            <button
              className="px-3 py-2 rounded bg-purple-700 text-white disabled:bg-gray-300"
              onClick={session.completeSession}
              disabled={!session.canComplete}
              aria-label="Complete session"
            >Complete</button>
          </div>
        </>
      )}
      {session.sessionState === "completed" && session.summary && (
        <div className="bg-white rounded shadow p-6 text-center mt-6">
          <h3 className="text-xl font-semibold mb-2">Session Complete</h3>
          <div className="mb-2">Steps completed: {session.summary.completedSteps} / {session.summary.totalSteps}</div>
          <div className="mb-2">Elapsed time: {session.summary.elapsedSeconds}s</div>
          <div className="mb-2 font-semibold">{session.summary.completionLabel}</div>
          <div className="mb-4 text-gray-600 text-sm">{session.summary.note}</div>
          <button
            className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 mr-2"
            onClick={session.resetSession}
            aria-label="Restart session"
          >Restart</button>
          <a href="/rehearse-nurse" className="text-blue-700 hover:underline text-sm ml-2">Back to Rehearse-Nurse</a>
        </div>
      )}
    </main>
  );
}
