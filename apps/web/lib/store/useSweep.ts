import { create } from "zustand";

type SweepState = {
  policy: string; scenario: string;
  axes: any[]; strategy: "grid"|"lhs"|"importance"; baseRuns: number;
  gateProfile: string;
  liveRunId: string | null;
};

export const useSweep = create<SweepState & {
  set: (p: Partial<SweepState>) => void;
  launch: () => Promise<string>;
}>((set, get) => ({
  policy: "auravision-v3", scenario: "kowloon-rooftop",
  axes: [], strategy: "lhs", baseRuns: 1000,
  gateProfile: "promote-to-fleet", liveRunId: null,
  set: (p) => set(p),
  launch: async () => {
    const r = await fetch("/api/sweeps", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        policy: get().policy, scenario: get().scenario,
        axes: get().axes, strategy: get().strategy,
        base_runs: get().baseRuns, gate_profile: get().gateProfile,
      }),
    }).then(r => r.json());
    set({ liveRunId: r.run_id });
    return r.run_id;
  },
}));
