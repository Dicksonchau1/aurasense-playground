import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { MembershipDrawerProvider } from "@/components/membership-drawer";
import "./globals.css";

const geistSans = Geist({ variable: "--font-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Aura Rehearse · NEPA Playground",
  description:
    "Practice on-camera. Watch your envelope and consistency in real time. Nothing leaves your device.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://playground.aurasensehk.com"
  ),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full bg-zinc-950 text-zinc-100 font-sans">
        <MembershipDrawerProvider>{children}</MembershipDrawerProvider>
        <Analytics />
      </body>
    </html>
  );
}
