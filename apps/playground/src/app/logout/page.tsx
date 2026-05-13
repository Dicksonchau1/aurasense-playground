"use client";

export const dynamic = "force-dynamic";

import { useEffect } from "react";
import { getSupabaseClient } from "../../utils/supabaseClient";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const supabase = getSupabaseClient();
    supabase.auth.signOut().finally(() => router.push("/login"));
  }, [router]);

  return (
    <main className="flex items-center justify-center min-h-screen">
      <div className="text-lg">Signing out...</div>
    </main>
  );
}
