export const dynamic = "force-dynamic";

import RoboticsMockPanel from "./MockPanel";

export default function RoboticsPage() {
  return (
    <main className="p-8">
      <h2 className="text-2xl font-bold mb-4">Robotics Module</h2>
      <div className="bg-gray-800 rounded p-4 mb-4">Control panel, telemetry, and status overlays will appear here.</div>
      <RoboticsMockPanel />
    </main>
  );
}
