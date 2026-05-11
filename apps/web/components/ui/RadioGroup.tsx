// RadioGroup UI primitive (stub)
import React from "react";
export function RadioGroup({ options, value, onChange }: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      {options.map(opt => (
        <label key={opt} className="inline-flex items-center mr-4">
          <input type="radio" checked={value === opt} onChange={() => onChange(opt)} className="mr-1" />
          {opt}
        </label>
      ))}
    </div>
  );
}
