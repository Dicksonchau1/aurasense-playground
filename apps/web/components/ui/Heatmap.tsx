import * as Plot from "@observablehq/plot";
import { useEffect, useRef } from "react";

export function Heatmap({ data, x, y, fill, fmt = ".2f" }: {
  data: any[]; x: string; y: string; fill: string; fmt?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const chart = Plot.plot({
      marks: [Plot.cell(data, { x, y, fill, inset: 0.5, tip: true })],
      color: { scheme: "viridis", legend: true, label: fill },
      x: { label: x }, y: { label: y },
      height: 280, marginLeft: 70, marginBottom: 50,
      style: { background: "transparent", color: "#a1a1aa", fontSize: 11 },
    });
    ref.current.replaceChildren(chart);
    return () => chart.remove();
  }, [data, x, y, fill]);
  return <div ref={ref} />;
}
