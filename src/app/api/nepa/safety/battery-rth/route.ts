import { NextResponse } from 'next/server';
const DEMO = {batt:62, reserve:28, eta:'4.2 min', glide:'6.5°', status:'✓ RTH SAFE'};
let cache: any = null, cacheAt = 0;

export async function GET() {
  try {
    if (Date.now() - cacheAt < 1000 && cache) return NextResponse.json(cache);
    // TODO: Replace with real NEPA battery RTH fetch
    throw new Error('No real endpoint');
  } catch {
    return NextResponse.json({ok:false, source:'mock', data:DEMO, stale:true});
  }
}
