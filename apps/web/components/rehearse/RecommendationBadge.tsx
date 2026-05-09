export function RecommendationBadge({ rec }: { rec: "GO" | "HOLD" | "NO-GO" }) {
  const styles = {
    "GO":    "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    "HOLD":  "bg-amber-500/15 text-amber-400 border-amber-500/30",
    "NO-GO": "bg-rose-500/15 text-rose-400 border-rose-500/30",
  }[rec];
  const icon = { "GO": "✅", "HOLD": "⚠️", "NO-GO": "⛔" }[rec];
  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-sm font-medium ${styles}`}>
      <span>{icon}</span>{rec}
    </span>
  );
}