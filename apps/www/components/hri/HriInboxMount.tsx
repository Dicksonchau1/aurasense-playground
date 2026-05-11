"use client";
import { useEffect, useState } from "react";
import { HriInbox } from "@aurasense/hri-core/react";
import { bootstrapHri } from "@/lib/hri-bootstrap";
import { createClient } from "@/lib/supabase/client";

export function HriInboxMount() {
  const [ready, setReady] = useState<{ sessionId: string; operatorId: string } | null>(null);

  useEffect(() => {
    bootstrapHri();
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        const sessionId = sessionStorage.getItem("nepa.session_id") ?? crypto.randomUUID();
        sessionStorage.setItem("nepa.session_id", sessionId);
        setReady({ sessionId, operatorId: data.user.id });
      }
    });
  }, []);

  if (!ready) return null;
  return <HriInbox sessionId={ready.sessionId} operatorId={ready.operatorId} />;
}"use client";
import { useEffect, useState } from "react";
import { HriInbox } from "@aurasense/hri-core/react";
import { bootstrapHri } from "@/lib/hri-bootstrap";
import { createClient } from "@/lib/supabase/client";

export function HriInboxMount() {
  const [ready, setReady] = useState<{ sessionId: string; operatorId: string } | null>(null);

  useEffect(() => {
    bootstrapHri();
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        const sessionId =
          sessionStorage.getItem("nepa.session_id") ?? crypto.randomUUID();
        sessionStorage.setItem("nepa.session_id", sessionId);
        setReady({ sessionId, operatorId: data.user.id });
      }
    });
  }, []);

  if (!ready) return null;
  return <HriInbox sessionId={ready.sessionId} operatorId={ready.operatorId} />;
}
