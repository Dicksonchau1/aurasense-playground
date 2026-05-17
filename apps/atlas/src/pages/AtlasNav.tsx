import React from "react";
import Link from "next/link";

export default function AtlasNav() {
  return (
    <nav className="atlas-nav flex flex-col gap-2 p-4 border-r border-zinc-800 min-h-screen" style={{ width: 220 }}>
      <div className="font-bold text-lg mb-4">ATLAS</div>
      <div className="text-xs text-zinc-400 uppercase mb-2">Operations</div>
      <Link href="/FlightStackShell" className="nav-item flex items-center gap-2 px-2 py-1.5 rounded hover:bg-zinc-800">
        <span className="nav-icon" role="img" aria-label="Live Feed">📡</span>
        Live Feed
      </Link>
      <Link href="/Rehearse3DShell" className="nav-item flex items-center gap-2 px-2 py-1.5 rounded hover:bg-zinc-800">
        <span className="nav-icon" role="img" aria-label="Rehearse 3D">🟧</span>
        Rehearse 3D
        <span className="nav-badge ml-2 bg-amber-400 text-black text-xs px-1.5 py-0.5 rounded">SIM</span>
      </Link>
      <div className="h-px bg-zinc-700 my-2" />
      <div className="text-xs text-zinc-400 uppercase mb-2">Compliance</div>
      <Link href="/AuditShell" className="nav-item flex items-center gap-2 px-2 py-1.5 rounded hover:bg-zinc-800">
        <span className="nav-icon" role="img" aria-label="Audit">📝</span>
        Audit
      </Link>
      <Link href="/MissionCoreShell" className="nav-item flex items-center gap-2 px-2 py-1.5 rounded hover:bg-zinc-800">
        <span className="nav-icon" role="img" aria-label="Mission Core">🗺️</span>
        Mission Core
      </Link>
    </nav>
  );
}
