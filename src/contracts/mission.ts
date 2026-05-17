import { z } from 'zod';

export const MissionSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  status: z.enum(['PLANNED', 'ACTIVE', 'COMPLETED', 'ABORTED']),
  policyReceiptId: z.string(),
  fenceConfig: z.any().optional(), // Replace with strict type if available
});

export type Mission = z.infer<typeof MissionSchema>;

// Add more fields as required by backend contract
