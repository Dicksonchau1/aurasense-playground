'use client'
import { useState, createContext, useContext, useCallback } from 'react'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from '@/components/ui/drawer'
import { ExternalLink } from 'lucide-react'

interface MembershipDrawerCtx { open: (feature?: string) => void; close: () => void }
const MembershipDrawerContext = createContext<MembershipDrawerCtx>({ open: () => {}, close: () => {} })
export function useMembershipDrawer() { return useContext(MembershipDrawerContext) }

export function MembershipDrawerProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [feature, setFeature] = useState<string | undefined>()
  const open = useCallback((f?: string) => { setFeature(f); setIsOpen(true) }, [])
  const close = useCallback(() => setIsOpen(false), [])
  return (
    <MembershipDrawerContext.Provider value={{ open, close }}>
      {children}
      <MembershipDrawer open={isOpen} onClose={close} feature={feature} />
    </MembershipDrawerContext.Provider>
  )
}

const NEPA_ENDPOINT_LINKS = [
  { label: 'Start Free Trial',      endpoint: '/api/nepa/membership/trial',       method: 'POST', primary: true  },
  { label: 'View All Plans',        endpoint: '/api/nepa/membership/plans',        method: 'GET',  primary: false },
  { label: 'Agent Capabilities',    endpoint: '/api/nepa/agents/capabilities',     method: 'GET',  primary: false },
  { label: 'Overlay Pro Features',  endpoint: '/api/nepa/overlay/pro',             method: 'GET',  primary: false },
]

interface MembershipDrawerProps { open: boolean; onClose: () => void; feature?: string }

export function MembershipDrawer({ open, onClose, feature }: MembershipDrawerProps) {
  const [plan, setPlan] = useState<'solo' | 'career'>('solo')
  return (
    <Drawer open={open} onOpenChange={o => !o && onClose()} direction="right">
      <DrawerContent className="fixed right-0 top-0 bottom-0 w-full max-w-sm rounded-none flex flex-col"
        style={{ background: 'var(--panel)', borderLeft: '1px solid var(--border)' }}>
        <DrawerHeader className="border-b pb-4" style={{ borderColor: 'var(--border)' }}>
          <DrawerTitle style={{ color: 'var(--text)' }}>Rehearse Pro</DrawerTitle>
          <DrawerDescription style={{ color: 'var(--muted)' }}>
            {feature ? `Unlock: ${feature}` : 'Unlock the full practice environment'}
          </DrawerDescription>
        </DrawerHeader>
        <div className="p-6 space-y-6 flex-1 overflow-auto">
          <div>
            <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text)' }}>
              Unlock Aura Avatar — live strategic conversation with your AI interviewer.
            </p>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
              Diagnostic report with auditable history and full personalized perception analytics.
            </p>
          </div>
          <div className="border rounded-xl p-4" style={{ borderColor: 'var(--border)' }}>
            <p className="text-xs uppercase tracking-widest mb-3" style={{ color: 'var(--muted)' }}>Individual plan — HK$108 / month</p>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="plan" checked={plan === 'solo'} onChange={() => setPlan('solo')} style={{ accentColor: 'var(--accent-green)' }} />
                <span className="text-sm" style={{ color: 'var(--text)' }}>Solo</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="plan" checked={plan === 'career'} onChange={() => setPlan('career')} style={{ accentColor: 'var(--accent-green)' }} />
                <span className="text-sm" style={{ color: 'var(--muted)' }}>Career services (10 seats)</span>
              </label>
            </div>
          </div>
          <div className="space-y-2">
            {NEPA_ENDPOINT_LINKS.map(({ label, endpoint, method, primary }) => (
              <a key={endpoint} href={endpoint} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-between w-full py-3 px-4 rounded-xl text-sm font-semibold transition-opacity hover:opacity-90 border"
                style={primary
                  ? { background: 'var(--accent-green)', color: '#000', borderColor: 'transparent' }
                  : { background: 'transparent', color: 'var(--text)', borderColor: 'var(--border)' }}>
                <span>{label}</span>
                <span className="flex items-center gap-1 font-mono text-xs" style={{ color: primary ? 'rgba(0,0,0,0.5)' : 'var(--muted)' }}>
                  {method} {endpoint}<ExternalLink className="w-3 h-3" />
                </span>
              </a>
            ))}
          </div>
          <p className="text-xs text-center" style={{ color: 'var(--muted)' }}>Nothing leaves your device. All processing happens in your browser.</p>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
