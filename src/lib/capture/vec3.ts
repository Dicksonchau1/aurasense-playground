// 3D vector primitives used across the capture pipeline.
// Plain functions, no classes — easy to unit-test, easy to inline.

export type Vec3 = { x: number; y: number; z: number };

export function sub(a: Vec3, b: Vec3): Vec3 {
  return { x: b.x - a.x, y: b.y - a.y, z: b.z - a.z };
}

export function dot(u: Vec3, v: Vec3): number {
  return u.x * v.x + u.y * v.y + u.z * v.z;
}

export function cross(u: Vec3, v: Vec3): Vec3 {
  return {
    x: u.y * v.z - u.z * v.y,
    y: u.z * v.x - u.x * v.z,
    z: u.x * v.y - u.y * v.x,
  };
}

export function norm(u: Vec3): number {
  return Math.sqrt(Math.max(0, dot(u, u)));
}

export function normalize(u: Vec3): Vec3 {
  const n = norm(u) + 1e-9;
  return { x: u.x / n, y: u.y / n, z: u.z / n };
}

export function angleDeg(u: Vec3, v: Vec3): number {
  const denom = norm(u) * norm(v) + 1e-9;
  const d = Math.max(-1, Math.min(1, dot(u, v) / denom));
  return (Math.acos(d) * 180) / Math.PI;
}

export function angleRad(u: Vec3, v: Vec3): number {
  const denom = norm(u) * norm(v) + 1e-9;
  const d = Math.max(-1, Math.min(1, dot(u, v) / denom));
  return Math.acos(d);
}
