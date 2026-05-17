import { TelemetryFrameSchema } from '../../../src/contracts/telemetry-frame';

describe('TelemetryFrame contract validation', () => {
  it('validates a correct telemetry frame object', () => {
    const frame = {
      sessionId: 'fs1',
      timestamp: '2026-05-17T00:00:00Z',
      vehicleId: 'v1',
      position: { lat: 1, lon: 2, alt: 3 },
      status: 'OK',
      mode: 'AUTO',
    };
    expect(() => TelemetryFrameSchema.parse(frame)).not.toThrow();
  });

  it('rejects an invalid telemetry frame object', () => {
    const frame = {
      sessionId: 'fs1',
      position: { lat: 1, lon: 2, alt: 3 },
      status: 'OK',
      mode: 'AUTO',
    };
    expect(() => TelemetryFrameSchema.parse(frame)).toThrow();
  });
});
