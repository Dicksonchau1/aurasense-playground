import { NextResponse } from 'next/server';

// Example static queue data
let queue = [
  {
    id: '1',
    label: 'Override pedestrian crossing',
    sub: 'ExR-2 #201 · ETA 12s · risk medium',
    risk: 'medium',
    eta: '12s',
    status: 'pending'
  },
  {
    id: '2',
    label: 'Relax speed in empty wing',
    sub: 'Spot #805 · ETA 4s · risk low',
    risk: 'low',
    eta: '4s',
    status: 'pending'
  }
];

export async function GET() {
  return NextResponse.json({ data: queue });
}

export async function POST(req: Request) {
  // Expect { id, action } in body
  const { id, action } = await req.json();
  // Find and update the queue item
  queue = queue.map(item =>
    item.id === id
      ? { ...item, status: action }
      : item
  );
  return NextResponse.json({ success: true, data: queue });
}
