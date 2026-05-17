
import { NextRequest, NextResponse } from "next/server";

function logEvent(event: string, details: any) {
  // TODO: Integrate with Application Insights or Sentry
  console.info(`[NurseRehearse][STEP] ${event}`, details);
}

  try {
    const { sessionId, stepIndex, stepLabel } = await req.json();
    const nepaUrl = process.env.NEPA_API_URL;
    let feedback = "Step accepted.";
    let pose = null;
    if (nepaUrl) {
      try {
        const r = await fetch(`${nepaUrl}/perceive`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId, step: stepLabel }),
        });
        if (r.ok) {
          const j = await r.json();
          feedback = j.feedback ?? feedback;
          pose = j.pose ?? null;
        }
      } catch (e) {
        logEvent("nepa_unreachable", { sessionId, stepIndex, stepLabel, error: e?.message || e });
      }
    }
    logEvent("step_completed", { sessionId, stepIndex, stepLabel, feedback });
    return NextResponse.json({ sessionId, stepIndex, feedback, pose });
  } catch (e: any) {
    logEvent("step_exception", { error: e?.message || e });
    return NextResponse.json({ error: "Exception during step" }, { status: 500 });
  }
}
