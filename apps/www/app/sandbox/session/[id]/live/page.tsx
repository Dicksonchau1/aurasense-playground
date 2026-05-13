import React from 'react';
import OverlayMarkerList from '@/components/sandbox/OverlayMarkerList';

// In a real app, tutorId would come from auth/session context
const tutorId = 'tutor-123';

const LiveSessionPage: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh', background: '#f9f9fb' }}>
      <h1>Live OSCE Session (Tutor View)</h1>
      {/* HRI Popups for Tutor */}
      <OverlayMarkerList tutorId={tutorId} />
      {/* TODO: Add live overlay, video, and controls here */}
    </div>
  );
};

export default LiveSessionPage;
