// Normalized error model for integrations

export type NormalizedIntegrationErrorCategory =
  | 'auth-failure'
  | 'schema-mismatch'
  | 'transport-unavailable'
  | 'capability-unsupported'
  | 'rate-limited'
  | 'stale-data'
  | 'partial-sync'
  | 'unknown';

export interface NormalizedIntegrationError {
  category: NormalizedIntegrationErrorCategory;
  message: string;
  details?: string;
  partnerKey?: string;
  timestamp: string;
  rawError?: unknown;
}
