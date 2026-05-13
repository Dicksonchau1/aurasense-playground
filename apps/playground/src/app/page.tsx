export const dynamic = "force-dynamic";

import Link from "next/link";

export default function PlaygroundHome() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-10 px-4">
      <h1 className="text-4xl font-bold mb-2">AuraSense Playground</h1>
      {/* System status strip */}
      <div className="w-full max-w-2xl flex flex-row items-center justify-between bg-gray-800 rounded-lg px-6 py-2 mb-4 text-sm text-gray-200 shadow">
        <span>System: <b className="text-green-400">Operational</b></span>
        <span>KPI: <b>Live</b></span>
        <span>Version: <b>v1.0</b></span>
      </div>
      {/* System description */}
      <p className="max-w-xl text-center text-lg text-gray-300 mb-6">
        AuraSense unifies human skill rehearsal and enterprise physical-world automation. Choose a module to begin.
      </p>
      {/* Module cards */}
      <div className="flex flex-col md:flex-row gap-8 w-full max-w-3xl justify-center">
        {/* Aura Rehearse Card */}
        <div className="flex flex-col items-center bg-gray-900 rounded-xl shadow-lg p-8 w-full md:w-1/2">
          <h2 className="text-2xl font-semibold mb-2">Aura Rehearse</h2>
          <p className="text-gray-400 mb-4 text-center">Practice and assess clinical skills in real time. For learners and educators.</p>
          <Link href="/rehearse" className="btn btn-primary w-full">Enter Aura Rehearse</Link>
        </div>
        {/* ATTAS SANDBOX Card */}
        <div className="flex flex-col items-center bg-gray-900 rounded-xl shadow-lg p-8 w-full md:w-1/2">
          <h2 className="text-2xl font-semibold mb-2">ATTAS SANDBOX</h2>
          <p className="text-gray-400 mb-4 text-center">Enterprise drone and mission operations. Plan, simulate, and monitor missions.</p>
          <Link href="/drone" className="btn btn-primary w-full">Open ATTAS SANDBOX</Link>
        </div>
      </div>
    </main>
  );
}
