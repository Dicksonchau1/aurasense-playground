"use client";
import { useState } from "react";
import { Card } from "@/components/ui/Card";
// import Editor from "@monaco-editor/react";

const DEFAULT = `version: 1\nname: promote-to-fleet\ngates:\n  - id: safety\n    metric: collisions_per_1k_runs\n    op: "=="\n    threshold: 0\n  - id: mission_success\n    metric: waypoints_hit_pct\n    op: ">="\n    threshold: 98\n  - id: perception\n    metric: mAP_drop_vs_clear_noon\n    op: "<="\n    threshold: 0.10\n  - id: control\n    metric: max_tilt_deg_at_12mps\n    op: "<="\n    threshold: 25\n  - id: robustness\n    metric: success_rate_worst_5pct_cells\n    op: ">="\n    threshold: 90\n  - id: sim_to_real\n    metric: replay_overlay_mae_pct\n    op: "<="\n    threshold: 15\n`;

export default function Page() {
  const [yaml, setYaml] = useState(DEFAULT);
  return (
    <div className="grid grid-cols-12 gap-5 p-6">
      <div className="col-span-7">
        <Card title="🛡 Gate profile · promote-to-fleet">
          {/* <Editor height="640px" language="yaml" value={yaml} onChange={(v)=>setYaml(v ?? "")} theme="vs-dark" options={{ minimap:{enabled:false}, fontSize:13 }} /> */}
          <textarea value={yaml} onChange={e=>setYaml(e.target.value)} className="w-full h-80 bg-zinc-900 text-zinc-100 p-2 rounded"/>
        </Card>
      </div>
      <div className="col-span-5 space-y-5">
        <Card title="Linter">
          <div>Linter placeholder</div>
        </Card>
        <Card title="Apply">
          <button className="w-full py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-sm">
            Save profile
          </button>
        </Card>
        <Card title="History">
          <div>History list placeholder</div>
        </Card>
      </div>
    </div>
  );
}
