import React from "react";

export function ScenarioSelect({ value, onChange }: any) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-md px-2 py-1.5 text-sm text-zinc-200">
      <option value="kowloon-rooftop">Kowloon Rooftop</option>
      <option value="central-park">Central Park</option>
    </select>
  );
}
