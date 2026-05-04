'use client'
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { X, Check, Zap, Crown, Building2, Sparkles, Shield, Cpu, Globe2, ArrowRight } from 'lucide-react'

type PlanKey = 'starter' | 'pro' | 'team' | 'enterprise'
interface Plan {
  key: PlanKey; name: string; price: string; cadence: string; tagline: string
  icon: any; accent: string; highlight?: boolean; features: string[]; cta: string
}

const PLANS: Plan[] = [
  { key:'starter', name:'Starter', price:'Free', cadence:'forever',
    tagline:'Explore NEPA on your laptop.', icon:Sparkles, accent:'rgba(148,163,184,0.7)',
    features:['1 device · 720p inference','500 frames / day','STDP playground (read-only)','Community Discord'],
    cta:'Current plan' },
  { key:'pro', name:'NEPA Pro', price:'HK$ 388', cadence:'/month',
    tagline:'For solo builders & researchers.', icon:Zap, accent:'#10b981', highlight:true,
    features:['Unlimited frames · 4K inference','World Model + STDP API access','SHA-256 audit log',
              '10-stage pipeline orchestration','Priority Jetson edge profiles','Email support · 24h SLA'],
    cta:'Upgrade to Pro' },
  { key:'team', name:'Team', price:'HK$ 1,288', cadence:'/month · seat',
    tagline:'Squads shipping perception apps.', icon:Crown, accent:'#f59e0b',
    features:['Everything in Pro','Up to 10 seats · shared workspace','VODA/CODA agent fleets',
              'Webhook + S3/MinIO export','Role-based access control','Slack Connect support'],
    cta:'Start Team trial' },
  { key:'enterprise', name:'Enterprise', price:'Custom', cadence:'annual',
    tagline:'On-prem, air-gapped, regulated.', icon:Building2, accent:'#8b5cf6',
    features:['Self-hosted NEPA runtime','Air-gapped + on-prem deploy','Custom STDP topology training',
              'Dedicated infra engineer','SOC2 / ISO27001 docs','99.95% uptime SLA'],
    cta:'Contact sales' },
]

const FAQ = [
  { q:'Do you train on my data?', a:'No. STDP runs locally with online plasticity. Frames never leave your tenancy unless you opt-in.' },
  { q:'Can I self-host?',         a:'Pro & Team run on AuraSense Cloud (HK + SG). Enterprise gets the Docker/K8s bundle.' },
  { q:'Face recognition?',        a:'Never. NEPA detects movement-based anomalies via world-model prediction error.' },
  { q:'Billing?',                 a:'Stripe monthly or annual (10% off). Cancel anytime. HK / SG tax handled.' },
]

interface DrawerCtx { open: (planName?: string) => void; close: () => void; isOpen: boolean }
const Ctx = createContext<DrawerCtx | null>(null)

export function useMembershipDrawer(): DrawerCtx {
  const ctx = useContext(Ctx)
  if (!ctx) return { open: () => console.warn('[MembershipDrawer] Provider missing'), close: () => {}, isOpen: false }
  return ctx
}

export function MembershipDrawerProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [highlight, setHighlight] = useState<PlanKey | null>('pro')
  const [annual, setAnnual] = useState(false)

  const open = useCallback((planName?: string) => {
    if (planName) {
      const m = PLANS.find(p => p.name.toLowerCase().includes(planName.toLowerCase()))
      if (m) setHighlight(m.key)
    }
    setIsOpen(true)
  }, [])
  const close = useCallback(() => setIsOpen(false), [])

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close() }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [isOpen, close])

  return (
    <Ctx.Provider value={{ open, close, isOpen }}>
      {children}

      <div onClick={close}
        className="fixed inset-0 z-[60] transition-opacity duration-300"
        style={{ background:'rgba(0,0,0,0.65)', backdropFilter:'blur(6px)',
                 opacity: isOpen ? 1 : 0, pointerEvents: isOpen ? 'auto' : 'none' }} />

      <aside role="dialog" aria-modal="true"
        className="fixed top-0 right-0 bottom-0 z-[61] flex flex-col transition-transform duration-300 ease-out"
        style={{ width:'min(560px, 100vw)', background:'#070e1a',
                 borderLeft:'1px solid rgba(16,185,129,0.2)',
                 boxShadow:'-24px 0 64px rgba(0,0,0,0.6)',
                 transform: isOpen ? 'translateX(0)' : 'translateX(100%)' }}>

        <div className="flex items-center gap-3 px-5 py-4 flex-shrink-0"
          style={{ borderBottom:'1px solid rgba(16,185,129,0.15)', background:'rgba(16,185,129,0.04)' }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background:'rgba(16,185,129,0.12)', border:'1px solid rgba(16,185,129,0.3)' }}>
            <Crown className="w-4 h-4" style={{ color:'#10b981' }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold" style={{ color:'#10b981' }}>Upgrade AuraSense</p>
            <p className="text-[10px]" style={{ color:'rgba(255,255,255,0.4)' }}>NEPA · World Model · STDP</p>
          </div>

          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg"
            style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)' }}>
            <button onClick={() => setAnnual(false)}
              className="px-2 py-0.5 rounded-md text-[10px] font-semibold transition-all"
              style={{ background: !annual ? 'rgba(16,185,129,0.15)' : 'transparent',
                       color: !annual ? '#10b981' : 'rgba(255,255,255,0.5)' }}>Monthly</button>
            <button onClick={() => setAnnual(true)}
              className="px-2 py-0.5 rounded-md text-[10px] font-semibold transition-all flex items-center gap-1"
              style={{ background: annual ? 'rgba(16,185,129,0.15)' : 'transparent',
                       color: annual ? '#10b981' : 'rgba(255,255,255,0.5)' }}>
              Annual
              <span className="text-[8px] px-1 rounded"
                style={{ background:'rgba(16,185,129,0.25)', color:'#10b981' }}>-10%</span>
            </button>
          </div>

          <button onClick={close} aria-label="Close" className="ml-1 hover:opacity-60"
            style={{ color:'rgba(255,255,255,0.4)' }}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
          <div className="flex items-center justify-between px-3 py-2 rounded-lg"
            style={{ background:'rgba(16,185,129,0.05)', border:'1px solid rgba(16,185,129,0.15)' }}>
            {[
              { icon: Shield, label: 'No biometrics' },
              { icon: Cpu,    label: 'Edge-first' },
              { icon: Globe2, label: 'HK / SG region' },
            ].map(b => {
              const I = b.icon as any
              return (
                <div key={b.label} className="flex items-center gap-1.5">
                  <I className="w-3 h-3" style={{ color:'#10b981' }} />
                  <span className="text-[10px]" style={{ color:'rgba(255,255,255,0.7)' }}>{b.label}</span>
                </div>
              )
            })}
          </div>

          <div className="space-y-3">
            {PLANS.map(plan => {
              const Icon = plan.icon as any
              const isHi = highlight === plan.key
              const displayPrice = annual && plan.price.startsWith('HK$')
                ? plan.price.replace(/[\d,]+/, m => Math.round(parseInt(m.replace(/,/g,'')) * 12 * 0.9).toLocaleString())
                : plan.price
              const displayCadence = annual && plan.price.startsWith('HK$')
                ? plan.cadence.replace('/month','/year')
                : plan.cadence
              return (
                <button key={plan.key} onClick={() => setHighlight(plan.key)}
                  className="w-full text-left rounded-2xl p-4 transition-all"
                  style={{
                    background: isHi ? 'rgba(16,185,129,0.07)' : 'rgba(255,255,255,0.025)',
                    border: isHi ? `1px solid ${plan.accent}` : '1px solid rgba(255,255,255,0.07)',
                    boxShadow: isHi ? `0 8px 32px ${plan.accent}22` : 'none',
                  }}>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: `${plan.accent}1a`, border:`1px solid ${plan.accent}40` }}>
                      <Icon className="w-4 h-4" style={{ color: plan.accent }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-bold" style={{ color:'rgba(255,255,255,0.95)' }}>{plan.name}</p>
                        {plan.highlight && (
                          <span className="text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
                            style={{ background:`${plan.accent}25`, color: plan.accent }}>
                            Most Popular
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] mt-0.5" style={{ color:'rgba(255,255,255,0.5)' }}>{plan.tagline}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-base font-bold font-mono" style={{ color: plan.accent }}>{displayPrice}</p>
                      <p className="text-[9px]" style={{ color:'rgba(255,255,255,0.4)' }}>{displayCadence}</p>
                    </div>
                  </div>

                  {isHi && (
                    <>
                      <ul className="mt-3 grid grid-cols-1 gap-1.5">
                        {plan.features.map(f => (
                          <li key={f} className="flex items-center gap-2 text-[11px]"
                              style={{ color: 'rgba(255,255,255,0.8)' }}>
                            <Check className="w-3 h-3 flex-shrink-0" style={{ color: plan.accent }} />
                            {f}
                          </li>
                        ))}
                      </ul>

                      <div className="mt-4 flex items-center gap-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); console.log('[CTA]', plan.key, { annual }) }}
                          disabled={plan.key === 'starter'}
                          className="flex-1 py-2 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1.5 transition-opacity hover:opacity-85"
                          style={{
                            background: plan.key === 'starter' ? 'rgba(255,255,255,0.05)' : `${plan.accent}1f`,
                            border: `1px solid ${plan.accent}55`,
                            color: plan.accent,
                            cursor: plan.key === 'starter' ? 'default' : 'pointer',
                          }}>
                          {plan.cta}
                          {plan.key !== 'starter' && <ArrowRight className="w-3 h-3" />}
                        </button>
                      </div>
                    </>
                  )}
                </button>
              )
            })}
          </div>

          <div className="pt-2">
            <p className="text-[10px] font-bold uppercase tracking-widest mb-2"
               style={{ color:'rgba(16,185,129,0.7)' }}>FAQ</p>
            <div className="space-y-2">
              {FAQ.map(item => (
                <details key={item.q} className="rounded-lg p-3 group"
                  style={{ background:'rgba(255,255,255,0.025)', border:'1px solid rgba(255,255,255,0.06)' }}>
                  <summary className="text-[11px] font-semibold cursor-pointer list-none flex items-center justify-between"
                    style={{ color:'rgba(255,255,255,0.85)' }}>
                    {item.q}
                    <span className="text-[10px] opacity-50 group-open:rotate-45 transition-transform">+</span>
                  </summary>
                  <p className="text-[10px] mt-2 leading-relaxed" style={{ color:'rgba(255,255,255,0.6)' }}>
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </div>

          <p className="text-[9px] text-center pt-2" style={{ color:'rgba(255,255,255,0.3)' }}>
            Prices in HKD. Stripe-secured. Cancel anytime · AuraSense Ltd · Kowloon, HK
          </p>
        </div>
      </aside>
    </Ctx.Provider>
  )
}
