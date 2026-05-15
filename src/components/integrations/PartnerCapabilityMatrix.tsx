"use client";

import React from 'react';
import { PartnerCapability } from '../../lib/integrations/types';

const PartnerCapabilityMatrix: React.FC<{ capabilities: PartnerCapability[] }> = ({ capabilities }) => (
  <div>
    <h4>Capabilities</h4>
    <table>
      <thead>
        <tr>
          <th>Capability</th>
          <th>Supported</th>
        </tr>
      </thead>
      <tbody>
        {capabilities.map(cap => (
          <tr key={cap.key}>
            <td>{cap.displayName}</td>
            <td>{cap.supported ? '✔️' : '—'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default PartnerCapabilityMatrix;
