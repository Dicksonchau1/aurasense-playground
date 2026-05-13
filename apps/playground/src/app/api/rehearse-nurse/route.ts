import { NextResponse } from "next/server";

// Mock Rehearse-Nurse backend capability
export async function GET() {
  return NextResponse.json({
    status: "ok",
    session: {
      id: "mock-session-1",
      state: "active",
      feedback: "Good posture detected.",
      pose: { x: 0.5, y: 0.5, confidence: 0.98 }
    }
  });
}
