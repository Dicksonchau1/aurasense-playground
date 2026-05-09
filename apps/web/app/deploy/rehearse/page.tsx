import { RehearsePanel } from "@/components/rehearse/RehearsePanel";

export default function Page() {
  // env values come from the live Environment Sandbox panel (zustand/jotai store in real app)
  const env = {
    time_of_day: "14:30", date: "2026-05-09",
    cloud_cover_pct: 40, wind_avg_mps: 6.2, wind_direction_deg: 42,
    gust_factor: 1.5, turbulence: "perlin_med" as const,
    rain_mm_per_h: 0, fog_visibility_m: 800, gps_drift_sigma_m: 2.0,
  };
  return (
    <div className="max-w-3xl mx-auto p-6">
      <RehearsePanel missionId="kln-tower-a" policy="auravision-v3" env={env} />
    </div>
  );
}