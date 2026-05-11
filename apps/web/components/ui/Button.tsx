// Button UI primitive (stub)
import React from "react";
import { cn } from "@/lib/cn";
export function Button({ children, className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={cn("px-4 py-2 rounded bg-accent text-white", className)} {...props}>{children}</button>;
}
