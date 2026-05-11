import type { AxisDef } from "./axes";
const W: Record<string, number> = { low: 0.5, med: 1.0, high: 2.0 };
export const importanceWeight = (a: AxisDef) => W[a.importance ?? "med"];
