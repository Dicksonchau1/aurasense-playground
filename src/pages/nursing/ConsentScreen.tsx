import { useState } from "react";

type Props = { onConsent: () => void; onCancel: () => void };

export default function ConsentScreen({ onConsent, onCancel }: Props) {
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h2 className="text-2xl font-bold text-white mb-2">Before we start</h2>
      <p className="text-white/60 mb-8 text-sm">
        Aura Rehearse runs entirely in your browser. Please read carefully.
      </p>

      <div className="rounded-lg border border-white/10 bg-white/[0.02] p-6 space-y-4 text-sm text-white/80">
        <div>
          <h3 className="text-white font-semibold mb-1">Your webcam stays in your browser</h3>
          <p className="text-white/60">
            Video frames are processed locally by your browser. No video is
            uploaded to our servers. Only the step-detection results (numbers,
            not images) ever leave your device, and only if you save a report.
          </p>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-1">This is rehearsal, not assessment</h3>
          <p className="text-white/60">
            Aura Rehearse is for practice. It is not a clinical competency
            assessment tool and is not a substitute for instructor-supervised
            training.
          </p>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-1">No identifying data is collected</h3>
          <p className="text-white/60">
            We do not capture your name, face, or any identifying information.
            All reports are anonymous and watermarked.
          </p>
        </div>
      </div>

      abel className="flex items-start gap-3 mt-6 cursor-pointer">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="mt-1 w-4 h-4 accent-cyan-500"
        />
        <span className="text-sm text-white/80">
          I understand and consent to my browser accessing my webcam for this
          rehearsal session.
        </span>
      </label>

      <div className="flex gap-3 mt-8">
        <button
          onClick={onCancel}
          className="px-5 py-2 rounded-md border border-white/10 text-white/70 hover:bg-white/5 text-sm"
        >
          Cancel
        </button>
        <button
          onClick={onConsent}
          disabled={!agreed}
          className="px-5 py-2 rounded-md bg-cyan-500 text-black font-semibold text-sm hover:bg-cyan-400 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Start rehearsal
        </button>
      </div>
    </div>
  );
}
