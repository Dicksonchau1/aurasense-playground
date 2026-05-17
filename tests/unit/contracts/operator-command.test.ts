import { OperatorCommandSchema } from '../../../src/contracts/operator-command';

describe('OperatorCommand contract validation', () => {
  it('validates a correct operator command object', () => {
    const cmd = {
      id: 'c1',
      sessionId: 'fs1',
      type: 'ARM',
      issuedAt: '2026-05-17T00:00:00Z',
      acknowledged: false,
      ackTime: null,
      result: 'PENDING',
    };
    expect(() => OperatorCommandSchema.parse(cmd)).not.toThrow();
  });

  it('rejects an invalid operator command object', () => {
    const cmd = {
      id: 'c1',
      type: 'INVALID_TYPE',
      result: 'PENDING',
    };
    expect(() => OperatorCommandSchema.parse(cmd)).toThrow();
  });
});
