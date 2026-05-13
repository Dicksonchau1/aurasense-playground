import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const sessionId = `nrs_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const { error } = await supabase.from("nurse_rehearse_sessions").insert({
    session_id: sessionId,
    module: "hand_hygiene",
    state: "active",
    started_at: new Date().toISOString(),
  });
  if (error) console.warn("Supabase insert warn:", error.message);
  return NextResponse.json({ sessionId, module: "hand_hygiene", state: "active" });
}
