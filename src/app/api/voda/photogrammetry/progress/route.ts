import { NextResponse } from 'next/server';
const DEMO = {imgs:'384', mesh:'61%'};
let cache: any = null, cacheAt = 0;

export async function GET() {
  try {
    if (Date.now() - cacheAt < 1000 && cache) return NextResponse.json(cache);
    // TODO: Replace with real Voda photogrammetry progress fetch
    throw new Error('No real endpoint');
  } catch {
    return NextResponse.json({ok:false, source:'mock', data:DEMO, stale:true});
  }
}
