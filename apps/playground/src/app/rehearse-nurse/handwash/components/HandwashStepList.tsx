import React from "react";
import { HandwashStep } from "./types";

type Props = {
  steps: HandwashStep[];
  activeIndex: number;
  completedCount: number;
  activeStepId?: string;
};

export default function HandwashStepList({ steps, activeIndex, completedCount }: Props) {
  return (
    <ol className="flex flex-col gap-2 my-6" aria-label="Handwash steps">
      {steps.map((step, idx) => {
        let statusClass = "";
        if (idx < completedCount) statusClass = "bg-green-100 border-green-500 text-green-800";
        else if (idx === activeIndex) statusClass = "bg-blue-100 border-blue-500 text-blue-800 animate-pulse";
        else statusClass = "bg-gray-100 border-gray-300 text-gray-500";
        return (
          <li
            key={step.id}
            className={`border-l-4 p-3 mb-1 rounded ${statusClass}`}
            aria-current={idx === activeIndex ? "step" : undefined}
            tabIndex={0}
            aria-label={`Step ${idx + 1}: ${step.title}. ${step.instruction}`}
          >
            <div className="font-semibold">Step {idx + 1}: {step.title}</div>
            <div className="text-sm text-gray-700">{step.instruction}</div>
          </li>
        );
      })}
    </ol>
  );
}
