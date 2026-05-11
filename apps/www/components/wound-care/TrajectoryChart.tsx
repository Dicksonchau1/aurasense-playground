import React from 'react';

// Example data structure for past visits
interface VisitData {
  date: string;
  area: number;
  tissue: { [type: string]: number };
}

interface TrajectoryChartProps {
  visits: VisitData[];
}

// Placeholder chart using SVG (replace with chart library as needed)
const TrajectoryChart: React.FC<TrajectoryChartProps> = ({ visits }) => {
  if (!visits || visits.length < 2) {
    return <div>Not enough data to render trajectory chart.</div>;
  }

  // Example: Render area-over-time as a simple line chart
  const width = 320;
  const height = 120;
  const maxArea = Math.max(...visits.map(v => v.area));
  const points = visits.map((v, i) => {
    const x = (i / (visits.length - 1)) * (width - 40) + 20;
    const y = height - 20 - (v.area / maxArea) * (height - 40);
    return `${x},${y}`;
  }).join(' ');

  return (
    <div>
      <h3>Healing Trajectory</h3>
      <svg width={width} height={height} style={{ background: '#f8f8fa', borderRadius: 8 }}>
        {/* Axes */}
        <line x1={20} y1={height-20} x2={width-20} y2={height-20} stroke="#bbb" />
        <line x1={20} y1={20} x2={20} y2={height-20} stroke="#bbb" />
        {/* Area line */}
        <polyline points={points} fill="none" stroke="#1976d2" strokeWidth={2} />
        {/* Data points */}
        {visits.map((v, i) => {
          const x = (i / (visits.length - 1)) * (width - 40) + 20;
          const y = height - 20 - (v.area / maxArea) * (height - 40);
          return <circle key={i} cx={x} cy={y} r={4} fill="#1976d2" />;
        })}
      </svg>
      {/* TODO: Add tissue stack visualization */}
    </div>
  );
};

export default TrajectoryChart;
