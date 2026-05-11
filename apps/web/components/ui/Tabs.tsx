import React from "react";

export function Tabs({ value, onChange, items }: any) {
  return (
    <div className="flex gap-2 mb-4">
      {items.map((item: any) => (
        <button
          key={item.v}
          onClick={() => onChange(item.v)}
          className={`px-3 py-1 rounded ${value===item.v?"bg-sky-600 text-white":"bg-zinc-800 text-zinc-300"}`}
        >
          {item.l}
        </button>
      ))}
    </div>
  );
}
