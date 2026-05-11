// Placeholder for ValidationStrip. Implement as needed for validation and cost display.
export function ValidationStrip({ issues, cells, cost }: { issues: any[]; cells: number; cost: any }) {
  const hasError = issues.some(i => i.severity === "error");
  const hasWarn = issues.some(i => i.severity === "warn");
  return (
    <div className={`mt-2 text-xs px-3 py-2 rounded flex items-center gap-4 ${
      hasError ? "bg-rose-900/30 text-rose-200" : hasWarn ? "bg-amber-900/30 text-amber-200" : "bg-emerald-900/20 text-emerald-200"}`}
      role="status" aria-live="polite">
      <span>
        <b>{cells.toLocaleString()}</b> cells
        {cost && (
          <span className="ml-2">· <b>${cost.spotUsd?.toFixed(2) ?? 0}</b> USD</span>
        )}
      </span>
      {issues.length > 0 && (
        <span className="ml-2">
          {issues.map((i, idx) => (
            <span key={idx} className={i.severity === "error" ? "text-rose-300" : "text-amber-300"}>
              {i.severity === "error" ? "● " : "▲ "}{i.message}
              {idx < issues.length - 1 && <span className="mx-1">|</span>}
            </span>
          ))}
        </span>
      )}
    </div>
  );
}
