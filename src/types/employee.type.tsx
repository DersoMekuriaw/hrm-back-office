// Employee Type
export interface Employee {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  departmentId: number;
  positionId: number;
  hireDate: string; // ISO date string
  salary: number;
  status: 'active' | 'inactive';
}

// Department Type
export interface Department {
  id: number;
  name: string;
  description: string;
  managerId: number;
}

// Position Type
export interface Position {
  id: number;
  title: string;
  departmentId: number;
  description: string;
}

// Leave Request Type
export interface LeaveRequest {
  id: number;
  employeeId: number;
  leaveType: string; // e.g., "annual", "sick", etc.
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  reason: string;
  status: 'approved' | 'pending' | 'rejected'; // Assuming possible statuses
}

// Main Structure Type
export interface OrganizationData {
  employees: Employee[];
  departments: Department[];
  positions: Position[];
  leaveRequests: LeaveRequest[];
}