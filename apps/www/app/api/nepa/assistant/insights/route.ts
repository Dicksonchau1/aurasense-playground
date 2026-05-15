import { NextResponse } from 'next/server';

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

export async function GET() {
  return NextResponse.json({ data: insights });
}
