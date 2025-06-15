import { z } from 'zod';

export const departmentSchema = z.object({
  id: z.string().optional(), 
  parentId: z.string().optional(),
  name: z.string().min(2, { message: "Department name must be at least 2 characters" }),
  description: z.string().optional(),
  sector: z.string().min(1, { message: "Sector is required" })
});

export type DepartmentFormValues = z.infer<typeof departmentSchema>;