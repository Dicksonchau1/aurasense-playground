import { useEffect, useRef, useState } from "react";
import {
  WHO_STEPS,
  createInitialState,
  tickStep,
  isSessionComplete,
  type SessionState,
} from "../../lib/handwashing-state";

type Props = { onComplete: (state: SessionState) => void };

export default function RehearsalScreen({ onComplete }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const detectorRef = useRef<any>(null);
  const lastFrameTime = useRef<number>(performance.now());
  const animationFrameId = useRef<number | null>(null);

  const [state, setState] = useState<SessionState>(createInitialState);
  const [status, setStatus] = useState<"loading" | "ready" | "running" | "error">("loading");
  const [handsDetected, setHandsDetected] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480, facingMode: "user" },
          audio: false,
        });
        if (!mounted) return;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }

        const { FilesetResolver, HandLandmarker } = await import("@mediapipe/tasks-vision");
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );
        const detector = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/latest/hand_landmarker.task",
            delegate: "GPU",
          },
          runningMode: "VIDEO",
          numHands: 2,
        });

        if (!mounted) return;
        detectorRef.current = detector;
        setStatus("ready");
      } catch (err: any) {
        console.error("Setup failed:", err);
        setErrorMsg(err?.message ?? String(err));
        setStatus("error");
      }
    })();

    return () => {
      mounted = false;
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      const stream = videoRef.current?.srcObject as MediaStream | null;
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  useEffect(() => {
    if (status !== "running") return;

    const loop = () => {
      const now = performance.now();
      const elapsed = now - lastFrameTime.current;
      lastFrameTime.current = now;

      let detected = false;
      if (videoRef.current && detectorRef.current && videoRef.current.readyState >= 2) {
        try {
          const result = detectorRef.current.detectForVideo(videoRef.current, now);
          detected = result.landmarks && result.landmarks.length > 0;
        } catch {
          // ignore single-frame errors
        }
      }

      setHandsDetected(detected);
      setState((prev) => {
        const next = tickStep(prev, detected, elapsed);
        if (isSessionComplete(next) && !prev.endedAt) {
          const finalized = { ...next, endedAt: now };
          setTimeout(() => onComplete(finalized), 0);
          return finalized;
        }
        return next;
      });

      animationFrameId.current = requestAnimationFrame(loop);
    };

    lastFrameTime.current = performance.now();
    animationFrameId.current = requestAnimationFrame(loop);

    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, [status, onComplete]);

  const startSession = () => {
    setState((s) => ({ ...s, startedAt: performance.now() }));
    setStatus("running");
  };

  if (status === "error") {
    return (
      <div className="max-w-2xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold text-red-400 mb-2">Camera unavailable</h2>
        <p className="text-white/60 text-sm">{errorMsg}</p>
        <p className="text-white/50 text-sm mt-4">
          Aura Rehearse needs camera access to run the pose pipeline. Please
          allow camera access in your browser and refresh the page.
        </p>
      </div>
    );
  }

  if (status === "loading") {
    return (
      <div className="max-w-2xl mx-auto px-6 py-12 text-white/60 text-sm">
        Loading webcam and pose model…
      </div>
    );
  }

  const currentStep =
    state.currentStepIndex < WHO_STEPS.length
      ? WHO_STEPS[state.currentStepIndex]
      : null;
  const currentResult =
    state.currentStepIndex < WHO_STEPS.length
      ? state.stepResults[state.currentStepIndex]
      : null;
  const progressMs = currentResult?.detectedMs ?? 0;
  const targetMs = currentStep?.minDurationMs ?? 1;
  const progressPct = Math.min(100, (progressMs / targetMs) * 100);

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <h2 className="text-2xl font-bold text-white mb-4">
        Nursing Skills Rehearsal — WHO 7-step
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl overflow-hidden bg-black border border-white/10 relative">
          <video
            ref={videoRef}
            playsInline
            muted
            className="w-full h-auto block transform scale-x-[-1]"
          />
          <div className="absolute top-3 left-3 px-2 py-1 rounded text-[10px] font-mono uppercase tracking-wider bg-black/70 border border-white/20 text-white/80">
            {handsDetected ? "✓ hands detected" : "no hands"}
          </div>
        </div>

        <div className="space-y-4">
          {status === "ready" ? (
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6">
              <p className="text-white/70 text-sm mb-4">
                Webcam ready. When you press start, the 7-step procedure begins.
                Show both hands to the camera and follow each step.
              </p>
              <button
                onClick={startSession}
                className="px-5 py-2 rounded-md bg-cyan-500 text-black font-semibold text-sm hover:bg-cyan-400"
              >
                Start 7-step procedure
              </button>
            </div>
          ) : currentStep ? (
            <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/5 p-6">
              <div className="text-xs uppercase tracking-wider text-cyan-400 font-mono mb-2">
                Step {state.currentStepIndex + 1} of {WHO_STEPS.length}
              </div>
              <h3 className="text-xl font-semibold text-white mb-1">
                {currentStep.label}
              </h3>
              <p className="text-white/60 text-sm mb-4">
                {currentStep.description}
              </p>
              <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full bg-cyan-400 transition-all duration-100"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <div className="mt-2 text-xs text-white/50 font-mono">
                {Math.round(progressMs / 1000)}s / {targetMs / 1000}s
              </div>
            </div>
          ) : null}

          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
            <div className="text-xs uppercase tracking-wider text-white/40 font-mono mb-2">
              Progress
            </div>
            <ol className="space-y-1 text-sm">
              {WHO_STEPS.map((step, i) => (
                
                  className={`flex items-center gap-2 ${
                    i < state.currentStepIndex
                      ? "text-emerald-400"
                      : i === state.currentStepIndex
                      ? "text-cyan-400"
                      : "text-white/30"
                  }`}
                >
                  <span className="w-4 text-center">
                    {i < state.currentStepIndex ? "✓" : i + 1}
                  </span>
                  <span>{step.label}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
