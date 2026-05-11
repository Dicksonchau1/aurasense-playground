import React from "react";
import type { HriRequest } from "../types";

export function HriPopup({ request, onRespond }: {
  request: HriRequest;
  onRespond: (answer: string) => void;
}) {
  const [answer, setAnswer] = React.useState("");
  return (
    <div className="hri-popup">
      <div>{request.prompt}</div>
      <input value={answer} onChange={e => setAnswer(e.target.value)} />
      <button onClick={() => onRespond(answer)}>Submit</button>
    </div>
  );
}
