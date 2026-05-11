// Wires AxisEditor into the wizard. Placeholder for integration.
import { useState } from "react";
import { AxisEditor } from "@/components/sweep/AxisEditor";
import { DEFAULT_AXES, DEFAULT_SAMPLING } from "@/lib/sweep/defaults";

export default function SweepWizardPage() {
  const [axes, setAxes] = useState(DEFAULT_AXES);
  const [sampling, setSampling] = useState(DEFAULT_SAMPLING);
  return (
    <div className="p-8">
      <h2 className="text-xl font-bold mb-4">Scenario Sweep Wizard</h2>
      <AxisEditor axes={axes} sampling={sampling} onChange={setAxes} onSamplingChange={setSampling} />
    </div>
  );
}"use client";

import { useState, useMemo } from "react";
import { Card } from "@/components/ui/Card";
import { AxisEditor } from "@/components/sweep/AxisEditor";
import { GatePicker } from "@/components/sweep/GatePicker";
import { ComputeEstimator } from "@/components/sweep/ComputeEstimator";
import { PolicySelect } from "@/components/sweep/PolicySelect";
import { ScenarioSelect } from "@/components/sweep/ScenarioSelect";
import { RadioGroup } from "@/components/sweep/RadioGroup";

export default function Page() {
  const [policy, setPolicy] = useState("auravision-v3");
  const [scenario, setScenario] = useState("kowloon-rooftop");
  const [axes, setAxes] = useState([
    { name: "Time of day", type: "continuous", min: 0, max: 1439, step: 60, enabled: true },
    { name: "Cloud", type: "discrete", values: [0, 20, 40, 60, 80, 100], enabled: true },
    { name: "Wind avg", type: "continuous", min: 0, max: 20, step: 2, enabled: true },
    { name: "Wind dir", type: "continuous", min: 0, max: 359, step: 45, enabled: true },
    { name: "Gust", type: "continuous", min: 1, max: 2.5, step: 0.5, enabled: true },
    { name: "Turbulence", type: "categorical", values: ["perlin_low", "perlin_med", "perlin_high", "windseer_kowloon"], enabled: true },
    { name: "Rain", type: "continuous", min: 0, max: 50, step: 10, enabled: true },
    { name: "Fog", type: "continuous", min: 50, max: 5000, step: 500, enabled: true },
    { name: "GPS drift", type: "continuous", min: 0.1, max: 10, step: 2, enabled: true },
    { name: "Seed", type: "discrete", values: [1, 2, 3], enabled: true },
  ]);
  const [strategy, setStrategy] = useState<"grid"|"lhs"|"importance">("lhs");
  const [baseRuns, setBaseRuns] = useState(1000);
  const [gateProfile, setGateProfile] = useState("promote-to-fleet");
  const cellCount = useMemo(()=>1000,[axes,strategy,baseRuns]); // TODO: estimateCells

  return (
    <div className="grid grid-cols-12 gap-5 p-6">
      <div className="col-span-8 space-y-5">
        <Card title="1 · Target">
          <div className="grid grid-cols-2 gap-3">
            <PolicySelect value={policy} onChange={setPolicy}/>
            <ScenarioSelect value={scenario} onChange={setScenario}/>
          </div>
        </Card>

        <Card title="2 · Parameter Grid">
          <AxisEditor axes={axes} onChange={setAxes}/>
        </Card>

        <Card title="3 · Sampling">
          <RadioGroup
            value={strategy} onChange={setStrategy}
            options={[
              {v:"grid", l:"Full grid", hint:"exhaustive — quarterly only"},
              {v:"lhs",  l:"Latin Hypercube", hint:"recommended (CI default)"},
              {v:"importance", l:"Importance-resample", hint:"+500 around failure boundary"},
            ]}
          />
          <input type="range" min={100} max={5000} step={100} value={baseRuns} onChange={e=>setBaseRuns(+e.target.value)}/>
        </Card>

        <Card title="4 · Gates">
          <GatePicker profile={gateProfile} onChange={setGateProfile}/>
        </Card>
      </div>

      <aside className="col-span-4 space-y-5 sticky top-6 h-fit">
        <ComputeEstimator cells={cellCount} episodeSeconds={180} realtimeFactor={5} />
        <Card title="Launch">
          <button className="w-full py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-medium">
            ▶ Run Sweep
          </button>
        </Card>
      </aside>
    </div>
  );
}
