// Employee Type
export interface Employee {
  id?: string;

  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: string;

  birthDate: string;                  // ISO format: used to compute age
  citizenship: string;               // e.g., "Ethiopian", "Kenyan", etc.

  sector: string;
  jobTypeId: string;                 // e.g., Lecturer, Secretary, Driver
  academicRankId?: string;           // Only for academic staff

  departmentId: string;
  positionId?: string;

  hireDate: string;
  // profilePicture?: string;
  status: string;
}


// JobType (New) - Describes core job nature// Job Type: Core profession
export interface JobType {
  id: string;
  title: string;         // e.g., Lecturer, Secretary, Cleaner
  description?: string;
  sector: string
}

// Academic Rank: Only for academic staff
export interface AcademicRank {
  id: string;
  code: string;          // e.g., "GAI", "LECT", "AP"
  title: string;         // e.g., "Graduate Assistant I", "Lecturer"
  baseSalary: number;
}

// Department Type
export interface Department {
  id: string;
  name: string;
  parentId?: string;
  description?: string;
  sector: string;
}

// Position Type
export interface Position {
  id: string;
  title: string;
  departmentId: string;
  description?: string;
  termDuration: number
}
export interface RoleSetting {
  id: string;
  employeeId: string;
  sector: string;
  departmentId: string;
  positionId: string;
  startDate: string; 
  endDate: string; 
}

// Leave Request Type
export interface LeaveRequest {
  id?: string;
  employeeId: string;
  leaveType: string; 
  startDate: string; 
  endDate: string; 
  reason: string;
  status: string; 
}

// Main Structure Type
export interface OrganizationData {
  employees: Employee[];
  departments: Department[];
  positions: Position[];
  leaveRequests: LeaveRequest[];
}


export const SECTORS = [
  { label: "Academic", value: "academic" },
  { label: "Administrative", value: "administrative" },
];

export const EMPLOYEE_STATUS = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

export const LEAVE_REQUEST_STATUS = [
  { label: "Approved", value: "approved" },
  { label: "Pending", value: "pending" },
  { label: "Rejected", value: "rejected" },
];
export const GENDER = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Other", value: "Other" },
];

export const JOB_TYPES: JobType[] = [
  { id: "lecturer", title: "Lecturer", sector: "academic" },
  { id: "lab_assistant", title: "Lab Assistant", sector: "academic" },
  { id: "researcher", title: "Researcher", sector: "academic" },
  
  { id: "secretary", title: "Secretary", sector: "administrative" },
  { id: "registrar_officer", title: "Registrar Ofcoficer", sector: "administrative" },
  { id: "accountant", title: "Accountant", sector: "administrative" },
  { id: "driver", title: "Driver", sector: "administrative" },
];

export const ACADEMIC_RANKS: AcademicRank[] = [
  { id: "gai", code: "GAI", title: "Graduate Assistant I",  baseSalary: 7000 },
  { id: "gaii", code: "GAII", title: "Graduate Assistant II",  baseSalary: 8000 },
  { id: "gaiii", code: "GAIII", title: "Graduate Assistant III",  baseSalary: 9000 },
  { id: "lect", code: "LECT", title: "Lecturer",  baseSalary: 10000 },
  { id: "ap", code: "AP", title: "Assistant Professor",  baseSalary: 12000 },
  { id: "asp", code: "ASP", title: "Associate Professor",  baseSalary: 14000 },
  { id: "prof", code: "PROF", title: "Professor",  baseSalary: 16000 },
];
