import type { AxisDef, Sampling } from "./axes";

export const DEFAULT_AXES: AxisDef[] = [
  { id:"time_of_day",       label:"Time of day",        unit:"h",   type:"continuous",  enabled:true,  min:6, max:19, step:1, scale:"linear", importance:"med" },
  { id:"cloud_cover_pct",   label:"Cloud cover",        unit:"%",   type:"discrete",    enabled:true,  values:[0,40,80], importance:"low" },
  { id:"wind_avg_mps",      label:"Wind avg speed",     unit:"m/s", type:"discrete",    enabled:true,  values:[0,3,6,9,12], importance:"high" },
  { id:"wind_direction_deg",label:"Wind direction",     unit:"°",   type:"discrete",    enabled:true,  values:[0,45,90,135,180,225,270,315], importance:"med" },
  { id:"gust_factor",       label:"Gust factor",        unit:"×",   type:"discrete",    enabled:true,  values:[1.0,1.5,2.0], importance:"high" },
  { id:"turbulence",        label:"Turbulence",                       type:"categorical", enabled:true,  values:["perlin_low","perlin_med","perlin_high"], importance:"med" },
  { id:"rain_mm_per_h",     label:"Rain rate",          unit:"mm/h",type:"discrete",    enabled:true,  values:[0,5,20], importance:"med" },
  { id:"fog_visibility_m",  label:"Fog visibility",     unit:"m",   type:"discrete",    enabled:true,  values:[100000,800,200], importance:"low" },
  { id:"gps_drift_sigma_m", label:"GPS drift σ",        unit:"m",   type:"continuous",  enabled:true,  min:0.5, max:5.0, step:0.5, scale:"linear", importance:"med" },
];

export const DEFAULT_SAMPLING: Sampling = {
  strategy: "lhs",
  base_runs: 1000,
  seeds_per_cell: 3,
  importance_resample: { enabled: true, extra_runs: 500, target_axis: "wind_avg_mps" },
};
