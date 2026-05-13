import { NextRequest } from 'next/server';

const BACKEND_URL = process.env.NEPA_BACKEND_URL || 'http://localhost:8000';

const fallback = [
  {
    title: 'Nursing Session: Airway Management',
    category: 'rehearse',
    timestamp: '2026-05-13T09:12:00Z',
    status: 'Completed',
    href: '/rehearse/session/airway-management',
  },
  {
    title: 'Drone Mission: Bridge Inspection',
    category: 'drone',
    timestamp: '2026-05-13T08:45:00Z',
    status: 'In Progress',
    href: '/drone/mission/bridge-inspection',
  },
  {
    title: 'Robotics Runtime: NEPA Event',
    category: 'robotics',
    timestamp: '2026-05-13T07:30:00Z',
    status: 'Online',
    href: '/robotics/event/nepa',
  },
];

export async function GET(req: NextRequest) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/recent-activity`, { next: { revalidate: 10 } });
    if (!res.ok) throw new Error('Backend unavailable');
    const data = await res.json();
    return Response.json(data);
  } catch (e) {
    return Response.json(fallback, { status: 200 });
  }
}
