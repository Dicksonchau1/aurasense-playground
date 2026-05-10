import ModeCard from "../components/ModeCard";

export default function HomePage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <header className="mb-10">
        <h1 className="text-4xl font-bold text-white mb-3">Aura Rehearse</h1>
        <p className="text-lg text-white/60 max-w-2xl">
          Rehearsal sandboxes for professionals. Practice, replay, and receive
          a signed report — anywhere becomes your training lab.
        </p>
      </header>

      <section>
        <h2 className="text-sm uppercase tracking-wider text-white/40 font-mono mb-4">
          Choose a rehearsal mode
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ModeCard
            title="Nursing Skills"
            description="WHO 7-step hand hygiene · webcam-based pose recognition · signed scorecard"
            href="/nursing"
            status="live"
            icon="🩺"
          />
          <ModeCard
            title="Façade Inspection"
            description="MBIS-aligned drone footage rehearsal · signed audit chain · round-trip elimination"
            href="/facade"
            status="soon"
            icon="🏢"
          />
          <ModeCard
            title="Drone Mission"
            description="Pre-flight rehearsal · perception coverage prediction · autonomy validation"
            href="/drone"
            status="soon"
            icon="🚁"
          />
          <ModeCard
            title="Robotic Field Ops"
            description="Robot mission planning · safety envelope rehearsal · audit-signed deploy"
            href="/robotic"
            status="soon"
            icon="🤖"
          />
        </div>
      </section>

      <footer className="mt-16 pt-8 border-t border-white/10 text-xs text-white/40 font-mono">
        Built in Hong Kong · Powered by NEPA · Reports signed Ed25519 + SHA-256
      </footer>
    </div>
  );
}
