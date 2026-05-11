import Link from "next/link";
import { Card } from "@/components/ui/Card";
// import { GateBadge } from "@/components/sweep/GateBadge";

export default async function Page() {
  // const runs = await fetch(`${api}/sweeps`, { next: { revalidate: 5 }}).then(r=>r.json());
  const runs: any[] = [];
  return (
    <div className="p-6 space-y-5">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold text-zinc-100">🧪 Scenario Sweep</h1>
        <Link href="/deploy/sweep/new" className="px-3 py-1.5 rounded-md bg-sky-600 hover:bg-sky-500 text-white text-sm">
          + New Sweep
        </Link>
      </div>

      <Card title="Recent runs">
        <table className="w-full text-sm">
          <thead className="text-zinc-500 text-xs uppercase">
            <tr><th>Run</th><th>Policy</th><th>Scenario</th><th>Gates</th><th>Runs</th><th>Wall</th><th>Cost</th><th></th></tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {runs.map((r:any)=>(
              <tr key={r.run_id} className="hover:bg-zinc-900/50">
                <td className="font-mono text-zinc-300 py-2">{r.run_id.slice(0,8)}</td>
                <td>{r.policy}</td>
                <td>{r.scenario}</td>
                {/* <td><GateBadge result={r.gate_result}/></td> */}
                <td></td>
                <td className="tabular-nums">{r.runs_done}/{r.runs_total}</td>
                <td className="tabular-nums">{r.wall_time_min}m</td>
                <td className="tabular-nums">${r.cost_usd?.toFixed(2)}</td>
                <td><Link href={`/deploy/sweep/${r.run_id}`} className="text-sky-400 hover:underline">open →</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
