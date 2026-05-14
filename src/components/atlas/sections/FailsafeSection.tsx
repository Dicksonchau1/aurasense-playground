// ATLAS FailsafeSection: shows major safety policies and readiness verdict
import React from 'react';
import { getFailsafePanelVM } from '../../../lib/atlas/view-models-ardupilot';

export function FailsafeSection() {
  const { rows, readiness } = getFailsafePanelVM();
  return (
    <section className="atlas-section failsafe-section">
      <h2>Failsafe Policies</h2>
      <table>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label}>
              <td>{row.label}</td>
              <td>{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className={`policy-readiness policy-readiness--${readiness}`}>
        Policy Readiness: <strong>{readiness}</strong>
      </div>
    </section>
  );
}
