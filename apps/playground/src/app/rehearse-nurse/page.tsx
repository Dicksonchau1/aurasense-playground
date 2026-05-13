export const dynamic = "force-dynamic";

import RehearseNurseMockPanel from "./MockPanel";

export default function RehearseNursePage() {
  return (
    <main className="p-8">
      <h2 className="text-2xl font-bold mb-4">Rehearse-Nurse Module</h2>
      <div className="bg-gray-800 rounded p-4 mb-4">MediaPipe pipeline and session FSM UI will appear here.</div>
      <RehearseNurseMockPanel />
    </main>
  );
}
