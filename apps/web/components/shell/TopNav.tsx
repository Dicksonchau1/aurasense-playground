"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/playground", label: "🛝 Playground" },
  { href: "/deploy",     label: "🚀 Deploy" },
  { href: "/fleet",      label: "📊 Fleet" },
  { href: "/settings",   label: "⚙ Settings" },
];

const DEPLOY_TABS = [
  { href: "/deploy",          label: "Mission" },
  { href: "/deploy/fleet",    label: "Fleet" },
  { href: "/deploy/sandbox",  label: "🌦 Sandbox" },
  { href: "/deploy/sweep",    label: "🧪 Sweep" },
  { href: "/deploy/physics",  label: "🌬 Physics" },
  { href: "/deploy/gates",    label: "🛡 Gates" },
  { href: "/deploy/dockyard", label: "Dockyard" },
  { href: "/deploy/reports",  label: "Reports" },
];

export function TopNav() {
  const path = usePathname();
  const inDeploy = path.startsWith("/deploy");
  return (
    <header className="sticky top-0 z-20 bg-zinc-950/80 backdrop-blur border-b border-zinc-800">
      <div className="flex items-center gap-6 px-6 h-12">
        <span className="font-semibold text-zinc-100">AuraSense</span>
        <nav className="flex gap-1">
          {TABS.map(t => (
            <Link key={t.href} href={t.href}
                  className={`px-3 py-1.5 rounded-md text-sm
                    ${path === t.href || (t.href !== "/" && path.startsWith(t.href))
                      ? "bg-zinc-800 text-zinc-100" : "text-zinc-400 hover:text-zinc-200"}`}>
              {t.label}
            </Link>
          ))}
        </nav>
      </div>
      {inDeploy && (
        <div className="flex gap-1 px-6 h-10 border-t border-zinc-800 overflow-x-auto">
          {DEPLOY_TABS.map(t => (
            <Link key={t.href} href={t.href}
                  className={`px-3 py-1 my-1.5 rounded text-xs whitespace-nowrap
                    ${path === t.href ? "bg-sky-500/15 text-sky-300" : "text-zinc-500 hover:text-zinc-300"}`}>
              {t.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
