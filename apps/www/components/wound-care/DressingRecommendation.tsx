
"use client";
import React, { useState } from 'react';

interface WoundProfile {
  stage?: string;
  exudate?: string;
  infection?: boolean;
  tissue_type?: string[];
  [key: string]: any;
}

interface DressingRecommendationProps {
  woundProfile: WoundProfile;
}

const DressingRecommendation: React.FC<DressingRecommendationProps> = ({ woundProfile }) => {
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendations = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/wound-care/recommend-dressing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(woundProfile),
      });
      if (!res.ok) throw new Error('Failed to fetch recommendations');
      const data = await res.json();
      setRecommendations(data.recommendations || []);
    } catch (err: any) {
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>Dressing Recommendation</h3>
      <button onClick={fetchRecommendations} disabled={loading}>
        {loading ? 'Loading...' : 'Get Recommendation'}
      </button>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {recommendations.length > 0 && (
        <ul>
          {recommendations.map((dressing) => (
            <li key={dressing}>{dressing}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DressingRecommendation;
