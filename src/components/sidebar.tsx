'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ExternalLink } from 'lucide-react'

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 flex-shrink-0 flex flex-col h-full border-r" style={{ background: 'var(--panel)', borderColor: 'var(--border)' }}>
      <div className="px-4 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center" style={{ borderColor: 'var(--accent-green)' }}>
            <div className="w-2 h-2 rounded-full" style={{ background: 'var(--accent-green)' }} />
          </div>
          <span className="font-semibold text-sm" style={{ color: 'var(--text)' }}>AuraSense HK</span>
        </div>
      </div>
      <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-2 px-2 py-1.5 rounded-md" style={{ background: 'var(--bg)' }}>
          <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: 'var(--accent-green)', color: '#000' }}>D</div>
          <span className="text-xs" style={{ color: 'var(--muted)' }}>dickson@aurasensehk.com</span>
        </div>
      </div>
      <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
        <p className="text-xs mb-2 uppercase tracking-wider" style={{ color: 'var(--muted)' }}>Account</p>
        {['Settings', 'Members', 'Billing', 'API keys'].map(item => (
          <div key={item} className="py-1.5 px-2 text-sm rounded cursor-default" style={{ color: 'var(--muted)' }}>{item}</div>
        ))}
      </div>
      <div className="px-4 py-3 flex-1">
        <p className="text-xs mb-2 uppercase tracking-wider" style={{ color: 'var(--muted)' }}>NEPA Playground</p>
        <Link href="/rehearse" className="flex items-center gap-2 py-1.5 px-2 rounded-md text-sm mb-1 transition-colors"
          style={{ background: pathname === '/rehearse' ? 'var(--border)' : 'transparent', color: pathname === '/rehearse' ? 'var(--text)' : 'var(--muted)' }}>
          <span style={{ color: 'var(--accent-green)' }}>●</span> Aura Rehearse
        </Link>
        <Link href="/drone" className="flex items-center gap-2 py-1.5 px-2 rounded-md text-sm transition-colors"
          style={{ background: pathname === '/drone' ? 'var(--border)' : 'transparent', color: pathname === '/drone' ? 'var(--text)' : 'var(--muted)' }}>
          <span style={{ color: 'var(--muted)' }}>○</span> Drone
        </Link>
      </div>
      <div className="px-4 py-3 border-t" style={{ borderColor: 'var(--border)' }}>
        {[{ label: 'Docs', href: 'https://aurasensehk.com/docs' }, { label: 'GitHub', href: 'https://github.com/Dicksonchau1' }, { label: 'AuraSense HK', href: 'https://aurasensehk.com' }].map(({ label, href }) => (
          <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 py-1.5 px-2 text-sm rounded-md hover:opacity-80" style={{ color: 'var(--muted)' }}>
            {label}<ExternalLink className="w-3 h-3" />
          </a>
        ))}
      </div>
      <div className="px-4 py-3 border-t" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-2 px-2 py-1.5 rounded-md" style={{ background: 'var(--bg)' }}>
          <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: 'var(--accent-green)', color: '#000' }}>D</div>
          <span className="text-xs" style={{ color: 'var(--muted)' }}>dickson@…</span>
        </div>
      </div>
    </aside>
  )
}