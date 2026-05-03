'use client'
import { useState } from 'react'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from '@/components/ui/drawer'

interface MembershipDrawerProps {
  open: boolean
  onClose: () => void
}

export function MembershipDrawer({ open, onClose }: MembershipDrawerProps) {
  const [plan, setPlan] = useState<'solo' | 'career'>('solo')

  return (
    <Drawer open={open} onOpenChange={o => !o && onClose()}>
      <DrawerContent className="max-w-md ml-auto h-full rounded-none" style={{ background: 'var(--panel)', borderColor: 'var(--border)' }}>
        <DrawerHeader className="border-b pb-4" style={{ borderColor: 'var(--border)' }}>
          <DrawerTitle style={{ color: 'var(--text)' }}>Rehearse Pro</DrawerTitle>
          <DrawerDescription style={{ color: 'var(--muted)' }}>
            Unlock the full practice environment
          </DrawerDescription>
        </DrawerHeader>

        <div className="p-6 space-y-6">
          <div>
            <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text)' }}>
              Unlock Aura Avatar — live strategic conversation with your AI interviewer.
            </p>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
              Diagnostic report with auditable history. Face anomalies cross-checked against tone of speech, with full personalized perception analytics.
            </p>
          </div>

          <div className="border rounded-xl p-4" style={{ borderColor: 'var(--border)' }}>
            <p className="text-xs uppercase tracking-widest mb-3" style={{ color: 'var(--muted)' }}>Individual plan — HK$108 / month</p>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="plan"
                  checked={plan === 'solo'}
                  onChange={() => setPlan('solo')}
                  style={{ accentColor: 'var(--accent-green)' }}
                />
                <span className="text-sm" style={{ color: 'var(--text)' }}>Solo</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="plan"
                  checked={plan === 'career'}
                  onChange={() => setPlan('career')}
                  style={{ accentColor: 'var(--accent-green)' }}
                />
                <span className="text-sm" style={{ color: 'var(--muted)' }}>Career services (10 seats)</span>
              </label>
            </div>
          </div>

          <a
            href="mailto:hello@aurasensehk.com?subject=Rehearse%20Pro%20trial"
            className="block w-full py-3 rounded-xl text-center text-sm font-semibold transition-opacity hover:opacity-90"
            style={{ background: 'var(--accent-green)', color: '#000' }}
          >
            Start free 14-day trial
          </a>

          <a
            href="mailto:hello@aurasensehk.com?subject=Rehearse%20Pro%20trial"
            className="block w-full py-3 rounded-xl text-center text-sm font-medium border transition-opacity hover:opacity-80"
            style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
          >
            See full plan comparison
          </a>

          <p className="text-xs text-center" style={{ color: 'var(--muted)' }}>
            Nothing leaves your device. All processing happens in your browser.
          </p>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
