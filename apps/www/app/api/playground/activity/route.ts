import { NextResponse } from "next/server";

// Replace with your real backend URL
const BACKEND_ACTIVITY_URL = process.env.AURASENSE_BACKEND_ACTIVITY_URL || "http://localhost:8000/activity";

const mockActivity = [
  {
    title: "Handwash Session",
    category: "rehearse",
    timestamp: "08:12",
    status: "completed",
    href: "/rehearse/session/handwash",
  },
  {
    title: "ICC Tower Mission Draft",
    category: "drone",
    timestamp: "07:48",
    status: "review ready",
    href: "/drone/mission/icc-tower-draft",
  },
  {
    title: "Robotics Mock Telemetry Run",
    category: "robotics",
    timestamp: "07:22",
    status: "active",
    href: "/robotics/session/mock-telemetry",
  },
  {
    title: "Fall Risk Assessment Session",
    category: "rehearse",
    timestamp: "yesterday",
    status: "signed",
    href: "/rehearse/session/fall-risk",
  },
  {
    title: "Facade Route Replay",
    category: "drone",
    timestamp: "yesterday",
    status: "archived",
    href: "/drone/mission/facade-replay",
  },
];

export async function GET() {
  try {
    const res = await fetch(BACKEND_ACTIVITY_URL, { timeout: 2000 });
    if (!res.ok) throw new Error("Backend error");
    const data = await res.json();
    return NextResponse.json(data);
  } catch (e) {
    // Fallback to mock data if backend is unavailable
    return NextResponse.json(mockActivity);
  }
}
