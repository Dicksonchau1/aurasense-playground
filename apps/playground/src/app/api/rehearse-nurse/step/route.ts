import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { sessionId, stepIndex, stepLabel } = await req.json();
  // Call NEPA perception service for real feedback
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
      console.warn("NEPA unreachable, using fallback feedback");
    }
  }
  return NextResponse.json({ sessionId, stepIndex, feedback, pose });
}
