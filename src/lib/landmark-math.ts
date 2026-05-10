// MediaPipe Hands gives us 21 landmarks per hand, each with {x, y, z} in
// normalized coordinates (0-1 across the image, z relative to wrist depth).
//
// Landmark indices we care about:
//   0  = wrist
//   1-4 = thumb (CMC, MCP, IP, TIP)
//   5-8 = index (MCP, PIP, DIP, TIP)
//   9-12 = middle
//   13-16 = ring
//   17-20 = pinky

export type Landmark = { x: number; y: number; z: number };
export type Hand = Landmark[]; // length 21

export const LM = {
  WRIST: 0,
  THUMB_CMC: 1, THUMB_MCP: 2, THUMB_IP: 3, THUMB_TIP: 4,
  INDEX_MCP: 5, INDEX_PIP: 6, INDEX_DIP: 7, INDEX_TIP: 8,
  MIDDLE_MCP: 9, MIDDLE_PIP: 10, MIDDLE_DIP: 11, MIDDLE_TIP: 12,
  RING_MCP: 13, RING_PIP: 14, RING_DIP: 15, RING_TIP: 16,
  PINKY_MCP: 17, PINKY_PIP: 18, PINKY_DIP: 19, PINKY_TIP: 20,
} as const;

export function dist(a: Landmark, b: Landmark): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const dz = a.z - b.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

export function dist2D(a: Landmark, b: Landmark): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

export function midpoint(a: Landmark, b: Landmark): Landmark {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2, z: (a.z + b.z) / 2 };
}

export function palmCenter(hand: Hand): Landmark {
  // Average of wrist + 4 MCP joints — robust palm anchor
  const ids = [LM.WRIST, LM.INDEX_MCP, LM.MIDDLE_MCP, LM.RING_MCP, LM.PINKY_MCP];
  let x = 0, y = 0, z = 0;
  for (const i of ids) {
    x += hand[i].x; y += hand[i].y; z += hand[i].z;
  }
  return { x: x / ids.length, y: y / ids.length, z: z / ids.length };
}

// Return a normal vector to the palm plane (rough; uses cross product
// of WRIST→INDEX_MCP and WRIST→PINKY_MCP)
export function palmNormal(hand: Hand): Landmark {
  const w = hand[LM.WRIST];
  const i = hand[LM.INDEX_MCP];
  const p = hand[LM.PINKY_MCP];
  const v1 = { x: i.x - w.x, y: i.y - w.y, z: i.z - w.z };
  const v2 = { x: p.x - w.x, y: p.y - w.y, z: p.z - w.z };
  // cross product
  const nx = v1.y * v2.z - v1.z * v2.y;
  const ny = v1.z * v2.x - v1.x * v2.z;
  const nz = v1.x * v2.y - v1.y * v2.x;
  const mag = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1;
  return { x: nx / mag, y: ny / mag, z: nz / mag };
}

export function dot(a: Landmark, b: Landmark): number {
  return a.x * b.x + a.y * b.y + a.z * b.z;
}

// Are the fingers extended? Heuristic: tip is further from wrist than PIP.
export function fingersExtended(hand: Hand): boolean {
  const w = hand[LM.WRIST];
  const checks = [
    [LM.INDEX_TIP, LM.INDEX_PIP],
    [LM.MIDDLE_TIP, LM.MIDDLE_PIP],
    [LM.RING_TIP, LM.RING_PIP],
    [LM.PINKY_TIP, LM.PINKY_PIP],
  ];
  let extended = 0;
  for (const [tip, pip] of checks) {
    if (dist(hand[tip], w) > dist(hand[pip], w) * 1.15) extended++;
  }
  return extended >= 3;
}

// Approximate hand "size" for normalizing distances across users / camera distance
export function handScale(hand: Hand): number {
  return dist(hand[LM.WRIST], hand[LM.MIDDLE_MCP]) || 0.001;
}
