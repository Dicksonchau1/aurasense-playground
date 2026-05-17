import { NextResponse } from 'next/server';
import { logger, getRequestId } from '@/lib/logger';

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

  // For static GET, simulate requestId as undefined
  logger.info({ msg: 'assistant_queue_get', requestId: undefined });
  return NextResponse.json({ data: queue, requestId: undefined }, { headers: { 'x-request-id': undefined } });
}

  const requestId = getRequestId(req as any);
  // Expect { id, action } in body
  const { id, action } = await req.json();
  // Find and update the queue item
  queue = queue.map(item =>
    item.id === id
      ? { ...item, status: action }
      : item
  );
  logger.info({ msg: 'assistant_queue_post', id, action, requestId });
  return NextResponse.json({ success: true, data: queue, requestId }, { headers: { 'x-request-id': requestId } });
}
