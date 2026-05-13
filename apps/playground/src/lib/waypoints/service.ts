export type Waypoint = { id: string; lat: number; lng: number; alt?: number };
export function validateWaypoints(_wp: Waypoint[]): boolean { return true; }
export async function saveWaypoints(_wp: Waypoint[]): Promise<{ ok: boolean }> { return { ok: true }; }
export async function loadWaypoints(): Promise<Waypoint[]> { return []; }
