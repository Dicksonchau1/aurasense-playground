"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/",            label: "Home" },
  { href: "/rehearse-3d", label: "Rehearse-3D" },
  { href: "/attas",       label: "ATTAS" },
  { href: "/robotics",    label: "Robotics" },
];

export default function MenuTabs() {
  const pathname = usePathname();
  return (
    <div className="flex items-end gap-1.5 px-4 h-12 border-b border-[var(--aura-line)] bg-white/30">
      {TABS.map((t) => {
        const active = t.href === "/" ? pathname === "/" : pathname.startsWith(t.href);
        return (
          <Link
            key={t.href}
            href={t.href}
            className={`aura-tab ${active ? "aura-tab-active" : ""}`}
          >
            {t.label}
          </Link>
        );
      })}
      <div className="flex-1" />
      <Link href="/login" className="aura-tab">Sign in</Link>
    </div>
  );
}
