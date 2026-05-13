import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { DroneInput } from "@/lib/drones/types";

export const dynamic = "force-dynamic";

interface Ctx { params: { id: string } }

export async function GET(_req: NextRequest, { params }: Ctx) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("drones")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json({ drone: data });
}

export async function PATCH(req: NextRequest, { params }: Ctx) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  let body: Partial<DroneInput>;
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "invalid_json" }, { status: 400 }); }

  const patch: Record<string, unknown> = {};
  for (const k of ["name", "model", "serial", "status", "max_alt_m", "max_speed_ms", "battery_wh", "capabilities"] as const) {
    if (body[k] !== undefined) patch[k] = body[k];
  }
  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: "no fields to update" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("drones")
    .update(patch)
    .eq("id", params.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ drone: data });
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { error } = await supabase.from("drones").delete().eq("id", params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
