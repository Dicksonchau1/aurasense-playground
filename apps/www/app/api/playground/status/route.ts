import { NextResponse } from "next/server";

// Replace with your real backend URL
const BACKEND_STATUS_URL = process.env.AURASENSE_BACKEND_STATUS_URL || "http://localhost:8000/status";

const mockStatus = [
  { label: "NEPA Runtime", value: "Online", tone: "good" },
  { label: "Supabase Sync", value: "Healthy", tone: "good" },
  { label: "Last Inference", value: "188 ms", tone: "neutral" },
  { label: "Signed Sessions (24h)", value: "42", tone: "neutral" },
  { label: "Deployment", value: "Jetson + Cloud", tone: "neutral" },
  { label: "Active Surface Count", value: "3", tone: "neutral" },
];

export async function GET() {
  try {
    const res = await fetch(BACKEND_STATUS_URL, { timeout: 2000 });
    if (!res.ok) throw new Error("Backend error");
    const data = await res.json();
    return NextResponse.json(data);
  } catch (e) {
    // Fallback to mock data if backend is unavailable
    return NextResponse.json(mockStatus);
  }
}
