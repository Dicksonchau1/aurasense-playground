"use client";

import { useEffect, useRef, useState } from "react";
import {
  PoseLandmarker,
  FilesetResolver,
  type PoseLandmarkerResult,
} from "@mediapipe/tasks-vision";

export interface PoseState {
  ready: boolean;
  error: string | null;
  result: PoseLandmarkerResult | null;
  fps: number;
}

export function usePoseLandmarker(
  videoRef: React.RefObject<HTMLVideoElement>,
  enabled: boolean
) {
  const [state, setState] = useState<PoseState>({
    ready: false,
    error: null,
    result: null,
    fps: 0,
  });
  const landmarkerRef = useRef<PoseLandmarker | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastInferRef = useRef<number>(0);
  const frameTimesRef = useRef<number[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm"
        );
        const lm = await PoseLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task",
            delegate: "GPU",
          },
          runningMode: "VIDEO",
          numPoses: 1,
          minPoseDetectionConfidence: 0.5,
          minPosePresenceConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });
        if (cancelled) {
          lm.close();
          return;
        }
        landmarkerRef.current = lm;
        setState((s) => ({ ...s, ready: true }));
      } catch (e: any) {
        setState((s) => ({ ...s, error: e?.message ?? "Failed to load pose model" }));
      }
    })();
    return () => {
      cancelled = true;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      landmarkerRef.current?.close();
      landmarkerRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!enabled || !state.ready) return;
    const video = videoRef.current;
    if (!video) return;

    const loop = () => {
      const lm = landmarkerRef.current;
      if (!lm || video.readyState < 2) {
        rafRef.current = requestAnimationFrame(loop);
        return;
      }
      const ts = performance.now();
      if (ts - lastInferRef.current >= 33) {
        try {
          const res = lm.detectForVideo(video, ts);
          lastInferRef.current = ts;
          frameTimesRef.current.push(ts);
          frameTimesRef.current = frameTimesRef.current.filter((t) => ts - t < 1000);
          setState((s) => ({ ...s, result: res, fps: frameTimesRef.current.length }));
        } catch {
          // skip frame on transient WebGL error
        }
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [enabled, state.ready, videoRef]);

  return state;
}
