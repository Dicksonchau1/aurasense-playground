import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const PROTECTED = ["/rehearse-nurse", "/cohort"];

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const needsAuth = PROTECTED.some(p => req.nextUrl.pathname.startsWith(p));
  if (!needsAuth) return res;

  const sb = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: {
      get: (n)=>req.cookies.get(n)?.value,
      set: (n,v,o)=>res.cookies.set({ name:n, value:v, ...o }),
      remove: (n,o)=>res.cookies.set({ name:n, value:"", ...o, maxAge:0 })
    }}
  );
  const { data: { user } } = await sb.auth.getUser();
  if (!user) {
    const url = req.nextUrl.clone(); url.pathname = "/login"; url.searchParams.set("next", req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  // role gate for /cohort
  if (req.nextUrl.pathname.startsWith("/cohort")) {
    const { data: prof } = await sb.from("profiles").select("role").eq("id", user.id).maybeSingle();
    if (!prof || (prof.role !== "instructor" && prof.role !== "admin")) {
      const url = req.nextUrl.clone(); url.pathname = "/rehearse-nurse";
      return NextResponse.redirect(url);
    }
  }
  return res;
}

export const config = { matcher: ["/rehearse-nurse/:path*", "/cohort/:path*"] };
