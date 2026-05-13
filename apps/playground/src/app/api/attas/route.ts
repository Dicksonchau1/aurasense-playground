import { NextResponse } from "next/server";

// Mock ATTAS backend capability
export async function GET() {
  return NextResponse.json({
    status: "ok",
    overlays: [
      { id: 1, type: "policy", label: "No-fly zone", coordinates: [[0,0],[1,1],[2,2]] },
      { id: 2, type: "audit", label: "Inspection event", timestamp: Date.now() }
    ]
  });
}
