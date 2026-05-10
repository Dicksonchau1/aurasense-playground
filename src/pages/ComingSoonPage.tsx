import { Link } from "react-router-dom";

type Props = { title: string; description: string };

export default function ComingSoonPage({ title, description }: Props) {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <Link to="/" className="text-sm text-white/50 hover:text-white">
        ← Back to modes
      </Link>
      <h1 className="text-3xl font-bold text-white mt-6 mb-2">{title}</h1>
      <p className="text-white/60 mb-8">{description}</p>
      <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-8 text-center">
        <p className="text-amber-300 text-sm font-mono uppercase tracking-wider mb-2">
          Coming Soon
        </p>
        <p className="text-white/50 text-sm">
          This rehearsal mode is on the roadmap. Nursing Skills ships first;
          {title} follows after Curriculum Partnership lands.
        </p>
      </div>
    </div>
  );
}
