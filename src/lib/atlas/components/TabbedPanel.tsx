import React, { useState } from "react";

export type Tab = { label: string; content: React.ReactNode };

export function TabbedPanel({ tabs, initial = 0 }: { tabs: Tab[]; initial?: number }) {
  const [active, setActive] = useState(initial);
  return (
    <div>
      <div className="flex gap-2 border-b mb-4">
        {tabs.map((tab, i) => (
          <button
            key={tab.label}
            className={`px-4 py-2 font-medium border-b-2 ${active === i ? "border-blue-600 text-blue-700" : "border-transparent text-gray-500"}`}
            onClick={() => setActive(i)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div>{tabs[active]?.content}</div>
    </div>
  );
}
