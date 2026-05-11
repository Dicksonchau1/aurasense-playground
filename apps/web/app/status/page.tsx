async function fetchStatus() {
  const res = await fetch(`${process.env.RODA_API_URL}/api/nepa/v1/status/surfaces`, {
    cache: "no-store",
  });
  return res.json();
}

export default async function StatusPage() {
  const data = await fetchStatus();
  return (
    <main className="mx-auto max-w-3xl p-8">
      <h1 className="text-2xl font-semibold">AuraSense Surface Status</h1>
      <table className="mt-6 w-full text-sm">
        <thead className="text-left text-zinc-500">
          <tr>
            <th>Surface</th>
            <th>Events (24h)</th>
            <th>Receipts</th>
            <th>Last Event</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {data.surfaces.map((s: any) => (
            <tr key={s.product} className="border-t">
              <td className="py-2 font-mono">{s.product}</td>
              <td>{s.events_24h}</td>
              <td>{s.receipts_24h}</td>
              <td className="text-zinc-500">{s.last_event_at}</td>
              <td>{s.events_24h > 0 ? "🟢" : "🔴"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
