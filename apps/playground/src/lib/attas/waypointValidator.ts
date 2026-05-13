export interface Waypoint {
  id: string;
  lat: number;
  lng: number;
  alt_m: number;
  label?: string;
}

export interface ValidationResult {
  waypointId: string;
  label?: string;
  valid: boolean;
  violations: string[];
}

export interface ValidateSummary {
  total: number;
  passed: number;
  failed: number;
  score: number;
}

export interface ValidateResponse {
  sessionId: string;
  timestamp: string;
  building: string;
  drone: string;
  results: ValidationResult[];
  summary: ValidateSummary;
}

export async function validateWaypoints(
  waypoints: Waypoint[],
  opts?: { building?: string; drone?: string; sessionId?: string }
): Promise<ValidateResponse> {
  const res = await fetch("/api/attas/waypoints/validate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      waypoints,
      building: opts?.building,
      drone: opts?.drone,
      sessionId: opts?.sessionId,
    }),
    cache: "no-store",
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error ?? `Validate failed: ${res.status}`);
  }
  return res.json();
}
