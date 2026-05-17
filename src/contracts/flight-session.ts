import { z } from 'zod';

export const FlightSessionSchema = z.object({
  id: z.string(),
  missionId: z.string(),
  vehicleId: z.string(),
  operatorId: z.string(),
  startTime: z.string(),
  endTime: z.string().nullable(),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED']),
});

export type FlightSession = z.infer<typeof FlightSessionSchema>;
