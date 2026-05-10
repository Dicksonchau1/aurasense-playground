import React from 'react'
export default function Footer() {
  return (
    <footer className="w-full bg-surface border-t border-border py-4 px-8 text-xs flex flex-col md:flex-row items-center justify-between gap-2 fixed bottom-0 left-0 z-50">
      <div>Built in Hong Kong 🇭🇰</div>
      <div className="flex gap-4">
        <a href="/terms" className="hover:underline">Terms</a>
        <a href="/privacy" className="hover:underline">Privacy</a>
        <a href="/refund-policy" className="hover:underline">Refund Policy</a>
        <a href="/contact" className="hover:underline">Contact</a>
      </div>
      <div className="flex items-center gap-2">
        <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
        <a href="https://status.aurasensehk.com" target="_blank" rel="noopener noreferrer">All systems normal</a>
      </div>
      <div className="font-mono text-mono">Reports signed with Ed25519 · Hash chain SHA-256</div>
    </footer>
  );
}