import { NextResponse } from 'next/server';
const DEMO = {min:'12.4 °C', avg:'24.8 °C', max:'68.2 °C', anomaly:'⚠ Hotspot · panel B7'};
let cache: any = null, cacheAt = 0;

export async function GET() {
  try {
    if (Date.now() - cacheAt < 1000 && cache) return NextResponse.json(cache);
    // TODO: Replace with real NEPA heatmap fetch
    throw new Error('No real endpoint');
  } catch {
    return NextResponse.json({ok:false, source:'mock', data:DEMO, stale:true});
  }
}
