export const dynamic = "force-dynamic";

// Handwash advanced module — deferred to v0.4 (backed up to /tmp)
export default function HandwashPage() {
  return (
    <main className="p-8 max-w-xl mx-auto text-center">
      <h2 className="text-2xl font-bold mb-4">Handwash Module</h2>
      <p className="text-gray-400">Coming in v0.4. Use the main Rehearse-Nurse flow for now.</p>
      <a href="/rehearse-nurse" className="text-blue-400 underline mt-6 inline-block">&larr; Back to Rehearse-Nurse</a>
    </main>
  );
}
