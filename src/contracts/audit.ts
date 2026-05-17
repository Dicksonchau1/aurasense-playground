import { z } from 'zod';

export const AuditExportRequestSchema = z.object({
  sessionId: z.string(),
  requestedBy: z.string(),
  requestedAt: z.string(),
  bundleType: z.enum(['FULL', 'SUMMARY']),
});

export const AuditExportResponseSchema = z.object({
  requestId: z.string(),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED']),
  completedAt: z.string().nullable(),
  downloadUrl: z.string().nullable(),
  error: z.string().optional(),
});

export type AuditExportRequest = z.infer<typeof AuditExportRequestSchema>;
export type AuditExportResponse = z.infer<typeof AuditExportResponseSchema>;
