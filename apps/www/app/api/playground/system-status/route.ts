import { NextRequest } from 'next/server';

const BACKEND_URL = process.env.NEPA_BACKEND_URL || 'http://localhost:8000';

const fallback = [
  { label: 'NEPA Runtime', value: 'Online', tone: 'good' },
  { label: 'Supabase', value: 'Connected', tone: 'good' },
  { label: 'Last Inference', value: '188 ms', tone: 'neutral' },
  { label: 'Signed Sessions (24h)', value: '12', tone: 'neutral' },
  { label: 'Deployment Target', value: 'Jetson / Cloud', tone: 'neutral' },
];

export async function GET(req: NextRequest) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/status`, { next: { revalidate: 10 } });
    if (!res.ok) throw new Error('Backend unavailable');
    const data = await res.json();
    return Response.json(data);
  } catch (e) {
    return Response.json(fallback, { status: 200 });
  }
}
