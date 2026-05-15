import type { ReactNode } from "react";

interface CardProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export default function Card({ title, children, className = "" }: CardProps) {
  return (
    <div
      className={`rounded-2xl p-4 backdrop-blur-sm ${className}`}
      style={{
        background: "var(--aura-surface)",
        border: "1px solid var(--aura-line)",
      }}
    >
      <h2 className="aura-h2 mb-3">{title}</h2>
      {children}
    </div>
  );
}
