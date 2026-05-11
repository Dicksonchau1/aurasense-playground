// Toast UI primitive (stub)
import React from "react";
export function Toast({ message }: { message: string }) {
  return <div className="fixed bottom-4 right-4 bg-bg-2 text-fg-0 px-4 py-2 rounded shadow">{message}</div>;
}
