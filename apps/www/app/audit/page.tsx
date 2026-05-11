import type { AuditEvent, HriInteractionEvent } from "@aurasense/audit-events";
import { AuditLive } from "./AuditLive";

async function fetchRecent(): Promise<AuditEvent[]> {
  const res = await fetch(
    `${process.env.NEPA_API_URL}/api/soda/v1/audit/recent?limit=50`,
    {
      headers: { "X-Service-Token": process.env.NEPA_SERVICE_TOKEN! },
      cache: "no-store",
    },
  );
  if (!res.ok) return [];
  return res.json();
}

function isHri(e: AuditEvent): e is HriInteractionEvent {
  return e.kind === "hri_interaction";
}

export default async function AuditPage() {
  const events = await fetchRecent();
  return (
    <main className="mx-auto max-w-3xl p-6">
      <AuditLive />
      <h1 className="mb-4 text-xl font-semibold text-white">
        Audit Chain — last {events.length}
      </h1>
      <div className="space-y-2">
        {events.map((e, i) => (
          <div key={i} className="rounded border border-zinc-700 bg-zinc-900 p-3 font-mono text-xs">
            <div className="flex justify-between text-zinc-400">
              <span className="text-amber-400">{e.kind}</span>
              <span>{e.ts}</span>
            </div>
            {isHri(e) && (
              <div className="mt-2 text-zinc-200">
                <div>Q: {e.request.question}</div>
                <div>A: {e.response?.selected_option ?? e.response?.free_text ?? "(pending)"}</div>
                <div className="mt-1 text-[10px] text-zinc-500">
                  chain={e.chain_hash?.slice(0, 16)}…
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
