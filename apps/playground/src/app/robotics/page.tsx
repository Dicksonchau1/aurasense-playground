"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import Link from "next/link";
import Card from "../../components/shell/Card";

type Health = {
  status?: string;
  version?: string;
  active_slots?: number;
  max_slots?: number;
  free_capacity?: number;
  aiortc_available?: boolean;
};

export default function RoboticsPage() {
  const [edge, setEdge] = useState<Health | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const url =
      process.env.NEXT_PUBLIC_EDGE_URL ||
      process.env.NEXT_PUBLIC_NEPA_API_URL ||
      "http://76.13.177.39:8080";

    fetch(url + "/healthz")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setEdge(data))
      .catch(() => setEdge(null))
      .finally(() => setLoading(false));
  }, []);

  const ok = !!edge && edge.status === "ok";

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="aura-h1">Robotics</h1>
          <p className="aura-sub mt-1">
            NEPA edge runtime under your actuation layer. Physics is the dynamic
            calculation per timestamp; language only expresses.
          </p>
        </div>
        <span className={"aura-badge " + (ok ? "aura-badge-success" : "aura-badge-warn")}>
          {loading ? "Checking edge..." : ok ? "Edge online" : "Edge unreachable"}
        </span>
      </header>

      <div className="grid gap-5 md:grid-cols-3">
        <Card title="Runtime">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="aura-sub">Service</span>
              <span className="font-semibold">aurasense-nepa</span>
            </div>
            <div className="flex justify-between">
              <span className="aura-sub">Version</span>
              <span className="font-mono">{edge?.version || "-"}</span>
            </div>
            <div className="flex justify-between">
              <span className="aura-sub">Status</span>
              <span className="font-semibold">{edge?.status || "unknown"}</span>
            </div>
          </div>
        </Card>

        <Card title="Capacity">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="aura-sub">Active slots</span>
              <span className="font-mono">{edge?.active_slots ?? "-"}</span>
            </div>
            <div className="flex justify-between">
              <span className="aura-sub">Max slots</span>
              <span className="font-mono">{edge?.max_slots ?? "-"}</span>
            </div>
            <div className="flex justify-between">
              <span className="aura-sub">Free capacity</span>
              <span className="font-mono">{edge?.free_capacity ?? "-"}</span>
            </div>
          </div>
        </Card>

        <Card title="Transport">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="aura-sub">aiortc</span>
              <span className="font-semibold">{edge?.aiortc_available ? "available" : "off"}</span>
            </div>
            <div className="flex justify-between">
              <span className="aura-sub">Latency contract</span>
              <span className="font-semibold">per-tick</span>
            </div>
          </div>
        </Card>
      </div>

      <Card title="Integration">
        <p className="aura-sub leading-relaxed">
          NEPA slots beneath your actuation layer with zero merge friction.
          Physics and neuro-dynamics are co-native at the timestamp.
        </p>
        <div className="mt-4 flex gap-2">
          <Link href="/rehearse-3d" className="aura-btn aura-btn-primary">See it live</Link>
          <Link href="/attas" className="aura-btn aura-btn-ghost">Open ATTAS</Link>
        </div>
      </Card>
    </div>
  );
}
