import "../../styles/globals.css";
import type { ReactNode } from "react";
import { Providers } from "./providers";
import Shell from "../components/shell/Shell";
import DemoScriptOverlay from "../components/DemoScriptOverlay";

export const metadata = {
  title: "AuraSense Playground",
  description: "Rehearse-3D, ATTAS, Robotics — by AuraSense.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Shell>{children}</Shell>
          <DemoScriptOverlay />
        </Providers>
      </body>
    </html>
  );
}
