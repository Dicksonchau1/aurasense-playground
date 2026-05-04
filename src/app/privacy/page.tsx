'use client'

export default function Privacy() {
  return (
    <main className="min-h-dvh pt-16 pb-12 px-4" style={{ background: '#070e1a', color: 'white' }}>
      <article className="max-w-3xl mx-auto prose-invert">
        <p className="text-[10px] font-mono uppercase tracking-widest" style={{ color: '#10b981' }}>
          Privacy Policy
        </p>
        <h1 className="text-3xl font-bold mt-1 mb-2">Privacy Policy</h1>
        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>Last updated: 4 May 2026</p>

        <section className="mt-6 space-y-4 text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.85)' }}>
          <h2 className="text-lg font-semibold mt-6" style={{ color: '#10b981' }}>1. What we collect</h2>
          <p>
            <strong>Account:</strong> email address (for magic-link auth via Supabase). No passwords stored.<br/>
            <strong>Inference frames:</strong> JPEG bytes you upload or click-capture, processed in-memory and stored privately if you have a Pro/Team plan. Frame storage is per-user, RLS-protected, never shared.<br/>
            <strong>Audit chain:</strong> SHA-256 hashes of inference results, your plan, and timestamps. Tamper-evident log.<br/>
            <strong>Billing:</strong> handled by Stripe. We never store card numbers.
          </p>

          <h2 className="text-lg font-semibold mt-6" style={{ color: '#10b981' }}>2. What we never do</h2>
          <p>
            We <strong>never</strong> perform face recognition, biometric identification, or person re-identification. NEPA detects movement-based anomalies via world-model prediction error, not identity. We <strong>never</strong> train on your data.
          </p>

          <h2 className="text-lg font-semibold mt-6" style={{ color: '#10b981' }}>3. Where data lives</h2>
          <p>
            <strong>Supabase:</strong> auth + audit chain + frame storage, hosted in Singapore region.<br/>
            <strong>Stripe:</strong> billing, hosted by Stripe Inc.<br/>
            <strong>Vercel:</strong> the playground frontend, hosted in HK region.<br/>
            <strong>Edge runtime:</strong> a Jetson Nano in Kowloon, HK. Frames are processed in-memory and discarded.
          </p>

          <h2 className="text-lg font-semibold mt-6" style={{ color: '#10b981' }}>4. Your rights</h2>
          <p>
            Email <a href="mailto:privacy@aurasensehk.com" style={{ color: '#10b981' }}>privacy@aurasensehk.com</a> to:
            request a copy of your data, delete your account, or revoke consent. We respond within 7 days.
          </p>

          <h2 className="text-lg font-semibold mt-6" style={{ color: '#10b981' }}>5. Cookies</h2>
          <p>
            We use Supabase's session cookie (HTTP-only, secure) for authentication. We don't use marketing cookies, trackers, or analytics that profile you across sites.
          </p>

          <h2 className="text-lg font-semibold mt-6" style={{ color: '#10b981' }}>6. Contact</h2>
          <p>
            AuraSense Ltd<br/>
            Kowloon, Hong Kong<br/>
            <a href="mailto:privacy@aurasensehk.com" style={{ color: '#10b981' }}>privacy@aurasensehk.com</a>
          </p>
        </section>
      </article>
    </main>
  )
}
