'use client'
import React, { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Mail, LogOut, Shield, ImageIcon } from 'lucide-react'

interface AuditRow {
  id: string
  pipeline: string
  source: string | null
  region: string | null
  image_sha256: string | null
  image_path: string | null
  detections: any
  world_model: any
  row_hash: string
  prev_hash: string
  created_at: string
}

export default function Portal() {
  const sb = createClient()
  const [email, setEmail] = useState('')
  const [user, setUser] = useState<any>(null)
  const [rows, setRows] = useState<AuditRow[]>([])
  const [thumbs, setThumbs] = useState<Record<string, string>>({})
  const [sent, setSent] = useState(false)

  useEffect(() => { sb.auth.getUser().then(({ data }) => setUser(data.user)) }, [])

  useEffect(() => {
    if (!user) return
    sb.from('nepa_audit').select('*').order('created_at', { ascending: false }).limit(50)
      .then(({ data }) => setRows((data ?? []) as any))
  }, [user])

  // Signed thumbnails
  useEffect(() => {
    rows.forEach(async r => {
      if (!r.image_path || thumbs[r.id]) return
      const { data } = await sb.storage.from('nepa-frames').createSignedUrl(r.image_path, 300)
      if (data?.signedUrl) setThumbs(t => ({ ...t, [r.id]: data.signedUrl }))
    })
  }, [rows])

  async function sendMagicLink() {
    await sb.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${location.origin}/auth/callback` },
    })
    setSent(true)
  }
  async function signOut() { await sb.auth.signOut(); setUser(null); setRows([]) }

  return (
    <main className="min-h-dvh pt-16 pb-12 px-4" style={{ background: '#070e1a', color: 'white' }}>
      <section className="max-w-5xl mx-auto">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-4 h-4" style={{ color: '#10b981' }} />
          <h1 className="text-2xl font-bold">Portal · Audit Chain</h1>
        </div>

        {!user ? (
          <div className="rounded-2xl p-6 max-w-md"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(16,185,129,0.2)' }}>
            <p className="text-sm mb-3" style={{ color: 'rgba(255,255,255,0.75)' }}>
              Sign in to view your tamper-evident NEPA audit log.
            </p>
            <div className="flex gap-2">
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@auras.ai"
                className="flex-1 px-3 py-2 rounded-lg text-xs outline-none"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'white' }} />
              <button onClick={sendMagicLink}
                className="px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5"
                style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', color: '#10b981' }}>
                <Mail className="w-3 h-3" /> Send link
              </button>
            </div>
            {sent && <p className="text-[11px] mt-2" style={{ color: '#10b981' }}>Magic link sent — check your inbox.</p>}
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-4 px-3 py-2 rounded-lg"
              style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.18)' }}>
              <p className="text-xs flex-1">{user.email}</p>
              <button onClick={signOut} className="text-[10px] flex items-center gap-1"
                style={{ color: 'rgba(255,255,255,0.6)' }}>
                <LogOut className="w-3 h-3" /> Sign out
              </button>
            </div>

            <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: 'rgba(16,185,129,0.7)' }}>
              Recent inferences ({rows.length})
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {rows.map(r => (
                <div key={r.id} className="rounded-xl p-3 flex gap-3"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <div className="w-20 h-20 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden"
                    style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(16,185,129,0.18)' }}>
                    {thumbs[r.id]
                      ? <img src={thumbs[r.id]} alt="" className="w-full h-full object-cover" />
                      : <ImageIcon className="w-5 h-5" style={{ color: 'rgba(255,255,255,0.3)' }} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold" style={{ color: '#10b981' }}>
                      {r.pipeline} · {r.source ?? '—'} · {r.region ?? '—'}
                    </p>
                    <p className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.55)' }}>
                      {(r.detections?.length ?? 0)} signals · pred-err {r.world_model?.prediction_error ?? '—'}
                    </p>
                    <p className="text-[9px] font-mono mt-1 truncate" style={{ color: 'rgba(255,255,255,0.35)' }}>
                      {r.row_hash.slice(0, 24)}…
                    </p>
                    <p className="text-[9px] mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
                      {new Date(r.created_at).toLocaleString('en-HK')}
                    </p>
                  </div>
                </div>
              ))}
              {rows.length === 0 && (
                <p className="text-[11px] col-span-full" style={{ color: 'rgba              {rows.length === 0 && (
                <p className="text-[11px] col-span-full" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  No inferences yet. Click any frame on Hero, Drone, or Rehearse to start your audit chain.
                </p>
              )}
            </div>

            <details className="mt-6 rounded-xl p-3"
              style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <summary className="text-[11px] font-semibold cursor-pointer" style={{ color: 'rgba(255,255,255,0.85)' }}>
                Verify chain integrity
              </summary>
              <p className="text-[10px] mt-2 leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
                Each row's de>row_hash</code> = SHA-256(de>prev_hash</code> || canonical_row_json).
                If any row is tampered with, every subsequent hash breaks — making the log tamper-evident.
                Use de>scripts/verify-chain.ts</code> to walk the chain end-to-end.
              </p>
            </details>
          </>
        )}
      </section>
    </main>
  )
}
