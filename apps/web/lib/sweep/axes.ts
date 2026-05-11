export type AxisType = "discrete" | "continuous" | "categorical";

export type AxisBase = {
  id: string;                       // ^[a-z][a-z0-9_]{1,40}$
  label: string;                    // human label
  unit?: string;                    // "m/s", "°", "%", "mm/h", "m"
  type: AxisType;
  enabled: boolean;
  seed_count?: number;              // 1..16, overrides global seeds_per_cell
  importance?: "low" | "med" | "high";
};

export type DiscreteAxis    = AxisBase & { type: "discrete";    values: number[] };
export type ContinuousAxis  = AxisBase & { type: "continuous";  min: number; max: number; step: number; scale?: "linear"|"log" };
export type CategoricalAxis = AxisBase & { type: "categorical"; values: string[] };

export type AxisDef = DiscreteAxis | ContinuousAxis | CategoricalAxis;

export type Sampling = {
  strategy: "grid" | "lhs" | "importance";
  base_runs: number;            // 50..50000
  seeds_per_cell: number;       // 1..16
  importance_resample?: { enabled: boolean; extra_runs: number; target_axis?: string };
};

export type Grid = { axes: AxisDef[]; sampling: Sampling };
