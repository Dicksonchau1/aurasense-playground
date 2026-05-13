import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { DroneInput } from "@/lib/drones/types";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("drones")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ drones: data });
}

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  let body: DroneInput;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  if (!body.name?.trim() || !body.model?.trim() || !body.serial?.trim()) {
    return NextResponse.json(
      { error: "name, model, and serial are required" },
      { status: 400 }
    );
  }

  const payload = {
    owner_id: user.id,
    name: body.name.trim(),
    model: body.model.trim(),
    serial: body.serial.trim(),
    status: body.status ?? "registered",
    max_alt_m: body.max_alt_m ?? 120,
    max_speed_ms: body.max_speed_ms ?? 15,
    battery_wh: body.battery_wh ?? 0,
    capabilities: body.capabilities ?? {},
  };

  const { data, error } = await supabase
    .from("drones")
    .insert(payload)
    .select()
    .single();

  if (error) {
    const status = error.code === "23505" ? 409 : 500;
    return NextResponse.json({ error: error.message }, { status });
  }
  return NextResponse.json({ drone: data }, { status: 201 });
}
