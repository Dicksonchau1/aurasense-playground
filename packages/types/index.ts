// Centralized TypeScript types for AuraSense Playground

export type User = {
  id: string;
  email: string;
  role: 'admin' | 'institution' | 'demo' | 'guest';
  institution?: string;
};

export type AuditEvent = {
  id: string;
  type: string;
  timestamp: string;
  userId: string;
  details: Record<string, any>;
};

export type Session = {
  id: string;
  userId: string;
  mode: 'rehearse-nurse' | 'attas' | 'robotics';
  startedAt: string;
  endedAt?: string;
  status: 'active' | 'completed' | 'error';
};

// Add more shared types as needed
