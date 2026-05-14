"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getSupabaseClient } from "../../utils/supabaseClient";
import Card from "../../components/shell/Card";
import Field from "../../components/shell/Field";
import Button from "../../components/shell/Button";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      router.push("/");
      router.refresh();
    } catch (e: any) {
      setErr(e?.message ?? "Sign in failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid place-items-center min-h-[480px]">
      <Card className="w-full max-w-md">
        <h1 className="aura-h1 mb-1">Sign in</h1>
        <p className="aura-sub mb-5">Access AuraSense Playground.</p>
        <form onSubmit={onSubmit} className="space-y-4">
          <Field
            name="email"
            label="Email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@aurasensehk.com"
          />
          <Field
            name="password"
            label="Password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
          {err && (
            <div className="aura-panel" style={{ background: "rgba(185,28,28,0.08)", borderColor: "rgba(185,28,28,0.2)", color: "#7f1d1d" }}>
              {err}
            </div>
          )}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Signing in…" : "Sign in"}
          </Button>
        </form>
        <p className="aura-sub text-center mt-5">
          No account? <Link href="/register" className="aura-link">Register</Link>
        </p>
      </Card>
    </div>
  );
}
