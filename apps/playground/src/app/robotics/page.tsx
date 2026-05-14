export const dynamic = "force-dynamic";

import Card from "../../components/shell/Card";

async function fetchEdgeStatus() {
  try {
    const url = process.env.NEPA_API_URL || "http://76.13.177.39:8080";
    const r = await fetch(`${url}/healthz`, { cache: "no-store", next: { revalidate: 0 } });
    if (!r.ok) return null;
    return (await r.json()) as any;
  } catch {
    return null;
  }
}

export default async function RoboticsPage() {
  const edge = await fetchEdgeStatus();
  const ok = !!edge && edge.status === "ok";
  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between">
        <div>
          <h1 className="aura-h1">Robotics</h1>
          <p className="aura-sub mt-1">
            NEPA edge runtime under your actuation layer. Physics is the dynamic calculation
            per timestamp — language only expresses.
          </p>
        </div>
        <span className={`aura-badge ${ok ? "aura-badge-success" : "aura-badge-warn"}`}>
          {ok ? "Edge online" : "Edge unreachable"}
        </span>
      </header>

      <div className="grid gap-5 md:grid-cols-3">
        <Card title="Runtime">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="aura-sub">Service</span><span className="font-semibold">aurasense-nepa</span></div>
            <div className="flex justify-between"><span className="aura-sub">Version</span><span className="font-mono">{edge?.version ?? "—"}</span></div>
            <div className="flex justify-between"><span className="aura-sub">Status</span><span className="font-semibold">{edge?.status ?? "unknown"}</span></div>
          </div>
        </Card>
        <Card title="Capacity">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="aura-sub">Active slots</span><span className="font-mono">{edge?.active_slots ?? "—"}</span></div>
            <div className="flex justify-between"><span className="aura-sub">Max slots</span><span className="font-mono">{edge?.max_slots ?? "—"}</span></div>
            <div className="flex justify-between"><span className="aura-sub">Free capacity</span><span className="font-mono">{edge?.free_capacity ?? "—"}</span></div>
          </div>
        </Card>
        <Card title="Transport">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span

cd ~/aurasense-platform/apps/playground

# ── 6e (cont). /robotics — finish the file ──
cat > src/app/robotics/page.tsx <<'EOF'
export const dynamic = "force-dynamic";

import Card from "../../components/shell/Card";
import Link from "next/link";

async function fetchEdgeStatus() {
  try {
    const url = process.env.NEPA_API_URL || "http://76.13.177.39:8080";
    const r = await fetch(`${url}/healthz`, { cache: "no-store", next: { revalidate: 0 } });
    if (!r.ok) return null;
    return (await r.json()) as any;
  } catch {
    return null;
  }
}

export default async function RoboticsPage() {
  const edge = await fetchEdgeStatus();
  const ok = !!edge && edge.status === "ok";

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="aura-h1">Robotics</h1>
          <p className="aura-sub mt-1">
            NEPA edge runtime under your actuation layer. Physics is the dynamic calculation
            per timestamp — language only expresses.
          </p>
        </div>
        <span className={`aura-badge ${ok ? "aura-badge-success" : "aura-badge-warn"}`}>
          {ok ? "Edge online" : "Edge unreachable"}
        </span>
      </header>

      <div className="grid gap-5 md:grid-cols-3">
        <Card title="Runtime">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="aura-sub">Service</span><span className="font-semibold">aurasense-nepa</span></div>
            <div className="flex justify-between"><span className="aura-sub">Version</span><span className="font-mono">{edge?.version ?? "—"}</span></div>
            <div className="flex justify-between"><span className="aura-sub">Status</span><span className="font-semibold">{edge?.status ?? "unknown"}</span></div>
          </div>
        </Card>
        <Card title="Capacity">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="aura-sub">Active slots</span><span className="font-mono">{edge?.active_slots ?? "—"}</span></div>
            <div className="flex justify-between"><span className="aura-sub">Max slots</span><span className="font-mono">{edge?.max_slots ?? "—"}</span></div>
            <div className="flex justify-between"><span className="aura-sub">Free capacity</span><span className="font-mono">{edge?.free_capacity ?? "—"}</span></div>
          </div>
        </Card>
        <Card title="Transport">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="aura-sub">aiortc</span><span className="font-semibold">{edge?.aiortc_available ? "available" : "off"}</span></div>
            <div className="flex justify-between"><span className="aura-sub">Endpoint</span><span className="font-mono text-xs">{process.env.NEPA_API_URL ?? "http://76.13.177.39:8080"}</span></div>
            <div className="flex justify-between"><span className="aura-sub">Latency contract</span><span className="font-semibold">per-tick</span></div>
          </div>
        </Card>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Card title="Substrate thesis">
          <p className="aura-sub leading-relaxed">
            Physics doesn't crash with neuro-dynamics here — physics <em>is</em> the
            dynamic calculation per timestamp, so they fold together instead of fighting.
            Natural language sits on top only to <em>express</em>, not to explain.
            The explanation lives in the dynamics.
          </p>
        </Card>
        <Card title="Integration">
          <ul className="space-y-2 text-sm">
            ><span className="aura-sub">Slots beneath actuation</span><span className="font-semibold">zero merge friction</span></li>
            ><span className="aura-sub">Edge target</span><span className="font-semibold">Jetson Nano / Orin</span></li>
            ><span className="aura-sub">Determinism</span><span className="font-semibold">scoped to runtime version</span></li>
            ><span className="aura-sub">Co-native dynamics</span><span className="font-semibold">timestamp-aligned</span></li>
          </ul>
          <div className="mt-4 flex gap-2">
            <Link href="/rehearse-3d" className="aura-btn aura-btn-primary">See it live →</Link>
            <Link href="/attas" className="aura-btn aura-btn-ghost">Open ATTAS</Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
