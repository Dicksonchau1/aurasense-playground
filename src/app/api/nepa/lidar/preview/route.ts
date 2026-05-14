import { NextResponse } from 'next/server';
const DEMO = {obs:14, near:6.8, density:[0.1,0.22,0.4,0.66,0.81,0.94,0.73,0.52,0.31,0.18]};
let cache: any = null, cacheAt = 0;

export async function GET() {
  try {
    if (Date.now() - cacheAt < 1000 && cache) return NextResponse.json(cache);
    // TODO: Replace with real NEPA lidar fetch
    throw new Error('No real endpoint');
  } catch {
    return NextResponse.json({ok:false, source:'mock', data:DEMO, stale:true});
  }
}
