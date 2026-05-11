import type { Grid } from "./axes";
import { enabledProduct } from "./validate";

export function estimateCells(grid: Grid): number {
  const seeds = grid.sampling.seeds_per_cell;
  if (grid.sampling.strategy === "grid") return enabledProduct(grid.axes) * seeds;
  const base = grid.sampling.base_runs * seeds;
  if (grid.sampling.strategy === "importance" && grid.sampling.importance_resample?.enabled) {
    return base + grid.sampling.importance_resample.extra_runs * seeds;
  }
  return base;
}

export function estimateCost(cells: number, episodeSeconds = 180, realtimeFactor = 5) {
  const gpuMin = (cells * episodeSeconds) / (60 * realtimeFactor);
  return {
    gpuMin,
    wallA100h: gpuMin / 60,
    wall8L4Min: gpuMin / 8,
    spotUsd: (gpuMin / 60) * 0.65,             // g6.xlarge spot reference
  };
}
