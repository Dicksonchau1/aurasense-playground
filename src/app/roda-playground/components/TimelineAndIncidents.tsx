import useSWR from 'swr';
import React from 'react';

interface IncidentBar {
  type: 'auto' | 'warn' | 'danger';
  value: number;
}

interface IncidentSummary {
  total: number;
  auto: number;
  warn: number;
  danger: number;
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function TimelineAndIncidents() {
  // Replace with your real API endpoint for incidents summary
  const { data, error } = useSWR('/api/nepa/anomalies/summary', fetcher, { refreshInterval: 10000 });

  // Fallback to static if API not ready
  const bars: IncidentBar[] = data?.data?.bars || [
    { type: 'auto', value: 12 },
    { type: 'auto', value: 10 },
    { type: 'warn', value: 7 },
    { type: 'auto', value: 11 },
    { type: 'danger', value: 4 },
    { type: 'auto', value: 9 },
    { type: 'warn', value: 6 },
    { type: 'auto', value: 10 },
    { type: 'auto', value: 8 },
    { type: 'danger', value: 3 },
    { type: 'auto', value: 9 },
    { type: 'auto', value: 7 },
  ];
  const summary: IncidentSummary = data?.data?.summary || {
    total: 76,
    auto: 59,
    warn: 11,
    danger: 6,
  };

  if (error) return <div>Error loading incidents.</div>;
  if (!data) return <div>Loading timeline...</div>;

  return (
    <section style={{marginTop:32, marginBottom:32}}>
      <div style={{marginBottom:16}}>
        <div style={{color:'#ffd335',fontWeight:600}}>Decision incidents timeline</div>
        <div style={{fontSize:12, color:'#9ca3af'}}>Last 2 hours</div>
        <div style={{display:'flex',alignItems:'flex-end',gap:4,marginTop:12,height:80}}>
          {bars.map((bar, i) => (
            <div key={i} style={{
              width:8,
              height:bar.value*3+10,
              borderRadius:8,
              background: bar.type==='auto' ? 'linear-gradient(to top,#059669,#22c55e)' : bar.type==='warn' ? 'linear-gradient(to top,#f97316,#facc15)' : 'linear-gradient(to top,#dc2626,#fb923c)',
              boxShadow: bar.type==='auto' ? '0 0 9px rgba(16,185,129,0.8)' : bar.type==='warn' ? '0 0 9px rgba(249,115,22,0.9)' : '0 0 10px rgba(220,38,38,0.9)',
              marginRight:2
            }}></div>
          ))}
        </div>
        <div style={{display:'flex',justifyContent:'space-between',fontSize:11,color:'#9ca3af',marginTop:4}}>
          <span>-60m</span><span>-30m</span><span>-15m</span><span>Now</span>
        </div>
        <div style={{display:'flex',gap:10,marginTop:6,fontSize:11}}>
          <span style={{display:'flex',alignItems:'center',gap:4}}><span style={{width:8,height:8,borderRadius:99,background:'#27e48b',display:'inline-block'}}></span>Auto-resolved</span>
          <span style={{display:'flex',alignItems:'center',gap:4}}><span style={{width:8,height:8,borderRadius:99,background:'#f59e0b',display:'inline-block'}}></span>Assisted</span>
          <span style={{display:'flex',alignItems:'center',gap:4}}><span style={{width:8,height:8,borderRadius:99,background:'#ef4444',display:'inline-block'}}></span>Escalated</span>
        </div>
      </div>
      <div style={{background:'radial-gradient(circle at top,#111827,#020617)',borderRadius:12,padding:16,border:'1px solid rgba(249,208,63,0.14)',marginTop:8}}>
        <div style={{color:'#ffd335',fontWeight:600,marginBottom:6}}>Total incidents · today</div>
        <div style={{display:'flex',alignItems:'flex-end',gap:3,marginTop:8,height:76}}>
          {bars.map((bar, i) => (
            <div key={i} style={{
              width:5,
              height:bar.value*2+10,
              borderRadius:99,
              background: bar.type==='auto' ? 'linear-gradient(to top,#059669,#22c55e)' : bar.type==='warn' ? 'linear-gradient(to top,#f97316,#facc15)' : 'linear-gradient(to top,#dc2626,#fb923c)',
              boxShadow: bar.type==='auto' ? '0 0 9px rgba(16,185,129,0.8)' : bar.type==='warn' ? '0 0 9px rgba(249,115,22,0.9)' : '0 0 10px rgba(220,38,38,0.9)',
            }}></div>
          ))}
        </div>
        <div style={{display:'flex',justifyContent:'space-between',fontSize:11,color:'#9ca3af',marginTop:4}}>
          <span><strong>{summary.total}</strong> total · {summary.auto} auto · {summary.warn} assisted · {summary.danger} escalated</span>
          <span>All changes revertable · sandbox</span>
        </div>
      </div>
    </section>
  );
}
