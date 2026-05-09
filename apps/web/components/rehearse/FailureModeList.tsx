import type { FailureMode } from "@/lib/rehearse/types";

const LABELS: Record<string, string> = {
  waypoint_miss: "Waypoint miss",
  collision: "Collision",
  detector_dropout: "Detector dropout",
  attitude_excursion: "Attitude excursion",
  gps_loss: "GPS loss",
};

export function FailureModeList({ modes }: { modes: FailureMode[] }) {
  if (!modes.length)
    return <div className="text-sm text-emerald-400">No failures observed.</div>;
  return (
    <ul className="space-y-1 text-sm">
      {modes.map((m) => (
        <li key={m.tag} className="flex gap-2 items-center">
          <span className="text-zinc-400 w-8 text-right">{m.count}×</span>
          <span className="text-zinc-200">{LABELS[m.tag] ?? m.tag}</span>
          {m.note && <span className="text-zinc-500">— {m.note}</span>}
        </li>
      ))}
    </ul>
  );
}