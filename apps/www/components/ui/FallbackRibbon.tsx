import * as React from "react";
import { cn } from "@/lib/cn";

export function FallbackRibbon({
  message,
  status = "degraded",
  className,
  ...rest
}: React.HTMLAttributes<HTMLDivElement> & { message: string; status?: "degraded" | "offline" }) {
  const color = status === "offline"
    ? "bg-rose-900/80 text-rose-200 border-rose-700"
    : "bg-amber-900/80 text-amber-200 border-amber-700";
  return (
    <div
      {...rest}
      className={cn(
        "w-full rounded-lg border px-4 py-2 text-xs font-mono flex items-center gap-2 mb-2",
        color,
        className
      )}
      role="status"
    >
      {message}
    </div>
  );
}
