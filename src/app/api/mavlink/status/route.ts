import { NextResponse } from 'next/server';
// Mock MAVLink ingest status
const DEMO = [
  {system:'PX4 / Pixhawk', status:'LIVE'},
  {system:'ArduPilot', status:'READY'},
  {system:'DJI Adapter', status:'READY'},
  {system:'Autel / Parrot', status:'STANDBY'},
];
let cache: any = null, cacheAt = 0;

export async function GET() {
  try {
    if (Date.now() - cacheAt < 1000 && cache) return NextResponse.json(cache);
    // TODO: Replace with real MAVLink status fetch
    throw new Error('No real endpoint');
  } catch {
    return NextResponse.json({ok:false, source:'mock', data:DEMO, stale:true});
  }
}
