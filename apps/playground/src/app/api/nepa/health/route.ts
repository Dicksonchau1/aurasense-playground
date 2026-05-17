import { NextResponse } from "next/server";
import { nepaFetch } from "@/lib/nepa";

export const dynamic = "force-dynamic";

export async function GET() {
  const r = await nepaFetch("/health");
  const data = await r.json().catch(() => ({}));
  return NextResponse.json(data, { status: r.status });
}
