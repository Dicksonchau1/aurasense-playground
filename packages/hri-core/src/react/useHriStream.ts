import { useEffect, useState } from "react";
import { fetchOpenRequests, postHriResponse, subscribeHriStream } from "../client";
import type { HriRequest, HriResponse } from "../types";

export function useHriStream(sessionId: string, operatorId: string) {
  const [requests, setRequests] = useState<HriRequest[]>([]);

  useEffect(() => {
    let unsub: (() => void) | undefined;
    fetchOpenRequests(sessionId).then(setRequests);
    unsub = subscribeHriStream(sessionId, req => {
      setRequests(prev => [...prev, req]);
    });
    return () => { unsub && unsub(); };
  }, [sessionId]);

  async function respond(request: HriRequest, answer: string) {
    const response: HriResponse = {
      requestId: request.id,
      operatorId,
      answer,
      ts: new Date().toISOString(),
    };
    await postHriResponse(response);
    setRequests(prev => prev.filter(r => r.id !== request.id));
  }

  return { requests, respond };
}
