"use client";
import { useEffect, useRef, useState } from "react";
import type { SweepEvent, CellResult, GateState } from "@/lib/sweep/events";

export type SweepSnapshot = {
  state: "connecting"|"running"|"done"|"error";
  runs_done: number;
  runs_total: number;
  eta_s: number;
  gpu_min_used: number;
  spot_usd_used: number;
  cells: CellResult[];
  gates: GateState[];
  aggregate: "PASS"|"FAIL"|"PENDING";
  report_url?: string;
  promote_eligible: boolean;
  error?: string;
};

const EMPTY: SweepSnapshot = {
  state: "connecting", runs_done: 0, runs_total: 0,
  eta_s: 0, gpu_min_used: 0, spot_usd_used: 0,
  cells: [], gates: [], aggregate: "PENDING", promote_eligible: false,
};

export function useSweepStream(runId: string): SweepSnapshot {
  const [snap, setSnap] = useState<SweepSnapshot>(EMPTY);
  const cellBuf = useRef<CellResult[]>([]);
  const flushT  = useRef<number | null>(null);

  useEffect(() => {
    const url = `${process.env.NEXT_PUBLIC_REHEARSE_API}/api/sweeps/${runId}/events`;
    const es  = new EventSource(url, { withCredentials: true });

    setSnap(s => ({ ...s, state: "running" }));

    const flushCells = () => {
      if (!cellBuf.current.length) return;
      const buf = cellBuf.current; cellBuf.current = [];
      setSnap(s => ({ ...s, cells: s.cells.concat(buf) }));
      flushT.current = null;
    };

    es.addEventListener("progress", (e: any) => {
      const m = JSON.parse(e.data);
      setSnap(s => ({ ...s, runs_done: m.runs_done, runs_total: m.runs_total,
                            eta_s: m.eta_s, gpu_min_used: m.gpu_min_used,
                            spot_usd_used: m.spot_usd_used }));
    });

    es.addEventListener("cell", (e: any) => {
      const m = JSON.parse(e.data);
      cellBuf.current.push(m.cell);
      // Coalesce up to 50 ms — keeps the chart from re-rendering every 30 ms.
      if (flushT.current == null) flushT.current = window.setTimeout(flushCells, 50);
    });

    es.addEventListener("gates", (e: any) => {
      const m = JSON.parse(e.data);
      setSnap(s => ({ ...s, gates: m.gates, aggregate: m.aggregate }));
    });

    es.addEventListener("final", (e: any) => {
      const m = JSON.parse(e.data);
      flushCells();
      setSnap(s => ({ ...s, state: "done", aggregate: m.aggregate,
                            report_url: m.report_url, promote_eligible: m.promote_eligible }));
      es.close();
    });

    es.addEventListener("error", (e: any) => {
      const data = (e as MessageEvent).data;
      setSnap(s => ({ ...s, state: "error", error: data ? JSON.parse(data).message : "stream lost" }));
      es.close();
    });

    return () => { es.close(); if (flushT.current) clearTimeout(flushT.current); };
  }, [runId]);

  return snap;
}
