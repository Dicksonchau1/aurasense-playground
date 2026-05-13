import { NextResponse } from "next/server";

// Mock Robotics backend capability
export async function GET() {
  return NextResponse.json({
    status: "ok",
    telemetry: {
      battery: 87,
      position: { x: 1.2, y: 3.4, z: 0.0 },
      status: "operational"
    }
  });
}
