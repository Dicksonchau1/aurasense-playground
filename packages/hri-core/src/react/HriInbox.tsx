import React from "react";
import { useHriStream } from "./useHriStream";

export function HriInbox({ sessionId, operatorId }: {
  sessionId: string;
  operatorId: string;
}) {
  const { requests, respond } = useHriStream(sessionId, operatorId);
  return (
    <div className="hri-inbox">
      {requests.map(req => (
        <div key={req.id}>
          <div>{req.prompt}</div>
          <button onClick={() => respond(req, "ACK")}>Acknowledge</button>
        </div>
      ))}
    </div>
  );
}
