import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export default async function PostLogin() {
  const sb = supabaseServer();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) redirect("/login");
  const { data: prof } = await sb.from("profiles").select("role").eq("id", user.id).maybeSingle();
  const role = prof?.role ?? "student";
  if (role === "instructor" || role === "admin") redirect("/cohort");
  redirect("/rehearse-nurse");
}
