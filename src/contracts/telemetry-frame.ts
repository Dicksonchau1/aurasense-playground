import { z } from 'zod';

export const TelemetryFrameSchema = z.object({
  sessionId: z.string(),
  timestamp: z.string(),
  vehicleId: z.string(),
  position: z.object({
    lat: z.number(),
    lon: z.number(),
    alt: z.number(),
  }),
  velocity: z.object({
    x: z.number(),
    y: z.number(),
    z: z.number(),
  }).optional(),
  status: z.string(),
  mode: z.string(),
  battery: z.number().optional(),
});

export type TelemetryFrame = z.infer<typeof TelemetryFrameSchema>;
