"use client";
import { useEffect, useState } from "react";
import { fetchJSON } from "../../utils/fetchJSON";
import { usePolling } from "../../utils/usePolling";

export default function RehearseNurseMockPanel() {
  const [session, setSession] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [interval, setIntervalMs] = useState(2000);
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    fetchJSON("/api/rehearse-nurse")
      .then((data: any) => setSession(data.session))
      .catch(e => setError(e.message));
  }, []);

  usePolling(() => {
    fetchJSON("/api/rehearse-nurse")
      .then((data: any) => setSession(data.session))
      .catch(e => setError(e.message));
  }, interval, enabled);

  return (
    <div className="bg-gray-900 p-4 rounded mt-4">
      <h3 className="font-bold mb-2">Mock Session State</h3>
      <div className="flex items-center gap-4 mb-2">
        <label className="flex items-center gap-1 text-xs">
          Polling Interval (ms):
          <input type="number" min={500} max={10000} step={500} value={interval} onChange={e => setIntervalMs(Number(e.target.value))} className="w-20 p-1 rounded bg-gray-800 text-white" />
        </label>
        <button type="button" className="btn px-2 py-1 text-xs" onClick={() => setEnabled(e => !e)}>{enabled ? "Pause" : "Resume"}</button>
      </div>
      {error && <div className="text-red-400">{error}</div>}
      {session ? (
        <pre className="text-xs bg-gray-800 p-2 rounded overflow-x-auto">{JSON.stringify(session, null, 2)}</pre>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}
