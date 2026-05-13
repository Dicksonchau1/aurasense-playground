import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { logger } from "@/lib/logger";

const NEPA = process.env.NEPA_API_URL!;
const SVC = process.env.NEPA_SERVICE_TOKEN!;

async function forward(req: NextRequest, params: { path: string[] }) {
  const t0 = Date.now();
  const supabase = createClient();
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  const path = params.path.join("/");
  const url = `${NEPA}/api/nepa/v1/hri/${path}${req.nextUrl.search}`;

  const upstream = await fetch(url, {
    method: req.method,
    headers: {
      "Content-Type": "application/json",
      "X-Service-Token": SVC,
      "X-User-Id": data.session?.user.id ?? "anon",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: req.method === "POST" ? await req.text() : undefined,
  });

  logger.info({
    route: "hri_proxy",
    path,
    method: req.method,
    status: upstream.status,
    duration_ms: Date.now() - t0,
    user_id: data.session?.user.id,
  });

  if (upstream.headers.get("content-type")?.includes("text/event-stream")) {
    return new NextResponse(upstream.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no",
      },
    });
  }

  const body = await upstream.text();
  return new NextResponse(body, {
    status: upstream.status,
    headers: {
      "Content-Type": upstream.headers.get("content-type") ?? "application/json",
    },
  });
}

export const GET = (req: NextRequest, ctx: { params: { path: string[] } }) =>
  forward(req, ctx.params);
export const POST = (req: NextRequest, ctx: { params: { path: string[] } }) =>
  forward(req, ctx.params);
