import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const sb = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!);
const DEMO = {pitch:'3.2°',roll:'−1.8°',yaw:'42°',gs:'18.4 m/s',as:'21.1 m/s',stall:'38%',land:'16.5 m/s'};
let cache: any = null, cacheAt = 0;

export async function GET() {
  try {
    if (Date.now() - cacheAt < 1000 && cache) return NextResponse.json(cache);
    const { data, error } = await sb.from('drone_telemetry')
      .select('pitch,roll,yaw,groundspeed,airspeed,alt,batt,ts')
      .order('ts', {ascending:false}).limit(1).single();
    if (error) throw error;
    const env = { ok:true, source:'supabase', data };
    cache = env; cacheAt = Date.now();
    return NextResponse.json(env);
  } catch {
    return NextResponse.json({ok:false, source:'mock', data:DEMO, stale:true});
  }
}
