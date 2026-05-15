import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import WaypointEditor from "@/components/waypoints/WaypointEditor";

export const dynamic = "force-dynamic";

export default async function AttasWaypointsPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?redirectTo=/attas/waypoints");

  const { data: drones } = await supabase
    .from("drones")
    .select("id, name, max_alt_m, max_speed_ms, battery_wh")
    .neq("status", "retired")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <header>
        <h1 className="aura-h1">ATTAS · Waypoint Editor</h1>
        <p className="aura-sub mt-1">
          Edit a mission's waypoints, validate on demand against drone capabilities and airspace constraints. Rows colour-code per validation state.
        </p>
      </header>
      <WaypointEditor />
    </div>
  );
}
