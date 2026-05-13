import { NextRequest, NextResponse } from "next/server";
import { updateSession } from "./src/lib/supabase/middleware";

const PROTECTED_PREFIXES = ["/attas", "/robotics", "/rehearse-3d"];

export async function middleware(request: NextRequest) {
  const response = await updateSession(request);
  const pathname = request.nextUrl.pathname;

  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix + "/")
  );

  if (!isProtected) return response;

  const hasSbCookie = request.cookies
    .getAll()
    .some((cookie) => cookie.name.startsWith("sb-"));

  if (hasSbCookie) return response;

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("redirect", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    "/attas/:path*",
    "/robotics/:path*",
    "/rehearse-3d/:path*",
  ],
};
