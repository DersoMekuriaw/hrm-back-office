import { z } from 'zod';

export const positionSchema = z.object({
  id: z.string().optional(), 
  sector: z.string().min(1, { message: "Sector is required" }).optional(),
  departmentId: z.string().min(1, { message: "Department is required" }),
  title: z.string().min(2, { message: "Position must be at least 2 characters" }),
  description: z.string().optional(),
  termDuration: z.number().min(0, { message: "Term duration must be positive" }),
});

export type PositionFormValues = z.infer<typeof positionSchema>;