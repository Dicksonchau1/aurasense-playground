import { NextResponse } from 'next/server';
const DEMO = {temp:'27 °C', wind:'14 NE', vis:'9 km', rain:'0.0 mm/h', warn:'✓ No active warnings'};

export async function GET() {
  const r = await fetch('https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=rhrread',{cache:'no-store'}).catch(()=>null);
  if (!r?.ok) return NextResponse.json({ok:false,source:'mock',data:DEMO,stale:true});
  return NextResponse.json({ok:true,source:'hko',data:await r.json()});
}
