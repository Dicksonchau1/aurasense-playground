import React from "react";

export default function LandingPage() {
  return (
    <section className="flex flex-col items-center justify-center min-h-[80vh] text-center">
      <h1 className="text-3xl md:text-5xl font-bold mb-4">Rehearse your façade inspection before you deploy.</h1>
      <p className="text-lg md:text-2xl mb-8 max-w-xl mx-auto">
        NEPA Playground gives you a signed, MBIS-aligned rehearsal report on your drone footage, in minutes. HK$108 / month.
      </p>
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <a href="/signup" className="bg-primary text-black font-bold py-3 px-8 rounded shadow hover:opacity-90 transition">Start rehearsal — HK$108/mo</a>
        <a href="/sample" className="bg-surface border border-primary text-primary font-bold py-3 px-8 rounded shadow hover:bg-primary hover:text-black transition">See a sample report</a>
      </div>
      {/* Hero animation placeholder */}
      <div className="w-full max-w-2xl h-64 bg-surface rounded-lg flex items-center justify-center mb-8 border border-border">
        <span className="text-mono text-sm">[Hero animation: drone footage → bounding boxes → finding card → Ed25519 chip]</span>
      </div>
      {/* Below the fold: 3 cards, pricing card, FAQ, footer (stubbed) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mb-8">
        <div className="bg-surface p-6 rounded shadow">Upload<br /><span className="text-xs">Upload your drone footage or scenario</span></div>
        <div className="bg-surface p-6 rounded shadow">Rehearse<br /><span className="text-xs">Run a rehearsal and review findings</span></div>
        <div className="bg-surface p-6 rounded shadow">Sign<br /><span className="text-xs">Get a signed, MBIS-aligned report</span></div>
      </div>
      <div className="bg-surface p-6 rounded shadow w-full max-w-xl mb-8">
        <div className="font-bold text-lg mb-2">Playground — HK$108/mo</div>
        <div className="text-xs mb-2">Monthly, non-refundable. <span className="underline cursor-help" title="Playground monthly is non-refundable. Cancellation takes effect at end of current billing period.">Refund policy</span></div>
        <a href="/signup" className="bg-primary text-black font-bold py-2 px-6 rounded shadow hover:opacity-90 transition">Start now</a>
      </div>
      <div className="bg-surface p-6 rounded shadow w-full max-w-2xl">
        <div className="font-bold mb-2">FAQ</div>
        <div className="text-left text-xs">
          <div className="mb-2"><b>What is NEPA Playground?</b> A rehearsal tool for façade inspection using your drone footage, with signed, MBIS-aligned reports.</div>
          <div className="mb-2"><b>Is this AI?</b> No, it's NEPA-powered, deterministic, and audit-signed.</div>
          <div className="mb-2"><b>Can I get a refund?</b> Playground monthly is non-refundable. See refund policy for details.</div>
        </div>
      </div>
    </section>
  );
}