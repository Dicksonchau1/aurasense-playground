import React, { useEffect, useState } from 'react';
import DressingRecommendation from '../../../components/wound-care/DressingRecommendation';
import WoundCapture from '../../../components/wound-care/WoundCapture';
import TrajectoryChart from '../../../components/wound-care/TrajectoryChart';

// Example wound profile for initial integration/demo
const sampleWoundProfile = {
  stage: 'III',
  exudate: 'moderate',
  infection: true,
  tissue_type: ['slough', 'granulation'],
};



interface VisitData {
  date: string;
  area: number;
  tissue: { [type: string]: number };
}

const WoundCarePage: React.FC = () => {
  const [visits, setVisits] = useState<VisitData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVisits = async () => {
      setLoading(true);
      setError(null);
      try {
        // Replace 'patient-123' with real patient/session ID as needed
        const res = await fetch('/api/wound-care/trajectory?patient_id=patient-123');
        if (!res.ok) throw new Error('Failed to fetch trajectory data');
        const data = await res.json();
        setVisits(data);
      } catch (err: any) {
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    };
    fetchVisits();
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h1>Wound Care Module</h1>
      {/* Wound Photo Capture Component */}
      <WoundCapture />
      {/* Dressing Recommendation Component */}
      <DressingRecommendation woundProfile={sampleWoundProfile} />
      {/* Healing Trajectory Chart */}
      {loading ? (
        <div>Loading trajectory...</div>
      ) : error ? (
        <div style={{ color: 'red' }}>{error}</div>
      ) : (
        <TrajectoryChart visits={visits} />
      )}
    </div>
  );
};

export default WoundCarePage;
