import React from "react";

export function Skeleton({ className = "", ...props }: any) {
  return (
    <div className={`animate-pulse bg-zinc-800 rounded ${className}`} {...props} />
  );
}
