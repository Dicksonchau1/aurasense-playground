import { useEffect, useRef } from "react";
import type { Hand } from "../lib/landmark-math";

// MediaPipe hand connections (21 landmarks: thumb, index, middle, ring, pinky + palm)
const HAND_CONNECTIONS: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4],          // thumb
  [0, 5], [5, 6], [6, 7], [7, 8],          // index
  [5, 9], [9, 10], [10, 11], [11, 12],     // middle
  [9, 13], [13, 14], [14, 15], [15, 16],   // ring
  [13, 17], [17, 18], [18, 19], [19, 20],  // pinky
  [0, 17],                                  // palm base
];

type Props = {
  width: number;
  height: number;
  left: Hand | null;
  right: Hand | null;
  confidence: number; // 0..1
  fired: boolean;
};

export default function HandOverlay({ width, height, left, right, confidence, fired }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // colour mapping
  const colour = (() => {
    if (fired) return { stroke: "rgba(16,185,129,0.95)", point: "rgb(52,211,153)" };  // emerald
    if (confidence >= 0.5) return { stroke: "rgba(245,158,11,0.95)", point: "rgb(252,211,77)" }; // amber
    return { stroke: "rgba(239,68,68,0.85)", point: "rgb(248,113,113)" }; // red
  })();

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);
    ctx.lineWidth = 3;
    ctx.strokeStyle = colour.stroke;
    ctx.fillStyle = colour.point;

    const drawHand = (h: Hand) => {
      // The video element is visually flipped via CSS scale-x-[-1], so we flip x here to align.
      for (const [a, b] of HAND_CONNECTIONS) {
        ctx.beginPath();
        ctx.moveTo((1 - h[a].x) * width, h[a].y * height);
        ctx.lineTo((1 - h[b].x) * width, h[b].y * height);
        ctx.stroke();
      }
      for (const lm of h) {
        ctx.beginPath();
        ctx.arc((1 - lm.x) * width, lm.y * height, 4, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    if (left) drawHand(left);
    if (right) drawHand(right);
  }, [width, height, left, right, confidence, fired, colour.stroke, colour.point]);

  return (
    anvas
      ref={canvasRef}
      width={width}
      height={height}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
}
