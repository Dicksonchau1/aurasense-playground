import { useEffect, useState } from "react";

export function useSweepEvents(runId: string) {
  const [snapshot, setSnapshot] = useState<any>(null);
  useEffect(() => {
    const es = new EventSource(`/api/sweeps/${runId}/events`);
    es.onmessage = (m) => setSnapshot(JSON.parse(m.data));
    es.onerror = () => es.close();
    return () => es.close();
  }, [runId]);
  return snapshot;
}
