export default function Header() {
  return (
    <header className="w-full bg-surface border-b border-border py-4 px-8 flex items-center justify-between">
      <div className="text-primary font-bold text-xl">NEPA Playground</div>
      <nav className="space-x-6">
        <a href="/" className="hover:underline">Home</a>
        <a href="/pricing" className="hover:underline">Pricing</a>
        <a href="/sample" className="hover:underline">Sample Report</a>
        <a href="/dashboard" className="hover:underline">Dashboard</a>
      </nav>
    </header>
  );
}