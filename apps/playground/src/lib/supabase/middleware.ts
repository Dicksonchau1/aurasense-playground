import { NextRequest, NextResponse } from "next/server";

// Lightweight session refresher — full SSR cookie sync deferred to v0.4
export async function updateSession(request: NextRequest): Promise<NextResponse> {
  const response = NextResponse.next({ request: { headers: request.headers } });
  // Pass through cookies untouched; client-side Supabase handles refresh.
  const authCookie = request.cookies.get("sb-access-token");
  if (authCookie) {
    response.headers.set("x-aura-auth", "present");
  }
  return response;
}
