import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function logEvent(event: string, details: any) {
  // TODO: Integrate with Application Insights or Sentry
  console.info(`[NurseRehearse][COMPLETE] ${event}`, details);
}

export async function POST(req: NextRequest) {
  try {
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
    } catch (e: any) {
      logEvent("supabase_update_failed", { sessionId, error: e?.message || e });
    }
    logEvent("session_completed", { sessionId, verdict, anomalies: anomalies ?? [] });
    return NextResponse.json(result);
  } catch (e: any) {
    logEvent("session_complete_exception", { error: e?.message || e });
    return NextResponse.json({ error: "Exception during session complete" }, { status: 500 });
  }
}
