import React from "react";

export function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
      <span className="font-semibold">Error:</span> {message}
    </div>
  );
}
