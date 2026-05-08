export default function Terms() {
  return (
    <main className="min-h-dvh pt-16 pb-12 px-4" style={{ background: '#070e1a', color: 'white' }}>
      <article className="max-w-3xl mx-auto">
        <p className="text-[10px] font-mono uppercase tracking-widest" style={{ color: '#10b981' }}>
          Terms of Service
        </p>
        <h1 className="text-3xl font-bold mt-1 mb-2">Terms of Service</h1>
        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>Last updated: 4 May 2026</p>

        <section className="mt-6 space-y-4 text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.85)' }}>

          <h2 className="text-lg font-semibold mt-6" style={{ color: '#10b981' }}>1. Use of service</h2>
          <p>
            AuraSense Ltd (&ldquo;AuraSense&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) provides AI perception infrastructure under the brand NEPA.
            By accessing playground.aurasensehk.com or any AuraSense API, you agree to these Terms.
            You may use the service for any lawful purpose, subject to your plan&apos;s quota.
            You may not use it for biometric surveillance, facial recognition, or person re-identification — the system refuses such workloads by design.
          </p>

          <h2 className="text-lg font-semibold mt-6" style={{ color: '#10b981' }}>2. Plans &amp; pricing</h2>
          <p>
            <strong>Starter</strong> — Free. 500 frames/day. Community support.<br/>
            <strong>NEPA Pro</strong> — HK$ 388/month. Unlimited frames. World Model + STDP API. Audit chain. 24h email support.<br/>
            <strong>Team</strong> — HK$ 1,288/month per seat. Up to 10 seats. Webhooks, RBAC, Slack Connect.<br/>
            <strong>Enterprise</strong> — Custom annual. Self-hosted runtime, on-prem deploy, SOC2 docs, 99.95% SLA.
          </p>
          <p>
            All paid plans bill monthly via Stripe. Cancel anytime; access continues until end of paid period. Annual plans receive a 10% discount.
            Hong Kong / Singapore tax handled at checkout. We may adjust pricing with 30 days&apos; notice.
          </p>

          <h2 className="text-lg font-semibold mt-6" style={{ color: '#10b981' }}>3. Service level</h2>
          <p>
            Starter and Pro: best-effort, no SLA.
            Team: 99.5% monthly uptime target. Enterprise: 99.95% uptime SLA per signed contract.
            Scheduled maintenance announced 24h ahead via email and the status page.
          </p>

          <h2 className="text-lg font-semibold mt-6" style={{ color: '#10b981' }}>4. Refunds</h2>
          <p>
            Pro / Team: monthly fees are non-refundable, but you may cancel anytime to stop the next billing cycle.
            Annual plans: pro-rated refunds available within the first 14 days.
            Enterprise: refunds per contract.
          </p>

          <h2 className="text-lg font-semibold mt-6" style={{ color: '#10b981' }}>5. Acceptable use</h2>
          <p>
            You agree not to: (a) attempt to identify individuals from inference output;
            (b) reverse-engineer the runtime or extract model weights;
            (c) use the service to generate, train on, or store biometric data;
            (d) circumvent quota limits via multiple free accounts;
            (e) use the service for unlawful surveillance or harassment.
            Violations may result in immediate suspension without refund.
          </p>

          <h2 className="text-lg font-semibold mt-6" style={{ color: '#10b981' }}>6. Intellectual property</h2>
          <p>
            You retain all rights to your data, frames, and inference outputs.
            We retain all rights to the AuraSense platform, NEPA runtime, and World Model.
            Aggregate, anonymous performance metrics may be used to improve the service — never tied to your account or shared with third parties.
          </p>

          <h2 className="text-lg font-semibold mt-6" style={{ color: '#10b981' }}>7. Privacy</h2>
          <p>
            Data handling is governed by our <a href="/privacy" style={{ color: '#10b981' }}>Privacy Policy</a>.
            We never train on your data. We never perform biometric identification.
            Inference frames are processed in-memory at the edge runtime and discarded unless you have explicitly enabled audit-chain storage.
          </p>

          <h2 className="text-lg font-semibold mt-6" style={{ color: '#10b981' }}>8. Liability</h2>
          <p>
            The service is provided &ldquo;as is&rdquo;. AuraSense is not liable for indirect, incidental, or consequential damages.
            Our total liability for any claim is capped at the fees you paid in the 12 months preceding the claim.
            Nothing in these Terms limits liability for fraud, gross negligence, or anything that cannot be lawfully limited.
          </p>

          <h2 className="text-lg font-semibold mt-6" style={{ color: '#10b981' }}>9. Termination</h2>
          <p>
            You may close your account anytime via the Portal. We may suspend or terminate accounts that violate these Terms,
            with reasonable notice except in cases of abuse or legal obligation. On termination, your data is deleted within 30 days
            unless you request earlier deletion or applicable law requires retention.
          </p>

          <h2 className="text-lg font-semibold mt-6" style={{ color: '#10b981' }}>10. Changes to these Terms</h2>
          <p>
            We may update these Terms with at least 30 days&apos; notice for material changes (sent to your account email).
            Continued use after the effective date constitutes acceptance.
          </p>

          <h2 className="text-lg font-semibold mt-6" style={{ color: '#10b981' }}>11. Governing law</h2>
          <p>
            These Terms are governed by the laws of Hong Kong SAR.
            Disputes are resolved by the courts of Hong Kong, except where mandatory consumer protection law of your residence applies.
          </p>

          <h2 className="text-lg font-semibold mt-6" style={{ color: '#10b981' }}>12. Contact</h2>
          <p>
            AuraSense Ltd<br/>
            Kowloon, Hong Kong<br/>
            <a href="mailto:legal@aurasensehk.com" style={{ color: '#10b981' }}>legal@aurasensehk.com</a> · <a href="mailto:support@aurasensehk.com" style={{ color: '#10b981' }}>support@aurasensehk.com</a>
          </p>

        </section>
      </article>
    </main>
  )
}
