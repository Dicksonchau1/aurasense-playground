import { mockAdapter } from '../../backend/service/integrations/mockAdapter';

describe('mockAdapter', () => {
  it('returns mock identity', async () => {
    const identity = await mockAdapter.describe();
    expect(identity.key).toBe('mock');
  });

  it('returns mock capabilities', async () => {
    const caps = await mockAdapter.describeCapabilities();
    expect(caps.length).toBeGreaterThan(0);
  });

  it('returns mock health', async () => {
    const health = await mockAdapter.getHealth();
    expect(health.status).toBe('healthy');
  });
});
