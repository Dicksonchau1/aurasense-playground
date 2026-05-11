import { Card } from "@/components/ui/Card";
import { Heatmap } from "@/components/ui/Heatmap";
import { GatesPanel } from "@/components/sweep/GatesPanel";
import { FailureGallery } from "@/components/sweep/FailureGallery";
import { PromoteBar } from "@/components/sweep/PromoteBar";
import { ProgressStrip } from "@/components/sweep/ProgressStrip";

export default async function Page({ params }: { params: { runId: string }}) {
  // const run = await fetch(`${api}/sweeps/${params.runId}`).then(r=>r.json());
  const run = { policy: "auravision-v3", scenario: "kowloon-rooftop", run_id: params.runId, runs_done: 0, runs_total: 1000, state: "pending", gates: {
    safety: { value: 0, op: "==", threshold: 0, passed: true },
    mission_success: { value: 99, op: ">=", threshold: 98, passed: true },
    perception: { value: 0.09, op: "<=", threshold: 0.10, passed: true },
    control: { value: 24, op: "<=", threshold: 25, passed: true },
    robustness: { value: 91, op: ">=", threshold: 90, passed: true },
    sim_to_real: { value: 14, op: "<=", threshold: 15, passed: true },
  }, cells: [
    { cell_id: "1", passed: false, fail_tag: "tilt", thumbnail: null, replay_uri: "#", params: { wind_avg_mps: 12, time_of_day: 600, gust_factor: 2 } },
    { cell_id: "2", passed: false, fail_tag: "waypoint", thumbnail: null, replay_uri: "#", params: { wind_avg_mps: 14, time_of_day: 900, gust_factor: 2.5 } },
  ] };

  return (
    <div className="p-6 space-y-5">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-zinc-100">Sweep · {run.policy}</h1>
          <p className="text-sm text-zinc-500">{run.scenario} · {run.run_id}</p>
        </div>
        <ProgressStrip done={run.runs_done} total={run.runs_total} state={run.state}/>
      </header>

      <GatesPanel gates={run.gates} />

      <div className="grid grid-cols-2 gap-5">
        <Card title="Wind × Time-of-day → mAP">
          <Heatmap data={run.cells} x="wind_avg_mps" y="time_of_day" fill="mAP" />
        </Card>
        <Card title="Wind × Gust → Max tilt (°)">
          <Heatmap data={run.cells} x="wind_avg_mps" y="gust_factor" fill="max_tilt_deg" />
        </Card>
        <Card title="Fog × Rain → Mission success rate">
          <Heatmap data={run.cells} x="fog_visibility_m" y="rain_mm_per_h" fill="success_rate" />
        </Card>
        <Card title="GPS drift × Wind → Waypoints hit %">
          <Heatmap data={run.cells} x="gps_drift_sigma_m" y="wind_avg_mps" fill="waypoints_hit_pct" />
        </Card>
      </div>

      <FailureGallery cells={run.cells.filter((c: any) => !c.passed)} />

      <PromoteBar runId={run.run_id} canPromote={true} />
    </div>
  );
}
