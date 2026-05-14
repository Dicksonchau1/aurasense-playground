import React from "react";

export function EmptyState({ message, icon }: { message: string; icon?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-gray-400">
      {icon && <div className="mb-2 text-4xl">{icon}</div>}
      <div className="text-lg">{message}</div>
    </div>
  );
}
