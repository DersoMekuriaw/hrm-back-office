// lib/employeeSchema.ts
import { z } from 'zod';

export const employeeSchema = z.object({
  id: z.number().optional(), 
  firstName: z.string().min(2, { message: "First name must be at least 2 characters" }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().min(10, { message: "Phone number must be at least 10 digits" }),
  departmentId: z.number().min(1, { message: "Department is required" }),
  positionId: z.number().min(1, { message: "Position is required" }),
  hireDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Invalid date format (YYYY-MM-DD)" }),
  salary: z.number().min(0, { message: "Salary must be positive" }),
  status: z.enum(['active', 'inactive'])
});

export type EmployeeFormValues = z.infer<typeof employeeSchema>;