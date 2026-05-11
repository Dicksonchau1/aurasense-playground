import {
  type Hand,
  LM,
  dist,
  dist2D,
  palmCenter,
  palmNormal,
  dot,
  fingersExtended,
  handScale,
} from "./landmark-math";
import type { GestureHistory } from "./gesture-history";

export type ClassifierInput = {
  left: Hand | null;
  right: Hand | null;
  history: GestureHistory;
  now: number;
};

// ─── Step 1: Palm to palm ───────────────────────────────────────────
// Both hands present, palms facing each other (normals roughly antiparallel),
// palm centers within ~1.5x hand-scale distance.
export function isPalmToPalm({ left, right }: ClassifierInput): boolean {
  if (!left || !right) return false;
  const cL = palmCenter(left);
  const cR = palmCenter(right);
  const scale = (handScale(left) + handScale(right)) / 2;
  if (dist(cL, cR) > scale * 2.0) return false;

  const nL = palmNormal(left);
  const nR = palmNormal(right);
  // antiparallel = dot product close to -1, but MediaPipe normals are noisy,
  // so we accept anything below 0 (facing each other in some sense)
  if (dot(nL, nR) > 0.2) return false;

  // Both hands should have fingers extended (open palms, not fists)
  if (!fingersExtended(left) || !fingersExtended(right)) return false;

  return true;
}

// ─── Step 2: Back of hands (right palm over left dorsum) ────────────
// One palm "above" the other in y-coordinate, palms not facing each other
// (one palm faces down toward the other's back).
export function isBackOfHands({ left, right }: ClassifierInput): boolean {
  if (!left || !right) return false;
  const cL = palmCenter(left);
  const cR = palmCenter(right);
  const scale = (handScale(left) + handScale(right)) / 2;

  // Hands are stacked: y-difference is meaningful
  if (Math.abs(cL.y - cR.y) > scale * 1.2) return false;

  // Palms close together (overlap)
  if (dist(cL, cR) > scale * 1.5) return false;

  // Normals NOT antiparallel — they're roughly parallel (both pointing
  // away from camera, since one hand is on top of the other)
  const nL = palmNormal(left);
  const nR = palmNormal(right);
  if (dot(nL, nR) < 0.3) return false;

  return true;
}

// ─── Step 3: Interlaced fingers ─────────────────────────────────────
// Palms close, fingers from both hands interleaved.
// Heuristic: alternating x-position of fingertips at similar y-coordinate.
export function isInterlacedFingers({ left, right }: ClassifierInput): boolean {
  if (!left || !right) return false;
  const cL = palmCenter(left);
  const cR = palmCenter(right);
  const scale = (handScale(left) + handScale(right)) / 2;

  // Palms close
  if (dist(cL, cR) > scale * 1.8) return false;

  // Collect all fingertips with which hand they belong to
  const tips: { x: number; y: number; side: "L" | "R" }[] = [];
  for (const id of [LM.INDEX_TIP, LM.MIDDLE_TIP, LM.RING_TIP, LM.PINKY_TIP]) {
    tips.push({ x: left[id].x, y: left[id].y, side: "L" });
    tips.push({ x: right[id].x, y: right[id].y, side: "R" });
  }
  // Sort by x — if interlaced, sides should alternate
  tips.sort((a, b) => a.x - b.x);
  let alternations = 0;
  for (let i = 1; i < tips.length; i++) {
    if (tips[i].side !== tips[i - 1].side) alternations++;
  }
  // 8 tips total → up to 7 alternations if perfectly interleaved
  return alternations >= 4;
}

// ─── Step 4: Backs of fingers to opposing palms (locked) ────────────
// Knuckles of one hand against opposing palm. Heuristic:
// MCPs of one hand close to palm-center of the other.
export function isBacksOfFingers({ left, right }: ClassifierInput): boolean {
  if (!left || !right) return false;
  const scale = (handScale(left) + handScale(right)) / 2;

  // Average of left MCPs near right palm-center, OR vice versa
  const leftMCPmean = {
    x: (left[LM.INDEX_MCP].x + left[LM.MIDDLE_MCP].x + left[LM.RING_MCP].x + left[LM.PINKY_MCP].x) / 4,
    y: (left[LM.INDEX_MCP].y + left[LM.MIDDLE_MCP].y + left[LM.RING_MCP].y + left[LM.PINKY_MCP].y) / 4,
    z: (left[LM.INDEX_MCP].z + left[LM.MIDDLE_MCP].z + left[LM.RING_MCP].z + left[LM.PINKY_MCP].z) / 4,
  };
  const rightMCPmean = {
    x: (right[LM.INDEX_MCP].x + right[LM.MIDDLE_MCP].x + right[LM.RING_MCP].x + right[LM.PINKY_MCP].x) / 4,
    y: (right[LM.INDEX_MCP].y + right[LM.MIDDLE_MCP].y + right[LM.RING_MCP].y + right[LM.PINKY_MCP].y) / 4,
    z: (right[LM.INDEX_MCP].z + right[LM.MIDDLE_MCP].z + right[LM.RING_MCP].z + right[LM.PINKY_MCP].z) / 4,
  };
  const cL = palmCenter(left);
  const cR = palmCenter(right);

  const leftKnucklesNearRightPalm = dist(leftMCPmean, cR) < scale * 0.8;
  const rightKnucklesNearLeftPalm = dist(rightMCPmean, cL) < scale * 0.8;

  return leftKnucklesNearRightPalm || rightKnucklesNearLeftPalm;
}

// ─── Step 5: Thumb rotation ─────────────────────────────────────────
// One thumb wrapped/rotating around the other palm. Detected by:
//  (a) thumb tip close to opposing palm center
//  (b) thumb tip moving in a circular path (history check)
export function isThumbRotation({ left, right, history, now }: ClassifierInput): boolean {
  if (!left || !right) return false;
  const scale = (handScale(left) + handScale(right)) / 2;
  const cL = palmCenter(left);
  const cR = palmCenter(right);
  const tL = left[LM.THUMB_TIP];
  const tR = right[LM.THUMB_TIP];

  const leftThumbWraps = dist(tL, cR) < scale * 0.9;
  const rightThumbWraps = dist(tR, cL) < scale * 0.9;
  if (!leftThumbWraps && !rightThumbWraps) return false;

  // Motion check: thumb tip should have moved over the last 600ms
  const recent = history.recent(600);
  if (recent.length < 4) return false;
  const which: "left" | "right" = leftThumbWraps ? "left" : "right";
  let totalMove = 0;
  for (let i = 1; i < recent.length; i++) {
    const a = recent[i - 1][which]?.[LM.THUMB_TIP];
    const b = recent[i][which]?.[LM.THUMB_TIP];
    if (!a || !b) continue;
    totalMove += dist2D(a, b);
  }
  return totalMove > scale * 0.4;
}

// ─── Step 6: Fingertip circles ──────────────────────────────────────
// Fingertips of one hand making circular motion in opposing palm.
// Heuristic: index/middle/ring tips close to opposing palm center,
// and those tips have moved over the last 600ms.
export function isFingertipCircles({ left, right, history }: ClassifierInput): boolean {
  if (!left || !right) return false;
  const scale = (handScale(left) + handScale(right)) / 2;
  const cL = palmCenter(left);
  const cR = palmCenter(right);

  const leftTipsNearRight =
    dist(left[LM.INDEX_TIP], cR) < scale * 0.7 &&
    dist(left[LM.MIDDLE_TIP], cR) < scale * 0.7;
  const rightTipsNearLeft =
    dist(right[LM.INDEX_TIP], cL) < scale * 0.7 &&
    dist(right[LM.MIDDLE_TIP], cL) < scale * 0.7;
  if (!leftTipsNearRight && !rightTipsNearLeft) return false;

  const which: "left" | "right" = leftTipsNearRight ? "left" : "right";
  const recent = history.recent(600);
  if (recent.length < 4) return false;

  let totalMove = 0;
  for (let i = 1; i < recent.length; i++) {
    const a = recent[i - 1][which]?.[LM.INDEX_TIP];
    const b = recent[i][which]?.[LM.INDEX_TIP];
    if (!a || !b) continue;
    totalMove += dist2D(a, b);
  }
  return totalMove > scale * 0.4;
}

// ─── Step 7: Wrist rotation ─────────────────────────────────────────
// Both wrists detected, palm orientations changing over time.
// Heuristic: significant change in palm-normal direction across history.
export function isWristRotation({ left, right, history }: ClassifierInput): boolean {
  if (!left || !right) return false;

  const recent = history.recent(800);
  if (recent.length < 5) return false;

  // Compute palm-normal change over the window for both hands
  const normalChange = (side: "left" | "right"): number => {
    let total = 0;
    let prev: { x: number; y: number; z: number } | null = null;
    for (const s of recent) {
      const h = s[side];
      if (!h) { prev = null; continue; }
      const n = palmNormal(h);
      if (prev) {
        // 1 - dot product = how much normal moved
        total += 1 - dot(prev, n);
      }
      prev = n;
    }
    return total;
  };

  const leftChange = normalChange("left");
  const rightChange = normalChange("right");
  // Both wrists should show rotation activity
  return leftChange > 0.4 && rightChange > 0.4;
}

// ─── Dispatch ───────────────────────────────────────────────────────
import type { StepId } from "./handwashing-state";

export const CLASSIFIERS: Record<StepId, (i: ClassifierInput) => boolean> = {
  palm_to_palm: isPalmToPalm,
  back_of_hands: isBackOfHands,
  interlaced_fingers: isInterlacedFingers,
  backs_of_fingers: isBacksOfFingers,
  thumb_rotation: isThumbRotation,
  fingertip_circles: isFingertipCircles,
  wrist_rotation: isWristRotation,
};
