import crypto from "node:crypto";

export async function nepaFetch(path: string, init?: RequestInit) {
  const base = process.env.NEPA_BASE_URL;
  if (!base) throw new Error("NEPA_BASE_URL not set");
  const res = await fetch(`${base}${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });
  return res;
}

export function sha256(input: string | Uint8Array): string {
  const h = crypto.createHash("sha256");
  h.update(input as any);
  return h.digest("hex");
}

export function jitter(base: number, spreadRatio = 0.1): number {
  const delta = base * spreadRatio;
  return Math.max(0, base + (Math.random() * 2 - 1) * delta);
}

type EnvelopeInput = Record<string, unknown> | unknown;
export function envelope(payload: EnvelopeInput, meta: Record<string, unknown> = {}) {
  const now = new Date().toISOString();
  return {
    meta: { ts: now, ...meta },
    payload,
  };
}
