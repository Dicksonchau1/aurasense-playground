import React from 'react';

export type CapabilityRow = {
  surface: string;
  summary: string;
  primaryUse: string;
};

export type CapabilityMatrixProps = {
  rows: CapabilityRow[];
};

const CapabilityMatrix: React.FC<CapabilityMatrixProps> = ({ rows }) => (
  <div className="bg-card rounded-lg p-4">
    <h4 className="font-semibold mb-2 text-base">Platform Capability Matrix</h4>
    <table className="w-full text-sm">
      <thead>
        <tr className="text-muted-foreground">
          <th className="text-left py-1">Surface</th>
          <th className="text-left py-1">Summary</th>
          <th className="text-left py-1">Primary Use</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.surface} className="border-t border-muted">
            <td className="py-1 font-medium">{row.surface}</td>
            <td className="py-1">{row.summary}</td>
            <td className="py-1">{row.primaryUse}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default CapabilityMatrix;
