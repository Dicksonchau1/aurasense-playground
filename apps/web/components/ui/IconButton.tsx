// IconButton UI primitive (stub)
import React from "react";
import { cn } from "@/lib/cn";
export function IconButton({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={cn("p-2 rounded-full hover:bg-bg-2", className)} {...props} />;
}
