import { getConfig } from "./config";
import type { HriRequest, HriResponse } from "./types";

async function authHeaders(): Promise<Record<string, string>> {
  const { authTokenProvider } = getConfig();
  if (!authTokenProvider) return {};
  const token = await authTokenProvider();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function fetchOpenRequests(sessionId: string): Promise<HriRequest[]> {
  const { nepaApiUrl } = getConfig();
  const res = await fetch(`${nepaApiUrl}/api/nepa/v1/hri/open?session=${sessionId}`, {
    headers: { ...(await authHeaders()) },
  });
  if (!res.ok) throw new Error(`HRI fetch failed: ${res.status}`);
  return res.json();
}

export async function postHriResponse(payload: HriResponse): Promise<void> {
  const { nepaApiUrl } = getConfig();
  const res = await fetch(`${nepaApiUrl}/api/nepa/v1/hri/respond`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(await authHeaders()) },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`HRI respond failed: ${res.status}`);
}

export function subscribeHriStream(
  sessionId: string,
  onEvent: (req: HriRequest) => void,
): () => void {
  const { nepaApiUrl } = getConfig();
  const es = new EventSource(
    `${nepaApiUrl}/api/nepa/v1/hri/stream?session=${sessionId}`,
    { withCredentials: true },
  );
  es.onmessage = (e) => onEvent(JSON.parse(e.data));
  es.onerror = () => {
    es.close();
    setTimeout(() => subscribeHriStream(sessionId, onEvent), 3000);  // auto-reconnect
  };
  return () => es.close();
}
import { getConfig } from "./config";
import type { HriRequest, HriResponse } from "./types";

async function authHeaders(): Promise<Record<string, string>> {
  const { authTokenProvider } = getConfig();
  if (!authTokenProvider) return {};
  const token = await authTokenProvider();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function fetchOpenRequests(sessionId: string): Promise<HriRequest[]> {
  const { nepaApiUrl } = getConfig();
  const res = await fetch(`${nepaApiUrl}/api/nepa/v1/hri/open?session=${sessionId}`, {
    headers: { ...(await authHeaders()) },
  });
  if (!res.ok) throw new Error(`HRI fetch failed: ${res.status}`);
  return res.json();
}

export async function postHriResponse(payload: HriResponse): Promise<void> {
  const { nepaApiUrl } = getConfig();
  const res = await fetch(`${nepaApiUrl}/api/nepa/v1/hri/respond`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(await authHeaders()) },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`HRI respond failed: ${res.status}`);
}

export function subscribeHriStream(
  sessionId: string,
  onEvent: (req: HriRequest) => void,
): () => void {
  const { nepaApiUrl } = getConfig();
  const es = new EventSource(
    `${nepaApiUrl}/api/nepa/v1/hri/stream?session=${sessionId}`,
    { withCredentials: true },
  );
  es.onmessage = (e) => onEvent(JSON.parse(e.data));
  es.onerror = () => {
    es.close();
    setTimeout(() => subscribeHriStream(sessionId, onEvent), 3000);  // auto-reconnect
  };
  return () => es.close();
}
