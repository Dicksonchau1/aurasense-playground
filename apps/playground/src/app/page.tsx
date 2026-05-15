"use client";

export const dynamic = "force-dynamic";

import Link from "next/link";
import Card from "../components/shell/Card";

const APPS = [
  {
    href: "/rehearse-3d",
    title: "Rehearse-3D",
    tag: "Physics-grounded drone rehearsal at the timestamp.",
    body: "Lawnmower sweep over a 3D building target. Live coverage, defect detection, AI verdicts, mission log. Built on NEPA runtime.",
    badge: "Live",
    klass: "aura-badge-success",
  },
  {
    href: "/attas",
    title: "ATTAS Sandbox",
    tag: "Enterprise drone & mission operations.",
    body: "Parameters, environment, drone specs, camera, safety, audit, simulation. Every page live.",
    badge: "Production",
    klass: "aura-badge",
  },
  {
    href: "/robotics",
    title: "Robotics",
    tag: "NEPA-beneath-actuation, low round-trip latency.",
    body: "Edge runtime slots, fleet telemetry, audit chain. Physics is the dynamic calculation per timestamp \u2014 language only expresses.",
    badge: "Edge",
    klass: "aura-badge",
  },
];

export default function PlaygroundHome() {
  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="aura-h1">AuraSense Playground</h1>
          <p className="aura-sub mt-1">
            Real-time perception grounded in physics. Choose an app to begin.
          </p>
        </div>
        <div className="flex gap-2 items-center">
          <span className="aura-badge aura-badge-success">System operational</span>
          <span className="aura-badge">v1.0.0-rc.1</span>
        </div>
      </header>

      <div className="grid gap-5 md:grid-cols-3">
        {APPS.map((app) => (
          <Card key={app.href} className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="aura-h2">{app.title}</h3>
              <span className={"aura-badge " + (app.klass.replace("aura-badge", "").trim() ? app.klass : "")}>{app.badge}</span>
            </div>
            <p className="text-sm font-medium">{app.tag}</p>
            <p className="aura-sub flex-1">{app.body}</p>
            <Link href={app.href} className="aura-btn aura-btn-primary mt-2">
              Open {app.title}
            </Link>
          </Card>
        ))}
      </div>

      <Card title="What you are looking at">
        <p className="aura-sub">
          Playground is AuraSense\u2019s real-time reference deployment. The fun part is the
          real-time overlay and the simulation rehearsal mental environment built on top
          of it. We grounded it in physics \u2014 only possible because our neuromorphic
          model handles low round-trip latency. That is what gives actuation the real
          perception it needs.
        </p>
      </Card>
    </div>
  );
}
