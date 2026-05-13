import "../../styles/globals.css";
import type { ReactNode } from "react";
import { Providers } from "./providers";
import Link from "next/link";
import DemoScriptOverlay from "../components/DemoScriptOverlay";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-brand text-white min-h-screen">
        <Providers>
          <header className="flex justify-between items-center p-4 bg-brand-dark">
            <Link href="/" className="text-xl font-bold">AuraSense Playground</Link>
            <nav className="flex gap-4">
              <Link href="/login">Login</Link>
              <Link href="/register">Register</Link>
              <Link href="/logout">Logout</Link>
            </nav>
          </header>
          {children}
          <DemoScriptOverlay />
        </Providers>
      </body>
    </html>
  );
}
