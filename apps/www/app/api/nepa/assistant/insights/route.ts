import { NextResponse } from 'next/server';
import { logger, getRequestId } from '@/lib/logger';

// Example static insights data
const insights = [
  {
    title: 'Slowdown at escalator exits',
    confidence: 0.93,
    description: 'Increase max speed threshold from 0.9 m/s to 0.6 m/s when human density exceeds “busy” in Zone B.'
  },
  {
    title: 'Route drones above kiosk cluster',
    confidence: 0.71,
    description: 'Reroute Drone #713 flight corridor 2 m higher to avoid temporary signage detected near cafe zone.'
  }
];

  // For static GET, simulate requestId as undefined
  logger.info({ msg: 'assistant_insights_get', requestId: undefined });
  return NextResponse.json({ data: insights, requestId: undefined }, { headers: { 'x-request-id': undefined } });
}
