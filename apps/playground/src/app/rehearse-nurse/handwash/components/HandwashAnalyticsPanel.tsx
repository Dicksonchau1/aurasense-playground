"use client";
import React, { useEffect, useState } from "react";
import { HandwashAnalytics } from "./types";

function getAnalytics(): HandwashAnalytics[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("handwash_analytics");
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveAnalytics(summary: HandwashAnalytics) {
  if (typeof window === "undefined") return;
  const prev = getAnalytics();
  localStorage.setItem("handwash_analytics", JSON.stringify([...prev, summary]));
}

export default function HandwashAnalyticsPanel() {
  const [analytics, setAnalytics] = useState<HandwashAnalytics[]>([]);

  useEffect(() => {
    setAnalytics(getAnalytics());
  }, []);

  if (!analytics.length) return null;

  return (
    <div className="my-6 p-4 bg-gray-50 border rounded">
      <h3 className="font-semibold mb-2 text-sm">Past Handwash Sessions</h3>
      <ul className="text-xs text-gray-700">
        {analytics.slice(-5).reverse().map((a, i) => (
          <li key={i} className="mb-1">
            {new Date(a.timestamp).toLocaleString()}: {a.summary.completionLabel} ({a.summary.elapsedSeconds}s, {a.summary.completedSteps}/{a.summary.totalSteps} steps)
          </li>
        ))}
      </ul>
    </div>
  );
}
