import { NextResponse } from 'next/server';
// Mock Merkle audit chain feed
const DEMO = [
  {root:'0x8fa3c2e9b71d4c5a', batch:'MB-2026-05-12', verdicts:31, last:'RCPT-B7-CRACK-042', feed:[
    '0x8fa3c2e9b71d4c5a… · crack · D-0471',
    '0x7b2e1a9c4d2e3f1b… · spall · D-0473',
    '0x6c1d0b8a2e1f4c3d… · stain · D-0474',
  ]}
];
let cache: any = null, cacheAt = 0;

export async function GET() {
  try {
    if (Date.now() - cacheAt < 1000 && cache) return NextResponse.json(cache);
    // TODO: Replace with real Merkle feed fetch
    throw new Error('No real endpoint');
  } catch {
    return NextResponse.json({ok:false, source:'mock', data:DEMO, stale:true});
  }
}
