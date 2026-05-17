import { MissionSchema } from '../../../src/contracts/mission';

describe('Mission contract validation', () => {
  it('validates a correct mission object', () => {
    const mission = {
      id: 'm1',
      name: 'Test Mission',
      createdAt: '2026-05-17T00:00:00Z',
      updatedAt: '2026-05-17T00:00:00Z',
      status: 'PLANNED',
      policyReceiptId: 'pr1',
    };
    expect(() => MissionSchema.parse(mission)).not.toThrow();
  });

  it('rejects an invalid mission object', () => {
    const mission = {
      id: 'm1',
      name: 'Test Mission',
      status: 'INVALID_STATUS',
    };
    expect(() => MissionSchema.parse(mission)).toThrow();
  });
});
