import { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  children: ReactNode;
}

export default function Card({ title, children, className = "", ...rest }: CardProps) {
  return (
    <div className={`aura-card ${className}`} {...rest}>
      {title && <h2 className="aura-h2 mb-3">{title}</h2>}
      {children}
    </div>
  );
}
