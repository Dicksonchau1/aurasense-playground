import { Link } from "react-router-dom";
import clsx from "clsx";

type Props = {
  title: string;
  description: string;
  href: string;
  status: "live" | "soon";
  icon: string;
};

export default function ModeCard({ title, description, href, status, icon }: Props) {
  const isLive = status === "live";

  const inner = (
    <div
      className={clsx(
        "rounded-xl border p-6 transition-all",
        isLive
          ? "border-cyan-500/30 bg-cyan-500/5 hover:border-cyan-400 hover:bg-cyan-500/10 cursor-pointer"
          : "border-white/10 bg-white/[0.02] cursor-not-allowed opacity-50"
      )}
    >
      <div className="text-3xl mb-3">{icon}</div>
      <div className="flex items-center gap-2 mb-1">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        {isLive ? (
          <span className="text-[10px] uppercase tracking-wider text-cyan-400 font-mono px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30">
            Live
          </span>
        ) : (
          <span className="text-[10px] uppercase tracking-wider text-white/40 font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10">
            Coming Soon
          </span>
        )}
      </div>
      <p className="text-sm text-white/60">{description}</p>
    </div>
  );

  return isLive ? <Link to={href}>{inner}</Link> : inner;
}
