export default function Privacy() {
  return (
    <main className="min-h-dvh pt-16 pb-12 px-4" style={{ background: '#070e1a', color: 'white' }}>
      <article className="max-w-3xl mx-auto">
        <p className="text-[10px] font-mono uppercase tracking-widest" style={{ color: '#10b981' }}>
          Privacy Policy
        </p>
        <h1 className="text-3xl font-bold mt-1 mb-2">Privacy Policy</h1>
        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>Last updated: 4 May 2026</p>

        <section className="mt-6 space-y-4 text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.85)' }}>
          <h2 className="text-lg font-semibold mt-6" style={{ color: '#10b981' }}>1. What we collect</h2>
          <p><strong>Account:</strong> email for magic-link auth via Supabase. No passwords stored.</p>
          <p><strong>Inference frames:</strong> JPEG bytes processed in-memory; only stored in your private bucket if you sign in. RLS-protected per user.</p>
          <p><strong>Audit chain:</strong> SHA-256 hashes, plan, timestamps. Tamper-evident log.</p>
          <p><strong>Billing:</strong> handled by Stripe. We never see your card number.</p>

          <h2 className="text-lg font-semibold mt-6" style={{ color: '#10b981' }}>2. What we never do</h2>
          <p>We <strong>never</strong> perform face recognition, biometric ID, or person re-identification. NEPA detects movement-based anomalies via world-model prediction error — not identity. We <strong>never</strong> train on your data.</p>

          <h2 className="text-lg font-semibold mt-6" style={{ color: '#10b981' }}>3. Data location</h2>
          <p>Supabase (Singapore region) for auth + audit + storage. Stripe for billing. Vercel HKG1 for the app. Edge runtime on a Jetson Nano in Kowloon, HK.</p>

          <h2 className="text-lg font-semibold mt-6" style={{ color: '#10b981' }}>4. Your rights</h2>
          <p>Email <a href="mailto:privacy@aurasensehk.com" style={{ color: '#10b981' }}>privacy@aurasensehk.com</a> to access, delete, or export your data. We respond within 7 days.</p>

          <h2 className="text-lg font-semibold mt-6" style={{ color: '#10b981' }}>5. Cookies</h2>
          <p>Only Supabase&apos;s HTTP-only session cookie. No marketing trackers, no cross-site profiling.</p>

          <h2 className="text-lg font-semibold mt-6" style={{ color: '#10b981' }}>6. Contact</h2>
          <p>AuraSense Ltd, Kowloon, Hong Kong. <a href="mailto:privacy@aurasensehk.com" style={{ color: '#10b981' }}>privacy@aurasensehk.com</a></p>
        </section>
      </article>
    </main>
  )
}
