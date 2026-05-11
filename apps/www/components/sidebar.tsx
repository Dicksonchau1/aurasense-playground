'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ExternalLink, Settings, Users, CreditCard, Key } from 'lucide-react'

const ACCOUNT_ITEMS = [
  { label: 'Settings', href: '/api/nepa/settings',  icon: Settings   },
  { label: 'Members',  href: '/api/nepa/members',   icon: Users      },
  { label: 'Billing',  href: '/api/nepa/billing',   icon: CreditCard },
  { label: 'API Keys', href: '/api/nepa/keys',      icon: Key        },
]

const NAV_ITEMS = [
  { label: 'Aura Rehearse', href: '/rehearse', active: true  },
  { label: 'Drone',         href: '/drone',    active: true  },
  { label: 'Facility',      href: '/facility', active: false },
  { label: 'Portal',        href: '/portal',   active: false },
  { label: 'Robotic',       href: '/robotic',  active: false },
]

const FOOTER_LINKS = [
  { label: 'Docs',         href: 'https://aurasensehk.com/docs'    },
  { label: 'GitHub',       href: 'https://github.com/Dicksonchau1' },
  { label: 'AuraSense HK', href: 'https://aurasensehk.com'        },
]

export function Sidebar() {
  const pathname = usePathname()
  return (
    <aside className="w-64 flex-shrink-0 flex flex-col h-full border-r"
      style={{ background: 'var(--panel)', borderColor: 'var(--border)' }}>
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
          <span className="text-xs truncate" style={{ color: 'var(--muted)' }}>dickson@aurasensehk.com</span>
        </div>
      </div>
      <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
        <p className="text-xs mb-2 uppercase tracking-wider" style={{ color: 'var(--muted)' }}>Account</p>
        {ACCOUNT_ITEMS.map(({ label, href, icon: Icon }) => (
          <a key={label} href={href} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 py-1.5 px-2 text-sm rounded-md hover:opacity-80 transition-opacity"
            style={{ color: 'var(--muted)' }}>
            <Icon className="w-3.5 h-3.5" />{label}
          </a>
        ))}
      </div>
      <div className="px-4 py-3 flex-1">
        <p className="text-xs mb-2 uppercase tracking-wider" style={{ color: 'var(--muted)' }}>NEPA Playground</p>
        {NAV_ITEMS.map(({ label, href, active }) => {
          const isCurrent = pathname === href
          if (!active) return (
            <div key={label} className="flex items-center justify-between py-1.5 px-2 rounded-md text-sm mb-1 cursor-default opacity-50" style={{ color: 'var(--muted)' }}>
              <span className="flex items-center gap-2"><span>○</span>{label}</span>
              <span className="text-[10px] rounded-full px-1.5 py-0.5 uppercase tracking-wider" style={{ background: 'var(--border)', color: 'var(--muted)' }}>soon</span>
            </div>
          )
          return (
            <Link key={label} href={href}
              className="flex items-center gap-2 py-1.5 px-2 rounded-md text-sm mb-1 transition-colors"
              style={{ background: isCurrent ? 'var(--border)' : 'transparent', color: isCurrent ? 'var(--text)' : 'var(--muted)' }}>
              <span style={{ color: isCurrent ? 'var(--accent-green)' : 'var(--muted)' }}>{isCurrent ? '●' : '○'}</span>{label}
            </Link>
          )
        })}
      </div>
      <div className="px-4 py-3 border-t" style={{ borderColor: 'var(--border)' }}>
        {FOOTER_LINKS.map(({ label, href }) => (
          <a key={label} href={href} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1 py-1.5 px-2 text-sm rounded-md hover:opacity-80 transition-opacity"
            style={{ color: 'var(--muted)' }}>
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
