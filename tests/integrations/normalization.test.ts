import { normalizeAdapterError } from '../../backend/service/integrations/normalization';
import { mockAdapter } from '../../backend/service/integrations/mockAdapter';

describe('normalizeAdapterError', () => {
  it('normalizes errors from adapter', () => {
    const error = new Error('fail');
    const normalized = normalizeAdapterError(mockAdapter, error);
    expect(normalized.category).toBe('unknown');
    expect(normalized.message).toBe('fail');
    expect(normalized.partnerKey).toBe('mock');
  });
});
