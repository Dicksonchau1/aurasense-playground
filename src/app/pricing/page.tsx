export const dynamic = 'force-dynamic'

export default function PricingPage() {
  const plans = [
    { name: 'Starter', price: 'Free', current: true },
    { name: 'Student', price: 'HK$88/mo' },
    { name: 'Pro', price: 'HK$388/mo' },
    { name: 'Team', price: 'HK$1288/mo' },
    { name: 'Enterprise', price: 'Custom' },
  ]
  return (
    <main style={{ minHeight: '100vh', background: '#070e1a', color: '#e6edf3', padding: 32, fontFamily: 'system-ui' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <h1 style={{ fontSize: 32, fontWeight: 700 }}>AuraSense Pricing</h1>
        <p style={{ color: '#8b949e', marginTop: 8 }}>Upgrade to unlock Attas dashboard and unlimited rehearse sessions.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginTop: 32 }}>
          {plans.map(p => (
            <div key={p.name} style={{ background: '#0d1117', border: p.current ? '1px solid #10b981' : '1px solid #30363d', borderRadius: 12, padding: 20 }}>
              <div style={{ fontSize: 11, color: '#8b949e', textTransform: 'uppercase' }}>{p.name}</div>
              <div style={{ fontSize: 22, fontWeight: 700, margin: '8px 0' }}>{p.price}</div>
              <button style={{ width: '100%', padding: '8px', borderRadius: 6, background: 'rgba(16,185,129,0.15)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)', fontSize: 12 }}>
                {p.current ? 'Current' : 'Upgrade'}
              </button>
            </div>
          ))}
        </div>
        <p style={{ marginTop: 32, fontSize: 11, color: '#8b949e', textAlign: 'center' }}>
          Contact dickson@aurasensehk.com for enterprise.
        </p>
      </div>
    </main>
  )
}
