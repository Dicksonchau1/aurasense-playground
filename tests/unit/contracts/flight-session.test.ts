import { FlightSessionSchema } from '../../../src/contracts/flight-session';

describe('FlightSession contract validation', () => {
  it('validates a correct flight session object', () => {
    const session = {
      id: 'fs1',
      missionId: 'm1',
      vehicleId: 'v1',
      operatorId: 'o1',
      startTime: '2026-05-17T00:00:00Z',
      endTime: null,
      status: 'PENDING',
    };
    expect(() => FlightSessionSchema.parse(session)).not.toThrow();
  });

  it('rejects an invalid flight session object', () => {
    const session = {
      id: 'fs1',
      status: 'INVALID_STATUS',
    };
    expect(() => FlightSessionSchema.parse(session)).toThrow();
  });
});
