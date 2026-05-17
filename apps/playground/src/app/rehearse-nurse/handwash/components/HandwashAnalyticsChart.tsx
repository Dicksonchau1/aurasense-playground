"use client";
import React, { useMemo, useState } from "react";
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

const COLORS = {
  Complete: "#22c55e",
  "Completed too quickly": "#facc15",
  Incomplete: "#ef4444",
};

export default function HandwashAnalyticsChart() {
  const [filter, setFilter] = useState<string | null>(null);
  const analytics = useMemo(() => getAnalytics(), []);
  const filtered = filter ? analytics.filter(a => a.summary.completionLabel === filter) : analytics;
  const data = filtered.slice(-10);
  const maxTime = Math.max(...data.map(a => a.summary.elapsedSeconds), 20);

  return (
    <div className="my-6 p-4 bg-gray-50 border rounded">
      <div className="flex items-center mb-2">
        <h3 className="font-semibold text-sm flex-1">Session Completion Times</h3>
        <select
          className="text-xs border rounded px-1 py-0.5"
          value={filter || ""}
          onChange={e => setFilter(e.target.value || null)}
          aria-label="Filter by completion label"
        >
          <option value="">All</option>
          <option value="Complete">Complete</option>
          <option value="Completed too quickly">Completed too quickly</option>
          <option value="Incomplete">Incomplete</option>
        </select>
      </div>
      {data.length === 0 ? (
        <div className="text-xs text-gray-500">No sessions to display.</div>
      ) : (
        <svg width="100%" height="120" viewBox={`0 0 ${data.length * 32} 100`}>
          {data.map((a, i) => {
            const h = (a.summary.elapsedSeconds / maxTime) * 80;
            const color = COLORS[a.summary.completionLabel] || "#3b82f6";
            return (
              <g key={i}>
                <rect
                  x={i * 32 + 8}
                  y={100 - h}
                  width={16}
                  height={h}
                  fill={color}
                  rx={3}
                />
                <text
                  x={i * 32 + 16}
                  y={100 - h - 4}
                  fontSize={8}
                  textAnchor="middle"
                  fill="#555"
                >
                  {a.summary.elapsedSeconds}s
                </text>
                <text
                  x={i * 32 + 16}
                  y={104}
                  fontSize={8}
                  textAnchor="middle"
                  fill="#555"
                >
                  {new Date(a.timestamp).toLocaleDateString()}
                </text>
              </g>
            );
          })}
        </svg>
      )}
    </div>
  );
}
