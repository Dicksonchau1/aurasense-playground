export type HandwashStep = {
  id: string;
  title: string;
  instruction: string;
  targetSeconds: number;
};

export type HandwashSessionState = "ready" | "active" | "completed";

export type HandwashSummary = {
  completedSteps: number;
  totalSteps: number;
  elapsedSeconds: number;
  completionLabel: string;
  note: string;
};

export type HandwashAnalytics = {
  timestamp: number;
  summary: HandwashSummary;
};
