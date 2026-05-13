"use client";

import { useMemo, useState } from "react";
import Card from "@/components/shell/Card";
import Button from "@/components/shell/Button";
import { validateWaypoints } from "@/lib/waypoints/service";

export interface Waypoint {
  id: string;
  lat: number;
  lng: number;
  alt_m: number;
  label?: string;
}

interface ValidationResult {
  waypointId: string;
  label?: string;
  valid: boolean;
  violations: string[];
}

interface ValidateSummary {
  total: number;
  passed: number;
  failed: number;
  score: number;
}

interface ValidateResponse {
  sessionId: string;
  timestamp: string;
  building: string;
  drone: string;
  results: ValidationResult[];
  summary: ValidateSummary;
}

const DEFAULT_WAYPOINTS: Waypoint[] = [
  { id: "wp_1", lat: 22.3193, lng: 114.1694, alt_m: 45, label: "Ascent" },
  { id: "wp_2", lat: 22.3195, lng: 114.1697, alt_m: 60, label: "NW sweep" },
  { id: "wp_3", lat: 22.3190, lng: 114.1700, alt_m: 60, label: "NE corner" },
  { id: "wp_4", lat: 22.3188, lng: 114.1696, alt_m: 55, label: "SE sweep" },
  { id: "wp_5", lat: 22.3192, lng: 114.1695, alt_m: 30, label: "Return" },
];

export default function WaypointEditor({
  building = "Tower A",
  drone = "Matrice 30T",
}: {
  building?: string;
  drone?: string;
}) {
  const [waypoints, setWaypoints] = useState<Waypoint[]>(DEFAULT_WAYPOINTS);
  const [result, setResult] = useState<ValidateResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const resultMap = useMemo(() => {
    if (!result) return new Map<string, ValidationResult>();
    return new Map(result.results.map((r) => [r.waypointId, r]));
  }, [result]);

  function updateField(
    id: string,
    field: keyof Waypoint,
    value: string
  ) {
    setWaypoints((prev) =>
      prev.map((wp) =>
        wp.id === id
          ? { ...wp, [field]: field === "label" ? value : parseFloat(value) || 0 }
          : wp
      )
    );
    setResult(null);
  }

  function addWaypoint() {
    const n = waypoints.length + 1;
    setWaypoints((prev) => [
      ...prev,
      {
        id: `wp_${Date.now()}`,
        lat: 22.319,
        lng: 114.169,
        alt_m: 50,
        label: `WP-${String(n).padStart(2, "0")}`,
      },
    ]);
    setResult(null);
  }

  function removeWaypoint(id: string) {
    setWaypoints((prev) => prev.filter((wp) => wp.id !== id));
    setResult(null);
  }

  async function runValidation() {
    setErr(null);
    setLoading(true);
    try {
      const res = await validateWaypoints(waypoints, { building, drone });
      setResult(res);
    } catch (e: any) {
      setErr(e?.message ?? "Validation failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex flex-wrap items-end gap-3 justify-between">
          <div className="flex flex-wrap items-end gap-3">
            <div>
              <div className="aura-label mb-1">Building</div>
              <div className="aura-field px-3 py-2 w-32 text-sm opacity-60 cursor-default">
                {building}
              </div>
            </div>
            <div>
              <div className="aura-label mb-1">Drone</div>
              <div className="aura-field px-3 py-2 w-40 text-sm opacity-60 cursor-default">
                {drone}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button type="button" onClick={addWaypoint} variant="ghost">
              + Add waypoint
            </Button>
            <Button type="button" onClick={runValidation} disabled={loading}>
              {loading ? "Validating…" : "Validate route"}
            </Button>
          </div>
        </div>
      </Card>

      {err && (
        <div
          className="aura-panel text-sm"
          style={{
            background: "rgba(185,28,28,0.08)",
            borderColor: "rgba(185,28,28,0.2)",
            color: "#7f1d1d",
          }}
        >
          {err}
        </div>
      )}

      {result && (
        <Card>
          <div className="flex flex-wrap gap-4 items-center mb-4">
            <div>
              <div className="aura-label">Route score</div>
              <div className="text-2xl font-semibold mt-1">{result.summary.score}%</div>
            </div>
            <div>
              <div className="aura-label">Passed</div>
              <div className="text-xl font-semibold mt-1 text-green-700 dark:text-green-400">
                {result.summary.passed}
              </div>
            </div>
            <div>
              <div className="aura-label">Failed</div>
              <div className="text-xl font-semibold mt-1 text-red-700 dark:text-red-400">
                {result.summary.failed}
              </div>
            </div>
            <div className="ml-auto text-xs aura-sub font-mono">{result.sessionId}</div>
          </div>
        </Card>
      )}

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border,#dcd9d5)]">
                <th className="text-left aura-label py-2 pr-3">Label</th>
                <th className="text-left aura-label py-2 pr-3">Lat</th>
                <th className="text-left aura-label py-2 pr-3">Lng</th>
                <th className="text-left aura-label py-2 pr-3">Alt (m)</th>
                <th className="text-left aura-label py-2 pr-3">Status</th>
                <th className="py-2" />
              </tr>
            </thead>
            <tbody>
              {waypoints.map((wp) => {
                const vr = resultMap.get(wp.id);
                const rowColor = !vr
                  ? ""
                  : vr.valid
                  ? "bg-green-500/5"
                  : "bg-red-500/5";
                return (
                  <tr
                    key={wp.id}
                    className={`border-b border-[var(--color-border,#dcd9d5)] ${rowColor}`}
                  >
                    <td className="py-2 pr-3">
                      <input
                        className="aura-field px-2 py-1 w-32 text-sm"
                        value={wp.label ?? ""}
                        onChange={(e) => updateField(wp.id, "label", e.target.value)}
                      />
                    </td>
                    <td className="py-2 pr-3">
                      <input
                        className="aura-field px-2 py-1 w-28 text-sm font-mono"
                        type="number"
                        step="0.0001"
                        value={wp.lat}
                        onChange={(e) => updateField(wp.id, "lat", e.target.value)}
                      />
                    </td>
                    <td className="py-2 pr-3">
                      <input
                        className="aura-field px-2 py-1 w-28 text-sm font-mono"
                        type="number"
                        step="0.0001"
                        value={wp.lng}
                        onChange={(e) => updateField(wp.id, "lng", e.target.value)}
                      />
                    </td>
                    <td className="py-2 pr-3">
                      <input
                        className="aura-field px-2 py-1 w-20 text-sm font-mono"
                        type="number"
                        step="1"
                        value={wp.alt_m}
                        onChange={(e) => updateField(wp.id, "alt_m", e.target.value)}
                      />
                    </td>
                    <td className="py-2 pr-3">
                      {!vr ? (
                        <span className="aura-sub text-xs">—</span>
                      ) : vr.valid ? (
                        <span className="text-xs font-medium text-green-700 dark:text-green-400">
                          ✓ Pass
                        </span>
                      ) : (
                        <div>
                          <span className="text-xs font-medium text-red-700 dark:text-red-400">
                            ✗ Fail
                          </span>
                          <ul className="mt-1 space-y-0.5">
                            {vr.violations.map((v) => (
                              <li key={v} className="text-xs text-red-600 dark:text-red-400">
                                {v}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </td>
                    <td className="py-2">
                      <button
                        onClick={() => removeWaypoint(wp.id)}
                        className="aura-sub text-xs hover:text-red-500 transition-colors"
                        aria-label="Remove waypoint"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
