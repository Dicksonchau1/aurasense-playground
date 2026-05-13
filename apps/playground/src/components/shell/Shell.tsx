import TopBar from "./TopBar";
import MenuTabs from "./MenuTabs";

export default function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="aura-shell">
      <TopBar />
      <MenuTabs />
      <main className="p-6 min-h-[600px]">{children}</main>
    </div>
  );
}
