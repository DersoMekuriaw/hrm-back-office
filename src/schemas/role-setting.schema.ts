import { z } from 'zod';

export const roleSettingSchema = z.object({
  id: z.string().optional(),
  employeeId: z.string().min(1, { message: "Employee is required" }),
  sector: z.string().min(1, { message: "Sector is required" }),
  departmentId: z.string().min(1, { message: "Department is required" }),
  positionId: z.string().min(1, { message: "Position is required" }),
  startDate: z.string().min(1, { message: "Start date is required" }),
  endDate: z.string().min(1, { message: "End date is required" }),
});

export type RoleSettingSchemaFormValues = z.infer<typeof roleSettingSchema>;
