"use client";
import { useEnvSandbox } from "@/lib/store/useEnvSandbox";
import { Slider, Select, Switch, Group } from "@/components/ui/inputs";
import { Card } from "@/components/ui/Card";

export function EnvironmentSandbox() {
  const { env, set, reset, savePreset } = useEnvSandbox();
  return (
    <Card title="🌦 Environment Sandbox" right={
      <button onClick={reset} className="hover:text-sky-400">reset</button>}>
      <Group label="☀ Sun & Sky">
        <Slider label="Time of day" value={env.timeOfDay} min={0} max={1439} step={15}
                fmt={mins => `${String(Math.floor(mins/60)).padStart(2,"0")}:${String(mins%60).padStart(2,"0")}`}
                onChange={v=>set({timeOfDay:v})}/>
        <Slider label="Cloud cover" value={env.cloudCoverPct} min={0} max={100} unit="%" onChange={v=>set({cloudCoverPct:v})}/>
        <Switch label="Lens flare" checked={env.lensFlare} onChange={v=>set({lensFlare:v})}/>
        <Switch label="Auto-exposure" checked={env.autoExposure} onChange={v=>set({autoExposure:v})}/>
      </Group>

      <Group label="💨 Wind Field">
        <Slider label="Avg speed" value={env.windAvgMps} min={0} max={20} step={0.1} unit="m/s" onChange={v=>set({windAvgMps:v})}/>
        <Slider label="Direction" value={env.windDirDeg} min={0} max={359} unit="°" onChange={v=>set({windDirDeg:v})}/>
        <Slider label="Gust factor" value={env.gustFactor} min={1} max={2.5} step={0.1} unit="×" onChange={v=>set({gustFactor:v})}/>
        <Select label="Turbulence" value={env.turbulence} options={[
          {v:"perlin_low",l:"Perlin low"},{v:"perlin_med",l:"Perlin med"},{v:"perlin_high",l:"Perlin high"},
          {v:"windseer_kowloon",l:"WindSeer · Kowloon (β)"}
        ]} onChange={v=>set({turbulence:v as any})}/>
        <Switch label="Surface drag (per-face)" checked={env.surfaceDrag} onChange={v=>set({surfaceDrag:v})}/>
      </Group>

      <Group label="🌧 Weather">
        <Slider label="Rain" value={env.rainMmH} min={0} max={50} unit="mm/h" onChange={v=>set({rainMmH:v})}/>
        <Slider label="Fog vis." value={env.fogVisM ?? 99999} min={50} max={5000} unit="m" onChange={v=>set({fogVisM:v})}/>
      </Group>

      <Group label="📡 RF / GPS">
        <Switch label="Urban multipath" checked={env.urbanMultipath} onChange={v=>set({urbanMultipath:v})}/>
        <Slider label="GPS drift σ" value={env.gpsDriftSigmaM} min={0.1} max={10} step={0.1} unit="m" onChange={v=>set({gpsDriftSigmaM:v})}/>
      </Group>

      <button onClick={savePreset} className="mt-3 w-full py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-sm">
        Save Preset
      </button>
    </Card>
  );
}
