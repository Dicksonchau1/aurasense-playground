// Live STDP visualization components
import React from "react";

export interface WeightDelta {
  ts: string;
  delta: number;
  pre: number;
  post: number;
}

export interface ReadoutWeightsProps {
  weights: number[];
}

export function ReadoutWeights({ weights }: ReadoutWeightsProps) {
  return (
    <div className="flex gap-1">
      {weights.map((w, i) => (
        <div key={i} className="h-4 w-4" style={{ background: `rgba(255,200,0,${w})` }} />
      ))}
    </div>
  );
}

export interface WeightDeltaChartProps {
  deltas: WeightDelta[];
}

export function WeightDeltaChart({ deltas }: WeightDeltaChartProps) {
  return (
    <svg width={200} height={40}>
      {deltas.map((d, i) => (
        <rect
          key={i}
          x={i * 4}
          y={20 - d.delta * 20}
          width={3}
          height={d.delta * 20 + 20}
          fill={d.delta > 0 ? "#4ade80" : "#f87171"}
        />
      ))}
    </svg>
  );
}
