"use client";
import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabase-browser";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent]   = useState(false);
  const [err, setErr]     = useState<string|null>(null);
  const [busy, setBusy]   = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true); setErr(null);
    const sb = supabaseBrowser();
    const redirectTo = `${window.location.origin}/auth/callback`;
    const { error } = await sb.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectTo, shouldCreateUser: true }
    });
    setBusy(false);
    if (error) setErr(error.message); else setSent(true);
  };

  return (
    <div style={{minHeight:"100vh", display:"grid", placeItems:"center", background:"var(--bg,#0b0f14)", color:"var(--text,#e6edf5)", fontFamily:"Inter,system-ui,sans-serif"}}>
      <form onSubmit={submit} style={{width:380, background:"var(--panel,#121821)", border:"1px solid var(--line,#1e2734)", borderRadius:14, padding:24}}>
        <div style={{display:"flex", gap:10, alignItems:"center", marginBottom:14}}>
          <div style={{width:34, height:34, borderRadius:8, background:"linear-gradient(135deg,#5eead4,#38bdf8)", display:"grid", placeItems:"center", color:"#06121a", fontWeight:800}}>AS</div>
          <div>
            <div style={{fontWeight:700}}>AuraSense Playground</div>
            <div style={{fontSize:12, color:"var(--muted,#8a97a8)"}}>Magic-link sign in</div>
          </div>
        </div>
        {!sent && (
          <>
            abel style={{fontSize:12, color:"var(--muted,#8a97a8)"}}>Email</label>
            <input value={email} onChange={e=>setEmail(e.target.value)} type="email" required placeholder="you@polyu.edu.hk"
              style={{width:"100%", padding:"10px 12px", borderRadius:10, border:"1px solid var(--line,#1e2734)", background:"#0f141c", color:"inherit", margin:"6px 0 12px"}}/>
            <button disabled={busy || !email} style={{width:"100%", padding:"10px 12px", borderRadius:10, border:0, background:"linear-gradient(135deg,#5eead4,#38bdf8)", color:"#06121a", fontWeight:700, cursor:"pointer"}}>
              {busy ? "Sending…" : "Send magic link"}
            </button>
            {err && <div style={{marginTop:10, color:"#ef4444", fontSize:13}}>{err}</div>}
          </>
        )}
        {sent && (
          <div style={{fontSize:14, lineHeight:1.5}}>
            Check <b>{email}</b> for a sign-in link. You can close this tab; opening the link will return you to AuraSense.
          </div>
        )}
        <div style={{marginTop:14, fontSize:11, color:"var(--muted,#8a97a8)"}}>By signing in you agree to AuraSense Playground terms.</div>
      </form>
    </div>
  );
}
