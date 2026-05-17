import { z } from 'zod';

export const OperatorCommandSchema = z.object({
  id: z.string(),
  sessionId: z.string(),
  type: z.enum([
    'ARM', 'DISARM', 'TAKEOFF', 'LAND', 'RTL', 'LOITER', 'PAUSE', 'RESUME',
    'RECOVERY', 'FAILSAFE', 'EMERGENCY',
  ]),
  payload: z.any().optional(), // Replace with strict type if available
  issuedAt: z.string(),
  acknowledged: z.boolean(),
  ackTime: z.string().nullable(),
  result: z.enum(['PENDING', 'ACKNOWLEDGED', 'REJECTED', 'TIMEOUT']),
});

export type OperatorCommand = z.infer<typeof OperatorCommandSchema>;
