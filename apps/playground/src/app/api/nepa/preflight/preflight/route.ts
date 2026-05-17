import { NextResponse } from "next/server";
import { nepaFetch } from "@/lib/nepa";

export async function GET() {
  const r = await nepaFetch("/api/v1/preflight");
  if (!r.ok) {
    return NextResponse.json({ error: "upstream", status: r.status }, { status: 502 });
  }
  const data = await r.json();
  return NextResponse.json(data);
}
