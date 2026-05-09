import { useState, useRef, useCallback } from "react";
import { startRehearse, pollRehearse } from "@/lib/rehearse/client";
import type { RehearseRequest, RehearseStatus } from "@/lib/rehearse/types";

export function useRehearse() {
  const [status, setStatus] = useState<RehearseStatus>({ state: "idle" });
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const stop = () => { if (timer.current) clearInterval(timer.current); timer.current = null; };

  const run = useCallback(async (req: RehearseRequest) => {
    stop();
    try {
      setStatus({ state: "queued", run_id: "pending" });
      const { run_id } = await startRehearse(req);
      setStatus({ state: "running", run_id, progress: 0, eta_s: 120 });
      timer.current = setInterval(async () => {
        const s = await pollRehearse(run_id);
        setStatus(s);
        if (s.state === "done" || s.state === "error") stop();
      }, 1500);
    } catch (e: any) {
      setStatus({ state: "error", message: e.message });
    }
  }, []);

  return { status, run, cancel: stop };
}