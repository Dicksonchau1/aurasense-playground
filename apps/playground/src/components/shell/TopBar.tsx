import Link from "next/link";

export default function TopBar() {
  return (
    <div className="flex items-center gap-3 px-5 pt-4 pb-2 border-b border-[var(--aura-line)]">
      <Link href="/" className="flex items-center gap-2 no-underline">
        <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-label="AuraSense">
          <circle cx="16" cy="16" r="14" stroke="#3b5d8d" strokeWidth="1.5" fill="rgba(90,122,168,0.1)" />
          <circle cx="16" cy="16" r="8" stroke="#5a7aa8" strokeWidth="1.2" fill="rgba(90,122,168,0.15)" />
          <path d="M16 8 L19 14 L16 12 L13 14 Z" fill="#3b5d8d" opacity="0.85" />
          <path d="M10 20 L16 16 L22 20" stroke="#5a7aa8" strokeWidth="1.2" fill="none" strokeLinecap="round" />
          <circle cx="16" cy="16" r="2.5" fill="#3b5d8d" />
        </svg>
        <span className="aura-h2" style={{ fontSize: 20 }}>AuraSense</span>
      </Link>
      <span className="aura-badge">Playground</span>
      <div className="ml-auto aura-score-pill">
        <span className="text-xs uppercase tracking-wider opacity-80">Mission fit</span>
        <span className="text-base font-bold">84</span>
        <span className="opacity-60 text-xs">/100</span>
      </div>
    </div>
  );
}
