
import type { RehearseRequest, RehearseResult, RehearseStatus } from "./types";
import { getApiBaseUrl } from "./apiBase";


export async function startRehearse(req: RehearseRequest): Promise<{ run_id: string }> {
  const base = getApiBaseUrl();
  const url = base ? `${base}/api/rehearse` : "/api/rehearse";
  const r = await fetch(url, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}


export async function pollRehearse(run_id: string): Promise<RehearseStatus> {
  const base = getApiBaseUrl();
  const url = base ? `${base}/api/rehearse/${run_id}` : `/api/rehearse/${run_id}`;
  const r = await fetch(url);
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}


export async function getRehearseResult(run_id: string): Promise<RehearseResult> {
  const base = getApiBaseUrl();
  const url = base ? `${base}/api/rehearse/${run_id}/result` : `/api/rehearse/${run_id}/result`;
  const r = await fetch(url);
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}