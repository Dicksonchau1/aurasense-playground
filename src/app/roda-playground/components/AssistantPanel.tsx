
import useSWR from 'swr';

interface Insight {
  title: string;
  confidence: number;
  description: string;
}

interface QueueItem {
  label: string;
  sub: string;
  risk: 'low' | 'medium' | 'high';
  eta: string;
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function AssistantPanel() {
  // Replace with your real API endpoints
  const { data: insightsData, error: insightsError } = useSWR('/api/nepa/assistant/insights', fetcher, { refreshInterval: 10000 });
  const { data: queueData, error: queueError } = useSWR('/api/nepa/assistant/queue', fetcher, { refreshInterval: 10000 });

  const insights: Insight[] = insightsData?.data || [
    {
      title: 'Slowdown at escalator exits',
      confidence: 0.93,
      description: 'Increase max speed threshold from 0.9 m/s to 0.6 m/s when human density exceeds “busy” in Zone B.'
    },
    {
      title: 'Route drones above kiosk cluster',
      confidence: 0.71,
      description: 'Reroute Drone #713 flight corridor 2 m higher to avoid temporary signage detected near cafe zone.'
    }
  ];
  const queue: QueueItem[] = queueData?.data || [
    {
      label: 'Override pedestrian crossing',
      sub: 'ExR-2 #201 · ETA 12s · risk medium',
      risk: 'medium',
      eta: '12s'
    },
    {
      label: 'Relax speed in empty wing',
      sub: 'Spot #805 · ETA 4s · risk low',
      risk: 'low',
      eta: '4s'
    }
  ];

  if (insightsError || queueError) return <div>Error loading assistant data.</div>;
  if (!insightsData && !queueData) return <div>Loading assistant...</div>;

  return (
    <aside style={{padding:16,background:'radial-gradient(circle at top,#0f172a,#020617)',borderLeft:'1px solid rgba(148,163,184,0.18)',display:'flex',flexDirection:'column',gap:12}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div style={{padding:'4px 10px',borderRadius:99,background:'rgba(15,23,42,0.85)',border:'1px solid rgba(148,163,184,0.45)',fontSize:10,color:'#9ca3af'}}>RODA assistant · live</div>
        <div style={{width:30,height:30,borderRadius:99,background:'radial-gradient(circle at 30% 0,#fff7cc,#facc15)',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 0 20px rgba(250,204,21,0.8)'}}>
          <span style={{width:13,height:13,borderRadius:99,background:'#020617',boxShadow:'inset 0 0 0 3px rgba(0,0,0,0.6)'}}></span>
        </div>
      </div>
      <section style={{borderRadius:18,background:'radial-gradient(circle at top,#020617,#020617)',border:'1px solid rgba(249,208,63,0.14)',padding:'14px 14px 12px',boxShadow:'0 18px 34px rgba(0,0,0,0.85)',display:'flex',flexDirection:'column',gap:10}}>
        <h2 style={{fontSize:14,marginBottom:2}}>Hi, AuraSense — here’s this hour’s focus.</h2>
        <p style={{fontSize:12,color:'#9ca3af',lineHeight:1.5}}>I am watching 3 high‑risk decision corridors and 2 policy conflicts in the “Crowded mall” scenario. You can accept, simulate, or revert any change.</p>
        <div style={{display:'flex',gap:6,marginTop:4,fontSize:11}}>
          <div style={{padding:'3px 8px',borderRadius:99,background:'rgba(31,41,55,0.9)',border:'1px solid rgba(75,85,99,0.8)',color:'#e5e7eb'}}>Autonomy: 82%</div>
          <div style={{padding:'3px 8px',borderRadius:99,background:'rgba(31,41,55,0.9)',border:'1px solid rgba(75,85,99,0.8)',color:'#e5e7eb'}}>Escalations: 6 · all safe</div>
        </div>
        <div style={{display:'flex',gap:6,fontSize:11,marginTop:4}}>
          <div style={{flex:1,textAlign:'center',padding:'5px 0',borderRadius:99,background:'linear-gradient(to right,#fffbeb,#facc15)',color:'#0b0b12',border:'1px solid rgba(250,204,21,0.6)',boxShadow:'0 0 18px rgba(250,204,21,0.6)'}}>Insights</div>
          <div style={{flex:1,textAlign:'center',padding:'5px 0',borderRadius:99,background:'rgba(15,23,42,0.9)',color:'#9ca3af',border:'1px solid transparent'}}>Recommendations</div>
          <div style={{flex:1,textAlign:'center',padding:'5px 0',borderRadius:99,background:'rgba(15,23,42,0.9)',color:'#9ca3af',border:'1px solid transparent'}}>Policy diffs</div>
        </div>
        <div style={{marginTop:8,display:'flex',flexDirection:'column',gap:6,maxHeight:160,overflowY:'auto',paddingRight:2}}>
          {insights.map((insight,i) => (
            <div key={i} style={{fontSize:12,borderRadius:12,background:'rgba(15,23,42,0.9)',border:'1px solid rgba(31,41,55,0.95)',padding:'6px 8px',display:'flex',flexDirection:'column',gap:4}}>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:11,color:'#e5e7eb'}}>
                <span>{insight.title}</span>
                <span style={{color:insight.confidence>0.9?'#a7f3d0':insight.confidence>0.8?'#facc15':'#fecaca'}}>{Math.round(insight.confidence*100)}% conf</span>
              </div>
              <p style={{fontSize:12,color:'#9ca3af',margin:0}}>{insight.description}</p>
              <div style={{display:'flex',gap:6,fontSize:11,marginTop:2}}>
                <div style={{flex:1,textAlign:'center',padding:'3px 0',borderRadius:99,background:'linear-gradient(to right,#fef3c7,#facc15)',color:'#0b0b12',border:'1px solid rgba(234,179,8,0.8)',boxShadow:'0 0 18px rgba(250,204,21,0.6)'}}>Apply</div>
                <div style={{flex:1,textAlign:'center',padding:'3px 0',borderRadius:99,background:'rgba(15,23,42,0.9)',border:'1px solid rgba(75,85,99,0.9)',color:'#e5e7eb'}}>Simulate</div>
                <div style={{flex:1,textAlign:'center',padding:'3px 0',borderRadius:99,background:'rgba(15,23,42,0.9)',border:'1px solid rgba(75,85,99,0.9)',color:'#e5e7eb'}}>Dismiss</div>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section style={{borderRadius:18,background:'radial-gradient(circle at top,#020617,#020617)',border:'1px solid rgba(31,41,55,0.95)',padding:'10px 11px',display:'flex',flexDirection:'column',gap:6,boxShadow:'0 18px 34px rgba(0,0,0,0.85)',marginTop:16}}>
        <h3 style={{fontSize:12,color:'#e5e7eb',marginBottom:2}}>Decision queue</h3>
        {queue.map((item,i) => (
          <div key={i} style={{display:'grid',gridTemplateColumns:'auto 1fr auto',gap:6,alignItems:'center',fontSize:11,padding:'6px 7px',borderRadius:12,background:'rgba(15,23,42,0.9)',border:'1px solid rgba(31,41,55,0.98)'}}>
            <div style={{width:22,height:22,borderRadius:9,background:'linear-gradient(135deg,#fbbf24,#111827)'}}></div>
            <div>
              <span style={{color:'#e5e7eb'}}>{item.label}</span>
              <span style={{display:'block',color:'#9ca3af',fontSize:10}}>{item.sub}</span>
            </div>
            <div style={{display:'flex',gap:4}}>
              <button style={{padding:'3px 6px',borderRadius:99,border:'1px solid rgba(234,179,8,0.9)',background:'linear-gradient(to right,#fef3c7,#facc15)',color:'#0b0b12',fontSize:10}}>Approve</button>
              <button style={{padding:'3px 6px',borderRadius:99,border:'1px solid rgba(75,85,99,0.9)',background:'rgba(15,23,42,0.9)',color:'#9ca3af',fontSize:10}}>Modify</button>
              <button style={{padding:'3px 6px',borderRadius:99,border:'1px solid rgba(248,113,113,0.9)',background:'rgba(15,23,42,0.9)',color:'#fecaca',fontSize:10}}>Reject</button>
            </div>
          </div>
        ))}
      </section>
      <div style={{marginTop:'auto',borderRadius:99,background:'rgba(15,23,42,0.9)',border:'1px solid rgba(55,65,81,0.95)',display:'flex',alignItems:'center',padding:'6px 8px',fontSize:12,color:'#9ca3af',gap:6}}>
        <input type="text" placeholder="Ask RODA anything about missions, incidents, or policies…" style={{flex:1,border:'none',outline:'none',background:'transparent',color:'#e5e7eb',fontSize:12}} />
        <button style={{border:'none',outline:'none',cursor:'pointer',borderRadius:99,minWidth:30,height:30,display:'inline-flex',alignItems:'center',justifyContent:'center',background:'radial-gradient(circle at 30% 0,#fef3c7,#facc15)',boxShadow:'0 0 16px rgba(250,204,21,0.75)',color:'#0b0b12',fontSize:13}}>➤</button>
        <small style={{color:'#9ca3af',fontSize:10,marginLeft:4}}>⌘K · open command palette</small>
      </div>
    </aside>
  );
}
