import Ajv, { ErrorObject } from "ajv";
import addFormats from "ajv-formats";
import axesSchema from "@/schemas/axes.schema.json";
import gridSchema from "@/schemas/grid.schema.json";
import type { Grid, AxisDef } from "./axes";

const ajv = addFormats(new Ajv({ allErrors: true, strict: false }));
ajv.addSchema(axesSchema, "axes.schema.json");
const validateGrid = ajv.compile(gridSchema);

export type GridIssue = { path: string; message: string; severity: "error"|"warn" };

export function validate(grid: Grid): GridIssue[] {
  const issues: GridIssue[] = [];

  if (!validateGrid(grid)) {
    for (const e of (validateGrid.errors ?? []) as ErrorObject[]) {
      issues.push({ path: e.instancePath || "/", message: e.message ?? "invalid", severity: "error" });
    }
  }

  // Semantic layer (beyond JSON Schema)
  const ids = new Set<string>();
  for (const a of grid.axes) {
    if (ids.has(a.id)) issues.push({ path: `/axes/${a.id}`, message: "duplicate axis id", severity: "error" });
    ids.add(a.id);

    if (a.type === "continuous") {
      if (a.min >= a.max) issues.push({ path: `/axes/${a.id}`, message: "min must be < max", severity: "error" });
      if (a.scale === "log" && a.min <= 0) issues.push({ path: `/axes/${a.id}`, message: "log scale requires min > 0", severity: "error" });
      const cells = Math.ceil((a.max - a.min) / a.step);
      if (cells > 64) issues.push({ path: `/axes/${a.id}`, message: `${cells} cells from step ${a.step}; consider larger step`, severity: "warn" });
      if (cells < 2)  issues.push({ path: `/axes/${a.id}`, message: "step too large for range", severity: "error" });
    }
    if (a.type === "discrete" && new Set(a.values).size !== a.values.length) {
      issues.push({ path: `/axes/${a.id}`, message: "duplicate values", severity: "error" });
    }
    if (a.enabled === false && a.importance === "high") {
      issues.push({ path: `/axes/${a.id}`, message: "high-importance axis is disabled", severity: "warn" });
    }
  }

  if (grid.axes.filter(a => a.enabled).length < 2) {
    issues.push({ path: "/axes", message: "at least 2 enabled axes required", severity: "error" });
  }

  // Cartesian product blow-up warning
  const product = enabledProduct(grid.axes);
  if (grid.sampling.strategy === "grid" && product > 50000) {
    issues.push({
      path: "/sampling",
      message: `${product.toLocaleString()} cells in full grid — switch to LHS`,
      severity: "warn",
    });
  }

  // Importance target must reference an enabled axis
  const ir = grid.sampling.importance_resample;
  if (ir?.enabled && ir.target_axis && !grid.axes.some(a => a.id === ir.target_axis && a.enabled)) {
    issues.push({ path: "/sampling/importance_resample/target_axis", message: "target_axis missing or disabled", severity: "error" });
  }

  return issues;
}

export function enabledProduct(axes: AxisDef[]): number {
  return axes.filter(a => a.enabled).reduce((p, a) => {
    if (a.type === "continuous") return p * Math.max(2, Math.ceil((a.max - a.min) / a.step));
    return p * a.values.length;
  }, 1);
}
