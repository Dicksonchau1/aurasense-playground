import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ConsentScreen from "./nursing/ConsentScreen";
import RehearsalScreen from "./nursing/RehearsalScreen";
import { summarize, type SessionState } from "../lib/handwashing-state";

type Phase = "consent" | "rehearsal" | "result";

export default function NursingPage() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<Phase>("consent");
  const [result, setResult] = useState<SessionState | null>(null);

  if (phase === "consent") {
    return (
      <>
        <div className="max-w-3xl mx-auto px-6 pt-6">
          <Link to="/" className="text-sm text-white/50 hover:text-white">
            ← Back to modes
          </Link>
        </div>
        <ConsentScreen
          onConsent={() => setPhase("rehearsal")}
          onCancel={() => navigate("/")}
        />
      </>
    );
  }

  if (phase === "rehearsal") {
    return (
      <RehearsalScreen
        onComplete={(s) => {
          setResult(s);
          setPhase("result");
        }}
      />
    );
  }

  if (!result) return null;
  const summary = summarize(result);

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 px-4 py-2 mb-6 text-xs font-mono uppercase tracking-wider text-amber-300 text-center">
        REHEARSAL — Not for clinical assessment
      </div>

      <h2 className="text-2xl font-bold text-white mb-2">Rehearsal complete</h2>
      <p className="text-white/60 text-sm mb-8">
        WHO 7-step hand hygiene procedure
      </p>

      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6 mb-6">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-3xl font-bold text-cyan-400">
              {summary.stepsPassed}/{summary.stepsTotal}
            </div>
            <div className="text-xs text-white/50 font-mono uppercase tracking-wider mt-1">
              Steps passed
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-white">
              {Math.round(summary.totalDetectedMs / 1000)}s
            </div>
            <div className="text-xs text-white/50 font-mono uppercase tracking-wider mt-1">
              Hands-detected duration
            </div>
          </div>
          <div>
            <div
              className={`text-3xl font-bold ${
                summary.meetsWhoMinimum ? "text-emerald-400" : "text-amber-400"
              }`}
            >
              {summary.meetsWhoMinimum ? "✓" : "—"}
            </div>
            <div className="text-xs text-white/50 font-mono uppercase tracking-wider mt-1">
              WHO 20-sec minimum
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6 mb-6">
        <div className="text-xs uppercase tracking-wider text-white/40 font-mono mb-3">
          Per-step breakdown
        </div>
        <ol className="space-y-2 text-sm">
          {result.stepResults.map((r, i) => (
            
              className="flex items-center justify-between"
            >
              <span className="text-white/80">
                {i + 1}. {r.step.label}
              </span>
              <span
                className={`font-mono text-xs ${
                  r.passed ? "text-emerald-400" : "text-amber-400"
                }`}
              >
                {Math.round(r.detectedMs / 1000)}s{" "}
                {r.passed ? "✓" : "below threshold"}
              </span>
            </li>
          ))}
        </ol>
      </div>

      <p className="text-xs text-white/40 font-mono mb-6">
        Signed PDF report comes from backend in the next step. This screen is the frontend score card.
      </p>

      <div className="flex gap-3">
        <button
          onClick={() => {
            setResult(null);
            setPhase("consent");
          }}
          className="px-5 py-2 rounded-md border border-white/10 text-white/70 hover:bg-white/5 text-sm"
        >
          Rehearse again
        </button>
        <Link
          to="/"
          className="px-5 py-2 rounded-md bg-cyan-500 text-black font-semibold text-sm hover:bg-cyan-400"
        >
          Back to modes
        </Link>
      </div>
    </div>
  );
}
