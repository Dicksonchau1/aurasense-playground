"use client";

import { useEffect, useState } from "react";
import { fetchJSON } from "../../utils/fetchJSON";

type RoboticsTelemetry = {
  status?: string;
  joints?: number[];
  battery?: number;
  mode?: string;
  updatedAt?: string;
  [key: string]: unknown;
};

type RoboticsResponse = {
  telemetry: RoboticsTelemetry;
};

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

export default function MockPanel() {
  const [telemetry, setTelemetry] = useState<RoboticsTelemetry | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;

    fetchJSON<RoboticsResponse>("/api/robotics")
      .then((data) => {
        if (!mounted) return;
        setTelemetry(data.telemetry);
        setError("");
      })
      .catch((e: unknown) => {
        if (!mounted) return;
        setError(getErrorMessage(e));
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <section className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
        <div className="text-sm text-zinc-400">Loading robotics telemetry...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="rounded-xl border border-red-900 bg-red-950/30 p-4">
        <h2 className="mb-2 text-sm font-semibold text-red-300">Mock Panel Error</h2>
        <p className="text-sm text-red-200">{error}</p>
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-zinc-100">Robotics Mock Panel</h2>
        <span className="rounded-full bg-zinc-800 px-2 py-1 text-xs text-zinc-300">
          {telemetry?.status ?? "unknown"}
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-3">
          <div className="mb-1 text-xs uppercase tracking-wide text-zinc-500">Mode</div>
          <div className="text-sm text-zinc-100">{telemetry?.mode ?? "-"}</div>
        </div>

        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-3">
          <div className="mb-1 text-xs uppercase tracking-wide text-zinc-500">Battery</div>
          <div className="text-sm text-zinc-100">
            {typeof telemetry?.battery === "number" ? `${telemetry.battery}%` : "-"}
          </div>
        </div>

        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-3 sm:col-span-2">
          <div className="mb-1 text-xs uppercase tracking-wide text-zinc-500">Joints</div>
          <div className="text-sm text-zinc-100">
            {Array.isArray(telemetry?.joints) && telemetry.joints.length > 0
              ? telemetry.joints.join(", ")
              : "-"}
          </div>
        </div>

        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-3 sm:col-span-2">
          <div className="mb-1 text-xs uppercase tracking-wide text-zinc-500">Updated</div>
          <div className="text-sm text-zinc-100">{telemetry?.updatedAt ?? "-"}</div>
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-zinc-800 bg-black/30 p-3">
        <div className="mb-2 text-xs uppercase tracking-wide text-zinc-500">Raw telemetry</div>
        <pre className="overflow-x-auto text-xs text-zinc-300">
          {JSON.stringify(telemetry, null, 2)}
        </pre>
      </div>
    </section>
  );
}
