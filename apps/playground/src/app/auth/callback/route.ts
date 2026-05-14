import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const cookieStore = cookies();
  const sb = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: {
      get: (n)=>cookieStore.get(n)?.value,
      set: (n,v,o)=>cookieStore.set({ name:n, value:v, ...o }),
      remove: (n,o)=>cookieStore.set({ name:n, value:"", ...o, maxAge:0 })
    }}
  );
  if (code) await sb.auth.exchangeCodeForSession(code);
  return NextResponse.redirect(new URL("/auth/post-login", url.origin));
}
