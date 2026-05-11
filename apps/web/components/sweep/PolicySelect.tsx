import React from "react";

export function PolicySelect({ value, onChange }: any) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-md px-2 py-1.5 text-sm text-zinc-200">
      <option value="auravision-v3">Auravision v3</option>
      <option value="auravision-v2">Auravision v2</option>
    </select>
  );
}
