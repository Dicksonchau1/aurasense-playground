"use client";
import { useEffect, useRef, useState } from "react";

type Props = { onFrame?: (canvas: HTMLCanvasElement) => void };

export default function CameraMirror({ onFrame }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [err, setErr] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let stream: MediaStream | null = null;
    (async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480, facingMode: "user" },
          audio: false,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          setReady(true);
        }
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Camera access denied";
        setErr(msg);
      }
    })();
    return () => { if (stream) stream.getTracks().forEach((t) => t.stop()); };
  }, []);

  useEffect(() => {
    if (!onFrame || !ready) return;
    const id = setInterval(() => {
      const v = videoRef.current;
      const c = canvasRef.current;
      if (v && c) {
        const ctx = c.getContext("2d");
        if (ctx) { ctx.drawImage(v, 0, 0, 640, 480); onFrame(c); }
      }
    }, 500);
    return () => clearInterval(id);
  }, [onFrame, ready]);

  if (err) {
    return (
      <div className="bg-red-900/40 border border-red-700 rounded p-4 text-red-200 text-sm">
        Camera error: {err}.
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-xl mx-auto rounded-lg overflow-hidden bg-black">
      <video ref={videoRef} className="w-full h-auto" muted playsInline autoPlay />
      <canvas ref={canvasRef} width={640} height={480} className="hidden" />
      {!ready && (
        <div className="absolute inset-0 flex items-center justify-center text-gray-300">
          Initializing camera...
        </div>
      )}
    </div>
  );
}
