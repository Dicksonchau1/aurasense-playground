import { Card } from "@/components/ui/Card";

export function FailureGallery({ cells }: { cells: any[] }) {
  if (!cells.length) return null;
  return (
    <Card title={`Failure gallery · ${cells.length}`}>
      <div className="grid grid-cols-4 gap-3">
        {cells.slice(0, 24).map((c) => (
          <a key={c.cell_id} href={c.replay_uri ?? "#"} target="_blank"
             className="rounded-lg overflow-hidden border border-zinc-800 hover:border-rose-500/60 group">
            <div className="aspect-video bg-zinc-900 relative">
              {c.thumbnail && <img src={c.thumbnail} className="object-cover w-full h-full opacity-80 group-hover:opacity-100"/>
              }
              <span className="absolute top-1 right-1 text-[10px] px-1.5 py-0.5 rounded bg-rose-500/80 text-white">{c.fail_tag}</span>
            </div>
            <div className="p-2 text-[11px] font-mono text-zinc-400">
              wind {c.params.wind_avg_mps}m/s · {c.params.time_of_day} · gust ×{c.params.gust_factor}
            </div>
          </a>
        ))}
      </div>
      {cells.length > 24 && (
        <button className="mt-3 text-sm text-sky-400 hover:underline">View all {cells.length} →</button>
      )}
    </Card>
  );
}
