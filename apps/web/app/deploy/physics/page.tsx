"use client";
import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { PerlinControls } from "@/components/physics/PerlinControls";
import { WindSeerControls } from "@/components/physics/WindSeerControls";
import { WindFieldViewport } from "@/components/physics/WindFieldViewport";

export default function Page() {
  const [engine, setEngine] = useState<"perlin"|"windseer">("perlin");
  return (
    <div className="grid grid-cols-12 gap-5 p-6">
      <div className="col-span-4 space-y-5">
        <Card title="🌬 Wind Engine">
          {/* SegmentedControl for engine selection */}
          <div className="inline-flex bg-zinc-900 border border-zinc-800 rounded-lg p-0.5 mb-2">
            <button onClick={()=>setEngine("perlin")}
              className={`px-3 py-1.5 rounded-md text-sm transition ${engine==="perlin"?"bg-zinc-800 text-zinc-100":"text-zinc-500 hover:text-zinc-300"}`}>Perlin <span className="ml-2 text-[10px] text-zinc-500">v1 · default</span></button>
            <button onClick={()=>setEngine("windseer")}
              className={`px-3 py-1.5 rounded-md text-sm transition ${engine==="windseer"?"bg-zinc-800 text-zinc-100":"text-zinc-500 hover:text-zinc-300"}`}>WindSeer <span className="ml-2 text-[10px] text-zinc-500">β · Kowloon</span></button>
          </div>
          <p className="mt-3 text-xs text-zinc-500">
            Sweep API is identical for both. Switching the engine here changes the physics layer
            without touching gates, axes, or developer-surface CLI.
          </p>
        </Card>
        {engine === "perlin"   ? <PerlinControls/>   : <WindSeerControls/>}
      </div>
      <div className="col-span-8">
        <WindFieldViewport engine={engine}/>
      </div>
    </div>
  );
}
