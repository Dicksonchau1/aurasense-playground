export const dynamic = "force-dynamic";

import AttasMockPanel from "./MockPanel";

export default function AttasPage() {
  return (
    <main className="p-8">
      <h2 className="text-2xl font-bold mb-4">ATTAS Module</h2>
      <div className="bg-gray-800 rounded p-4 mb-4">3D map overlays and policy parser UI will appear here.</div>
      <AttasMockPanel />
    </main>
  );
}
