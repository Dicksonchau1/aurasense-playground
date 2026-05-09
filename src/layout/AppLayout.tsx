import Header from "./Header";
import Footer from "./Footer";
import WatermarkBanner from "../components/WatermarkBanner";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-white pb-24">
      <WatermarkBanner />
      <Header />
      <main className="max-w-5xl mx-auto w-full px-4 py-8">{children}</main>
      <Footer />
    </div>
  );
}
