import { ReactNode } from "react";

export default function DeployLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-bg0">
      {children}
    </div>
  );
}
