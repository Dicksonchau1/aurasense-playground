import type { RehearseRequest, RehearseResult, RehearseStatus } from "./types";

export async function startRehearse(req: RehearseRequest): Promise<{ run_id: string }> {
  const r = await fetch("/api/rehearse", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

export async function pollRehearse(run_id: string): Promise<RehearseStatus> {
  const r = await fetch(`/api/rehearse/${run_id}`);
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

export async function getRehearseResult(run_id: string): Promise<RehearseResult> {
  const r = await fetch(`/api/rehearse/${run_id}/result`);
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}