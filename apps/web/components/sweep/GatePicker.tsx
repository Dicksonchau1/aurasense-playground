import React from "react";

export function GatePicker({ profile, onChange }: any) {
  return (
    <div className="space-y-2">
      <select value={profile} onChange={e => onChange(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-md px-2 py-1.5 text-sm text-zinc-200">
        <option value="promote-to-fleet">Promote to Fleet</option>
        <option value="custom-profile">Custom Profile</option>
      </select>
      <div className="text-xs text-zinc-500">Select a gate profile to use for this sweep.</div>
    </div>
  );
}
