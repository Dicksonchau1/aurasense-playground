import { z } from 'zod';

export const AtlasEventSchema = z.object({
  type: z.string(),
  sessionId: z.string(),
  timestamp: z.string(),
  payload: z.any(), // Replace with strict type if available
});

export type AtlasEvent = z.infer<typeof AtlasEventSchema>;
