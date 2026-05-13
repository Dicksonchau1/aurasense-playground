
"use client";
import React, { useEffect, useState } from 'react';

interface HriEvent {
  type: string;
  surface: string;
  tutor_id: string;
  message: string;
  wound_profile: any;
  auto_recommendations: string[];
}

interface OverlayMarkerListProps {
  tutorId: string;
}

const OverlayMarkerList: React.FC<OverlayMarkerListProps> = ({ tutorId }) => {
  const [hriEvents, setHriEvents] = useState<HriEvent[]>([]);

  useEffect(() => {
    // Poll for new HRI events (replace with WebSocket/event bus in production)
    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/hri-events?tutor_id=' + tutorId);
        if (res.ok) {
          const events = await res.json();
          setHriEvents(events.filter((e: HriEvent) => e.tutor_id === tutorId && e.surface === 'sandbox-osce'));
        }
      } catch {}
    }, 2000);
    return () => clearInterval(interval);
  }, [tutorId]);

  if (!hriEvents.length) return null;

  return (
    <div style={{ position: 'fixed', top: 40, right: 40, zIndex: 1000 }}>
      {hriEvents.map((event, idx) => (
        <div key={idx} style={{ background: '#fffbe6', border: '1px solid #ffe58f', padding: 16, borderRadius: 8, marginBottom: 12, boxShadow: '0 2px 8px #0001' }}>
          <b>HRI Alert:</b> {event.message}
          <div style={{ fontSize: 12, marginTop: 8 }}>
            <b>Auto-recommendations:</b> {event.auto_recommendations.join(', ')}
          </div>
        </div>
      ))}
    </div>
  );
};

export default OverlayMarkerList;
