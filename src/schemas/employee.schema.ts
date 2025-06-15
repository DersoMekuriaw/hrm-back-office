import { z } from 'zod';

export const employeeSchema = z.object({
  id: z.string().optional(), 
  firstName: z.string().min(2, { message: "First name must be at least 2 characters" }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().min(10, { message: "Phone number must be at least 10 digits" }),
  gender: z.string().min(1, { message: "gender is required" }),
  
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Invalid date format (YYYY-MM-DD)" }),
  citizenship: z.string().min(2, { message: "Citizenship must be at least 2 characters" }),
  
  sector: z.string().min(1, { message: "Sector is required" }),
  jobTypeId: z.string().min(1, { message: "Job type is required" }),
  academicRankId: z.string().optional(),
  
  departmentId: z.string().min(1, { message: "Department is required" }),
  positionId: z.string().optional(),
  
  hireDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Invalid date format (YYYY-MM-DD)" }),
  // profilePicture: z.any().refine((files) =>
  //       files && files.length === 1 &&
  //       ["image/png", "image/jpeg", "image/jpg"].includes(files[0].type),
  //     {
  //       message: "Only JPG, JPEG, PNG files are allowed",
  //     }
  //   ),
  status: z.enum(['active', 'inactive'])
});

export type EmployeeFormValues = z.infer<typeof employeeSchema>;