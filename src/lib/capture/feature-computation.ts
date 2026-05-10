// Per-frame geometric feature computation for one hand.
// Input: 21 MediaPipe landmarks. Output: a flat features object.

import { sub, cross, angleDeg, type Vec3 } from "./vec3";

export type Landmark = Vec3;
export type HandLandmarks = Landmark[]; // length 21

export const LM = {
  WRIST: 0,
  THUMB_CMC: 1, THUMB_MCP: 2, THUMB_IP: 3, THUMB_TIP: 4,
  INDEX_MCP: 5, INDEX_PIP: 6, INDEX_DIP: 7, INDEX_TIP: 8,
  MIDDLE_MCP: 9, MIDDLE_PIP: 10, MIDDLE_DIP: 11, MIDDLE_TIP: 12,
  RING_MCP: 13, RING_PIP: 14, RING_DIP: 15, RING_TIP: 16,
  PINKY_MCP: 17, PINKY_PIP: 18, PINKY_DIP: 19, PINKY_TIP: 20,
} as const;

export const FINGERTIP_INDICES = [
  LM.THUMB_TIP, LM.INDEX_TIP, LM.MIDDLE_TIP, LM.RING_TIP, LM.PINKY_TIP,
];

export function palmNormal(hand: HandLandmarks): Vec3 {
  const w = hand[LM.WRIST];
  const i = hand[LM.INDEX_MCP];
  const p = hand[LM.PINKY_MCP];
  return cross(sub(w, i), sub(w, p));
}

export function palmAngleToCameraDeg(hand: HandLandmarks): number {
  const cameraForward: Vec3 = { x: 0, y: 0, z: -1 };
  return angleDeg(palmNormal(hand), cameraForward);
}

function jointFlexionDeg(proximal: Vec3, mid: Vec3, distal: Vec3): number {
  const seg1 = sub(proximal, mid);
  const seg2 = sub(mid, distal);
  return 180 - angleDeg(seg1, seg2);
}

export type FingerAngles = { pip_deg: number; dip_deg: number };

export function fingerAngles(
  hand: HandLandmarks,
  mcpId: number,
  pipId: number,
  dipId: number,
  tipId: number,
): FingerAngles {
  return {
    pip_deg: jointFlexionDeg(hand[mcpId], hand[pipId], hand[dipId]),
    dip_deg: jointFlexionDeg(hand[pipId], hand[dipId], hand[tipId]),
  };
}

export function thumbIndexAngleDeg(hand: HandLandmarks): number {
  const thumbVec = sub(hand[LM.THUMB_MCP], hand[LM.THUMB_TIP]);
  const indexVec = sub(hand[LM.INDEX_MCP], hand[LM.INDEX_TIP]);
  return angleDeg(thumbVec, indexVec);
}

export function missingLandmarkCount(hand: HandLandmarks): number {
  let count = 0;
  for (const lm of hand) {
    if (!lm || !Number.isFinite(lm.x) || !Number.isFinite(lm.y) || !Number.isFinite(lm.z)) {
      count++;
    }
  }
  return count;
}

export function landmarksNearBorderCount(hand: HandLandmarks, margin = 0.03): number {
  let count = 0;
  for (const lm of hand) {
    if (lm.x < margin || lm.x > 1 - margin || lm.y < margin || lm.y > 1 - margin) {
      count++;
    }
  }
  return count;
}

export function bboxAreaRatio(hand: HandLandmarks): number {
  let xMin = Infinity, xMax = -Infinity, yMin = Infinity, yMax = -Infinity;
  for (const lm of hand) {
    if (lm.x < xMin) xMin = lm.x;
    if (lm.x > xMax) xMax = lm.x;
    if (lm.y < yMin) yMin = lm.y;
    if (lm.y > yMax) yMax = lm.y;
  }
  const w = Math.max(0, xMax - xMin);
  const h = Math.max(0, yMax - yMin);
  return w * h;
}

export function maxDepthJump(prev: HandLandmarks, curr: HandLandmarks): number {
  if (!prev || !curr || prev.length !== curr.length) return 0;
  let max = 0;
  for (let i = 0; i < prev.length; i++) {
    const dz = Math.abs(curr[i].z - prev[i].z);
    if (dz > max) max = dz;
  }
  return max;
}

export type FrameFeatures = {
  palm_normal_angle_deg: number;
  thumb_index_angle_deg: number;
  index_pip_angle_deg: number;
  index_dip_angle_deg: number;
  middle_pip_angle_deg: number;
  middle_dip_angle_deg: number;
  ring_pip_angle_deg: number;
  ring_dip_angle_deg: number;
  pinky_pip_angle_deg: number;
  pinky_dip_angle_deg: number;
  missing_landmark_count: number;
  landmarks_near_border_count: number;
  bbox_area_ratio: number;
};

export function computeFrameFeatures(hand: HandLandmarks): FrameFeatures {
  const index = fingerAngles(hand, LM.INDEX_MCP, LM.INDEX_PIP, LM.INDEX_DIP, LM.INDEX_TIP);
  const middle = fingerAngles(hand, LM.MIDDLE_MCP, LM.MIDDLE_PIP, LM.MIDDLE_DIP, LM.MIDDLE_TIP);
  const ring = fingerAngles(hand, LM.RING_MCP, LM.RING_PIP, LM.RING_DIP, LM.RING_TIP);
  const pinky = fingerAngles(hand, LM.PINKY_MCP, LM.PINKY_PIP, LM.PINKY_DIP, LM.PINKY_TIP);

  return {
    palm_normal_angle_deg: palmAngleToCameraDeg(hand),
    thumb_index_angle_deg: thumbIndexAngleDeg(hand),
    index_pip_angle_deg: index.pip_deg,
    index_dip_angle_deg: index.dip_deg,
    middle_pip_angle_deg: middle.pip_deg,
    middle_dip_angle_deg: middle.dip_deg,
    ring_pip_angle_deg: ring.pip_deg,
    ring_dip_angle_deg: ring.dip_deg,
    pinky_pip_angle_deg: pinky.pip_deg,
    pinky_dip_angle_deg: pinky.dip_deg,
    missing_landmark_count: missingLandmarkCount(hand),
    landmarks_near_border_count: landmarksNearBorderCount(hand),
    bbox_area_ratio: bboxAreaRatio(hand),
  };
}
