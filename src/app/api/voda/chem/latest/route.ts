import { NextResponse } from 'next/server';
const DEMO_CHEM = {voc:'142', co2:'612 ppm', co:'3.2 ppm', risk:'LOW', radius:'18 m'};

export async function GET() {
  const r = await fetch('http://127.0.0.1:8010/chem/latest',{cache:'no-store'}).catch(()=>null);
  if (!r?.ok) return NextResponse.json({ok:false,source:'mock',data:DEMO_CHEM,stale:true});
  return NextResponse.json({ok:true,source:'voda',data:await r.json()});
}
