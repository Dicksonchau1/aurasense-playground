export function RehearseSkeleton({ progress, eta_s }: { progress: number; eta_s: number }) {
  return (
    <div className="space-y-3 animate-pulse">
      <div className="h-4 w-40 bg-zinc-800 rounded" />
      <div className="h-2 w-full bg-zinc-800 rounded overflow-hidden">
        <div className="h-full bg-sky-500 transition-all" style={{ width: `${progress * 100}%` }} />
      </div>
      <div className="text-xs text-zinc-500">Running rehearsal — ETA {Math.max(0, Math.round(eta_s))}s</div>
      <div className="grid grid-cols-2 gap-3">
        <div className="h-16 bg-zinc-800/60 rounded" />
        <div className="h-16 bg-zinc-800/60 rounded" />
      </div>
    </div>
  );
}