import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost";
  children: ReactNode;
}

export default function Button({
  variant = "primary",
  children,
  className = "",
  ...rest
}: ButtonProps) {
  const base = variant === "ghost" ? "aura-btn-ghost" : "aura-btn";
  return (
    <button className={`${base} ${className}`} {...rest}>
      {children}
    </button>
  );
}
