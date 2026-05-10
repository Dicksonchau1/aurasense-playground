import { Link } from "react-router-dom";

export default function NursingPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <Link to="/" className="text-sm text-white/50 hover:text-white">
        ← Back to modes
      </Link>
      <h1 className="text-3xl font-bold text-white mt-6 mb-2">Nursing Skills Rehearsal</h1>
      <p className="text-white/60 mb-8">WHO 7-step hand hygiene procedure</p>
      <div className="rounded-lg border border-white/10 bg-white/[0.02] p-8 text-center">
        <p className="text-white/40 text-sm">
          Webcam capture + pose recognition wires up in Step 2.
        </p>
      </div>
    </div>
  );
}
