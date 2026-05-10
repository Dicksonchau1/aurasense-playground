import { create } from "zustand";
import { persist } from "zustand/middleware";

export type EnvState = {
  timeOfDay: number;
  cloudCoverPct: number;
  lensFlare: boolean;
  autoExposure: boolean;
  windAvgMps: number;
  windDirDeg: number;
  gustFactor: number;
  turbulence: "perlin_low"|"perlin_med"|"perlin_high"|"windseer_kowloon";
  surfaceDrag: boolean;
  rainMmH: number;
  fogVisM: number | null;
  urbanMultipath: boolean;
  gpsDriftSigmaM: number;
};

const DEFAULTS: EnvState = {
  timeOfDay: 870,
  cloudCoverPct: 40,
  lensFlare: true,
  autoExposure: true,
  windAvgMps: 6.2,
  windDirDeg: 42,
  gustFactor: 1.5,
  turbulence: "perlin_med",
  surfaceDrag: true,
  rainMmH: 0,
  fogVisM: 800,
  urbanMultipath: true,
  gpsDriftSigmaM: 2.0,
};

export const useEnvSandbox = create(persist<{
  env: EnvState;
  set: (p: Partial<EnvState>) => void;
  reset: () => void;
  savePreset: () => Promise<void>;
}>((set, get) => ({
  env: DEFAULTS,
  set: (p) => set({ env: { ...get().env, ...p } }),
  reset: () => set({ env: DEFAULTS }),
  savePreset: async () => {
    await fetch("/api/env-presets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(get().env),
    });
  },
}), { name: "aurasense-env-sandbox" }));
