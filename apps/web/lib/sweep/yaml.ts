import yaml from "yaml";
import type { Grid } from "./axes";
import { validate } from "./validate";

export function gridToYaml(g: Grid): string {
  return yaml.stringify({ version: 1, ...g }, { indent: 2 });
}

export function yamlToGrid(text: string): { grid?: Grid; errors: string[] } {
  try {
    const raw = yaml.parse(text);
    if (!raw || typeof raw !== "object") return { errors: ["empty document"] };
    const g: Grid = { axes: raw.axes, sampling: raw.sampling };
    const issues = validate(g).filter(i => i.severity === "error");
    if (issues.length) return { errors: issues.map(i => `${i.path}: ${i.message}`) };
    return { grid: g, errors: [] };
  } catch (e: any) {
    return { errors: [e.message] };
  }
}
