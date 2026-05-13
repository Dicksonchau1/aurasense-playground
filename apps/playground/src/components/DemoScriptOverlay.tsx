"use client";
import { demoScript } from "./demoScriptConfig";
import { useState } from "react";

export default function DemoScriptOverlay() {
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);
  const [qaStatus, setQaStatus] = useState(() => demoScript.map(s => s.qa.map(() => false)));

  const handleQaToggle = (qaIdx: number) => {
    setQaStatus(status => status.map((arr, i) =>
      i === step ? arr.map((v, j) => j === qaIdx ? !v : v) : arr
    ));
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        className="btn bg-brand-dark text-white mb-2"
        onClick={() => setVisible(v => !v)}
      >
        {visible ? "Hide Demo Script" : "Show Demo Script"}
      </button>
      {visible && (
        <div className="bg-gray-900 p-4 rounded shadow-lg w-96">
          <h3 className="font-bold mb-2">Demo Script</h3>
          <div className="mb-2 text-sm font-semibold">Step {step + 1} of {demoScript.length}</div>
          <div className="mb-2 text-base font-bold">{demoScript[step].step}</div>
          <ul className="mb-4">
            {demoScript[step].qa.map((qa, i) => (
              <li key={i} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={qaStatus[step][i]}
                  onChange={() => handleQaToggle(i)}
                  className="accent-brand"
                />
                <span className={qaStatus[step][i] ? "line-through text-green-400" : ""}>{qa}</span>
              </li>
            ))}
          </ul>
          <div className="flex gap-2">
            <button
              className="btn px-2 py-1 text-xs"
              onClick={() => setStep(s => Math.max(0, s - 1))}
              disabled={step === 0}
            >Prev</button>
            <button
              className="btn px-2 py-1 text-xs"
              onClick={() => setStep(s => Math.min(demoScript.length - 1, s + 1))}
              disabled={step === demoScript.length - 1}
            >Next</button>
          </div>
        </div>
      )}
    </div>
  );
}
