"use client";
import { useReducer, useEffect } from "react";
import { HandwashStep, HandwashSessionState, HandwashSummary } from "./types";

interface UseHandwashSessionProps {
  steps: HandwashStep[];
}

type State = {
  sessionState: HandwashSessionState;
  activeStepIndex: number;
  completedStepIds: string[];
  elapsedSeconds: number;
  summary: HandwashSummary | null;
};

type Action =
  | { type: "START" }
  | { type: "ADVANCE" }
  | { type: "RESET" }
  | { type: "COMPLETE" }
  | { type: "TICK" };

function reducer(state: State, action: Action & { steps: HandwashStep[] }): State {
  switch (action.type) {
    case "START":
      return { ...state, sessionState: "active", elapsedSeconds: 0, completedStepIds: [], activeStepIndex: 0, summary: null };
    case "ADVANCE": {
      if (state.sessionState !== "active") return state;
      const nextIdx = state.activeStepIndex + 1;
      if (nextIdx < action.steps.length) {
        return { ...state, activeStepIndex: nextIdx, completedStepIds: [...state.completedStepIds, action.steps[state.activeStepIndex].id] };
      } else {
        // All steps completed
        return reducer({ ...state, completedStepIds: [...state.completedStepIds, action.steps[state.activeStepIndex].id] }, { ...action, type: "COMPLETE" });
      }
    }
    case "RESET":
      return { ...state, sessionState: "ready", elapsedSeconds: 0, completedStepIds: [], activeStepIndex: 0, summary: null };
    case "COMPLETE": {
      const completedSteps = state.completedStepIds.length;
      const totalSteps = action.steps.length;
      const elapsedSeconds = state.elapsedSeconds;
      let completionLabel = "Incomplete";
      let note = "Not all steps were completed.";
      if (completedSteps === totalSteps) {
        if (elapsedSeconds >= 20) {
          completionLabel = "Complete";
          note = "All steps completed with acceptable minimum duration.";
        } else {
          completionLabel = "Completed too quickly";
          note = "Sequence completed, but total rubbing time was below the recommended minimum.";
        }
      }
      return {
        ...state,
        sessionState: "completed",
        summary: {
          completedSteps,
          totalSteps,
          elapsedSeconds,
          completionLabel,
          note,
        },
      };
    }
    case "TICK":
      if (state.sessionState !== "active") return state;
      return { ...state, elapsedSeconds: state.elapsedSeconds + 1 };
    default:
      return state;
  }
}

export function useHandwashSession({ steps }: UseHandwashSessionProps) {
  const [state, dispatch] = useReducer(reducer, {
    sessionState: "ready",
    activeStepIndex: 0,
    completedStepIds: [],
    elapsedSeconds: 0,
    summary: null,
  });

  // Timer effect
  useEffect(() => {
    if (state.sessionState !== "active") return;
    const interval = setInterval(() => dispatch({ type: "TICK", steps }), 1000);
    return () => clearInterval(interval);
  }, [state.sessionState, steps]);

  return {
    sessionState: state.sessionState,
    activeStepIndex: state.activeStepIndex,
    completedStepIds: state.completedStepIds,
    elapsedSeconds: state.elapsedSeconds,
    summary: state.summary,
    canStart: state.sessionState === "ready",
    canAdvance: state.sessionState === "active" && state.activeStepIndex < steps.length,
    canReset: state.sessionState !== "ready",
    canComplete: state.sessionState === "active" && (state.activeStepIndex === steps.length - 1),
    startSession: () => dispatch({ type: "START", steps }),
    advanceStep: () => dispatch({ type: "ADVANCE", steps }),
    resetSession: () => dispatch({ type: "RESET", steps }),
    completeSession: () => dispatch({ type: "COMPLETE", steps }),
  };
}
