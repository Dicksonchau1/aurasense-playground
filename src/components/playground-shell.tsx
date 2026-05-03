import * as React from "react";
import { Sidebar } from "@/components/sidebar";
import { cn } from "@/lib/cn";

interface PlaygroundShellProps {
  breadcrumb: readonly string[];
  headline: string;
  subhead: string;
  rightRail?: React.ReactNode;
  children: React.ReactNode;
  privacyNote?: string;
}

export function PlaygroundShell({
  breadcrumb,
  headline,
  subhead,
  rightRail,
  children,
  privacyNote,
}: PlaygroundShellProps) {
  return (
    <div className="flex min-h-screen w-full bg-zinc-950 text-zinc-100">
      <Sidebar />

      <main className="flex min-w-0 flex-1 flex-col">
        <header className="border-b border-white/10 px-6 py-4 md:px-8">
          <nav className="text-xs text-zinc-500">
            {breadcrumb.map((b, i) => (
              <span key={b}>
                {i > 0 && <span className="mx-1.5 text-zinc-700">›</span>}
                <span className={cn(i === breadcrumb.length - 1 && "text-zinc-300")}>
                  {b}
                </span>
              </span>
            ))}
          </nav>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
            {headline}
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-zinc-400">{subhead}</p>
        </header>

        <div className="flex flex-1 flex-col gap-6 p-6 md:flex-row md:p-8">
          <section className="flex-1 min-w-0">{children}</section>
          {rightRail && (
            <aside className="md:w-80 shrink-0 space-y-4">{rightRail}</aside>
          )}
        </div>

        {privacyNote && (
          <footer className="border-t border-white/10 px-6 py-3 text-xs text-zinc-500 md:px-8">
            <span className="inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              {privacyNote}
            </span>
          </footer>
        )}
      </main>
    </div>
  );
}
