import React from "react";

type Props = {
  elapsedSeconds: number;
  currentStepLabel: string;
  progressLabel: string;
  totalSteps: number;
  activeStep: number;
};

export default function HandwashTimerPanel({ elapsedSeconds, currentStepLabel, progressLabel, totalSteps, activeStep }: Props) {
  const percent = Math.min(100, Math.round((activeStep / totalSteps) * 100));
  return (
    <div className="flex flex-col items-center bg-gray-50 border rounded p-3 mb-4">
      <div className="w-full h-2 bg-gray-200 rounded mb-2">
        <div
          className="h-2 bg-blue-500 rounded transition-all duration-500"
          style={{ width: `${percent}%` }}
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
      <div className="flex justify-between w-full text-xs text-gray-500 mb-1">
        <span>{progressLabel}</span>
        <span>{elapsedSeconds}s</span>
      </div>
      <div className="font-semibold">{currentStepLabel}</div>
    </div>
  );
}
