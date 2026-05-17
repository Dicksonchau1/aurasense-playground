
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function logEvent(event: string, details: any) {
  // TODO: Integrate with Application Insights or Sentry
  console.info(`[NurseRehearse][START] ${event}`, details);
}

export async function POST() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const sessionId = `nrs_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  try {
    const { error } = await supabase.from("nurse_rehearse_sessions").insert({
      session_id: sessionId,
      module: "hand_hygiene",
      state: "active",
      started_at: new Date().toISOString(),
    });
    if (error) {
      logEvent("session_start_error", { sessionId, error: error.message });
      return NextResponse.json({ error: "Failed to start session" }, { status: 500 });
    }
    logEvent("session_started", { sessionId });
    return NextResponse.json({ sessionId, module: "hand_hygiene", state: "active" });
  } catch (e: any) {
    logEvent("session_start_exception", { sessionId, error: e?.message || e });
    return NextResponse.json({ error: "Exception during session start" }, { status: 500 });
  }
}
