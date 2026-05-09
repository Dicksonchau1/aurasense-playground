import React from "react";

export default function PricingPage() {
  return (
    <section className="flex flex-col items-center justify-center min-h-[80vh] text-center">
      <h1 className="text-3xl md:text-5xl font-bold mb-8">Pricing</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl mb-8">
        <div className="bg-surface p-6 rounded shadow flex flex-col items-center">
          <div className="font-bold text-lg mb-2">Playground</div>
          <div className="text-2xl font-bold mb-2">HK$108 / month</div>
          <ul className="text-xs mb-4 text-left">
            <li>• Façade rehearsal</li>
            <li>• Rate-limited</li>
            <li>• 1 seat</li>
            <li>• Watermarked</li>
          </ul>
          <a href="/signup" className="bg-primary text-black font-bold py-2 px-6 rounded shadow hover:opacity-90 transition">Start now</a>
        </div>
        <div className="bg-surface p-6 rounded shadow flex flex-col items-center border-2 border-primary">
          <div className="font-bold text-lg mb-2">SFSVC Bundle</div>
          <div className="text-2xl font-bold mb-2">HK$1,200 / month</div>
          <div className="text-xs mb-2">or HK$12,000 / yr</div>
          <ul className="text-xs mb-4 text-left">
            <li>• Full SFSVC</li>
            <li>• + Playground</li>
            <li>• MBIS reports</li>
            <li>• Signed audit</li>
            <li>• 3 seats</li>
          </ul>
          <a href="/contact" className="bg-primary text-black font-bold py-2 px-6 rounded shadow hover:opacity-90 transition">Talk to sales</a>
          <div className="text-xs mt-2">Pilot then license annually — talk to sales</div>
        </div>
        <div className="bg-surface p-6 rounded shadow flex flex-col items-center">
          <div className="font-bold text-lg mb-2">AuraStudio</div>
          <div className="text-2xl font-bold mb-2">HK$499 / month Pro</div>
          <div className="text-xs mb-2">HK$1,400 Enterprise</div>
          <ul className="text-xs mb-4 text-left">
            <li>• GitHub-connected</li>
            <li>• Auto-build/deploy</li>
            <li>• Audit chain</li>
            <li>• Pro deploy targets</li>
          </ul>
          <a href="/signup" className="bg-primary text-black font-bold py-2 px-6 rounded shadow hover:opacity-90 transition">Start free</a>
        </div>
      </div>
      <div className="text-xs text-left max-w-xl mx-auto">
        <b>Refund policy:</b> Playground monthly is non-refundable. Bundle is pro-rated within 7 days. See refund policy for details.
      </div>
    </section>
  );
}