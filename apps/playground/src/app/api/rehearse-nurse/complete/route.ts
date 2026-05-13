import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  const { sessionId, steps, anomalies } = await req.json();
  const allDone = steps.every((s: any) => s.completed);
  const verdict = allDone && (!anomalies || anomalies.length === 0) ? "pass" : "hold";
  const result = {
    sessionId,
    verdict,
    summary: allDone ? "All steps completed." : "Some steps incomplete or anomalies detected.",
    steps,
    anomalies: anomalies ?? [],
    timestamp: new Date().toISOString(),
  };
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    await supabase.from("nurse_rehearse_sessions").update({
      state: "completed", verdict, completed_at: result.timestamp,
    }).eq("session_id", sessionId);
  } catch (e) { console.warn("Supabase update failed", e); }
  return NextResponse.json(result);
}
