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
