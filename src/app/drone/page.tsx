import { PlaygroundShell } from "@/components/playground-shell";
import { LaneToggle } from "@/components/lane-toggle";
import { Button } from "@/components/ui/button";
import { COPY } from "@/lib/copy";

export const metadata = {
  title: "Drone · NEPA Playground",
  description: COPY.drone.subhead,
};

export default function DronePage() {
  return (
    <PlaygroundShell
      breadcrumb={COPY.drone.breadcrumb}
      headline={COPY.drone.headline}
      subhead={COPY.drone.subhead}
      privacyNote={COPY.drone.privacy}
      rightRail={
        <div className="space-y-4">
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
            <div className="text-[10px] uppercase tracking-widest text-zinc-500">
              Lanes
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <LaneToggle label="Detection" />
              <LaneToggle label="IMU" locked note="V1" />
              <LaneToggle label="Polygon zones" locked note="V1" />
              <LaneToggle label="LiDAR" locked note="V2" />
              <LaneToggle label="Multi-stream" locked note="Enterprise" />
              <LaneToggle label="MBIS export" locked note="Enterprise" />
            </div>
          </div>
        </div>
      }
    >
      <div className="space-y-5">
        <div className="aspect-video w-full overflow-hidden rounded-2xl border border-dashed border-white/10 bg-black">
          <div className="grid h-full place-items-center text-center">
            <div>
              <div className="text-[10px] uppercase tracking-widest text-zinc-500">
                Webcam · YOLOv8n
              </div>
              <div className="mt-2 max-w-md px-6 text-sm text-zinc-400">
                {COPY.drone.placeholder}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button size="lg" disabled>
            {COPY.drone.startCta}
            <kbd className="ml-1 rounded bg-black/30 px-1.5 py-0.5 text-[10px] font-mono">
              {COPY.drone.startHint}
            </kbd>
          </Button>
          <span className="text-xs text-zinc-500">Webcam + YOLO arrives in V0.5.</span>
        </div>
      </div>
    </PlaygroundShell>
  );
}
