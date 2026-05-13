"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import Card from "@/components/shell/Card";
import Field from "@/components/shell/Field";
import Button from "@/components/shell/Button";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const redirectTo = params.get("redirectTo") || "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      router.push(redirectTo);
      router.refresh();
    } catch (e: any) {
      setErr(e?.message ?? "Sign in failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md">
      <h1 className="aura-h1 mb-1">Sign in</h1>
      <p className="aura-sub mb-5">Access AuraSense Playground.</p>
      <form onSubmit={onSubmit} className="space-y-4">
        <Field name="email" label="Email" type="email" required autoComplete="email"
          value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@aurasensehk.com" />
        <Field name="password" label="Password" type="password" required autoComplete="current-password"
          value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
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
  );
}

export default function LoginPage() {
  return (
    <div className="grid place-items-center min-h-[480px]">
      <Suspense fallback={<Card className="w-full max-w-md"><p className="aura-sub">Loading…</p></Card>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
