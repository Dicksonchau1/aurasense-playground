# Wire membership-drawer CTAs to Stripe

In src/components/membership-drawer.tsx, REPLACE the existing CTA button onClick:

```tsx
onClick={async (e) => {
  e.stopPropagation()
  if (plan.key === 'starter')    return
  if (plan.key === 'enterprise') { window.location.href = 'mailto:sales@aurasense.ai?subject=Enterprise%20inquiry'; return }
  try {
    const res = await fetch('/api/billing/checkout', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ plan: plan.key, annual }),
    })
    const j = await res.json()
    if (j.ok && j.url) { window.location.href = j.url; return }
    if (j.error === 'auth_required')        { window.location.href = '/portal?signin=1'; return }
    if (j.error === 'stripe_not_configured') alert('Stripe is not configured yet — set keys in .env.local')
    else alert('Checkout failed: ' + (j.error ?? 'unknown'))
  } catch (err) {
    alert('Checkout error: ' + (err as Error).message)
  }
}}
```

Also add a small usage strip BELOW the trust strip that fetches /api/billing/me and shows progress for starter/pro:

```tsx
const [me, setMe] = useState<any>(null)
useEffect(() => {
  if (!isOpen) return
  fetch('/api/billing/me').then(r => r.json()).then(setMe).catch(() => {})
}, [isOpen])

{me?.authenticated && (
  <div className="px-3 py-2 rounded-lg space-y-1"
    style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)' }}>
    <div className="flex items-center justify-between text-[10px]">
      <span style={{ color:'rgba(255,255,255,0.6)' }}>Today · {me.plan.toUpperCase()}</span>
      <span style={{ color:'#10b981' }}>
        {me.usage_today?.frames ?? 0}{me.quota.frames_per_day === -1 ? '' : ` / ${me.quota.frames_per_day}`} frames
      </span>
    </div>
    {me.quota.frames_per_day !== -1 && (
      <div className="h-1 rounded" style={{ background:'rgba(255,255,255,0.08)' }}>
        <div className="h-full rounded" style={{
          width: `${Math.min(100, ((me.usage_today?.frames ?? 0) / me.quota.frames_per_day) * 100)}%`,
          background: '#10b981',
        }} />
      </div>
    )}
  </div>
)}
```
