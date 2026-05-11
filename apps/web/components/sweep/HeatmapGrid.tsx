import { Heatmap } from "@/components/ui/Heatmap";
import type { CellResult } from "@/lib/sweep/events";

export function HeatmapGrid({ cells }: { cells: CellResult[] }) {
  const data = cells.map(c => ({
    wind_avg_mps: c.params.wind_avg_mps,
    time_of_day:  c.params.time_of_day,
    gust_factor:  c.params.gust_factor,
    fog_visibility_m: c.params.fog_visibility_m,
    rain_mm_per_h: c.params.rain_mm_per_h,
    gps_drift_sigma_m: c.params.gps_drift_sigma_m,
    mAP: c.metrics.mAP,
    max_tilt_deg: c.metrics.max_tilt_deg,
    success: c.passed ? 1 : 0,
    waypoints_hit_pct: c.metrics.waypoints_hit_pct,
  }));
  return (
    <div className="grid grid-cols-2 gap-4">
      <Heatmap data={data} x="wind_avg_mps"      y="time_of_day"       fill="mAP"/>
      <Heatmap data={data} x="wind_avg_mps"      y="gust_factor"       fill="max_tilt_deg"/>
      <Heatmap data={data} x="fog_visibility_m"  y="rain_mm_per_h"     fill="success"/>
      <Heatmap data={data} x="gps_drift_sigma_m" y="wind_avg_mps"      fill="waypoints_hit_pct"/>
    </div>
  );
}
