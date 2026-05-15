import { NextResponse } from 'next/server';
// Mock AI defect detection results
const DEMO = [
  {id:'D-0471', cls:'crack', conf:0.94, bbox:[0.21,0.34,0.38,0.42], sev:'HIGH'},
  {id:'D-0472', cls:'crack', conf:0.88, bbox:[0.55,0.18,0.64,0.28], sev:'HIGH'},
  {id:'D-0473', cls:'spall', conf:0.81, bbox:[0.70,0.60,0.82,0.74], sev:'MED'},
  {id:'D-0474', cls:'stain', conf:0.76, bbox:[0.10,0.70,0.22,0.82], sev:'LOW'},
];
let cache: any = null, cacheAt = 0;

export async function GET() {
  try {
    if (Date.now() - cacheAt < 1000 && cache) return NextResponse.json(cache);
    // TODO: Replace with real defect detection fetch
    throw new Error('No real endpoint');
  } catch {
    return NextResponse.json({ok:false, source:'mock', data:DEMO, stale:true});
  }
}
