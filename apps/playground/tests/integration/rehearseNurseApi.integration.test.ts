import { createMocks } from 'node-mocks-http';
import * as startApi from '../../src/app/api/rehearse-nurse/start/route';
import * as stepApi from '../../src/app/api/rehearse-nurse/step/route';
import * as completeApi from '../../src/app/api/rehearse-nurse/complete/route';

describe('Rehearse Nurse API integration', () => {
  it('starts a session', async () => {
    const { req, res } = createMocks({ method: 'POST' });
    const response = await startApi.POST(req, res);
    expect(response.status || response.statusCode).toBe(200);
    const data = await response.json();
    expect(data.sessionId).toBeDefined();
  });

  it('steps through a session', async () => {
    const { req, res } = createMocks({ method: 'POST', body: { sessionId: 'test', stepIndex: 0, stepLabel: 'Hand Hygiene' } });
    const response = await stepApi.POST(req, res);
    expect(response.status || response.statusCode).toBe(200);
    const data = await response.json();
    expect(data.feedback).toBeDefined();
  });

  it('completes a session', async () => {
    const { req, res } = createMocks({ method: 'POST', body: { sessionId: 'test', steps: [{ completed: true }], anomalies: [] } });
    const response = await completeApi.POST(req, res);
    expect(response.status || response.statusCode).toBe(200);
    const data = await response.json();
    expect(data.verdict).toBeDefined();
  });
});
