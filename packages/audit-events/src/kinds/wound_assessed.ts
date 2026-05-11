// wound_assessed.ts
// AuditEvent schema for wound photo assessment

export interface WoundAssessedEvent {
  event_type: 'wound_assessed';
  timestamp: string;
  patient_id: string;
  institution: string;
  photo_hash: string;
  bucket: string;
  meta?: Record<string, any>;
}

// Example event creation
export function createWoundAssessedEvent({
  patient_id,
  institution,
  photo_hash,
  bucket,
  meta = {}
}: {
  patient_id: string;
  institution: string;
  photo_hash: string;
  bucket: string;
  meta?: Record<string, any>;
}): WoundAssessedEvent {
  return {
    event_type: 'wound_assessed',
    timestamp: new Date().toISOString(),
    patient_id,
    institution,
    photo_hash,
    bucket,
    meta,
  };
}
