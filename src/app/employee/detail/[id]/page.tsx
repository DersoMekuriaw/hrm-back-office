'use client';

import EmployeeView from '@/app/employee/_components/EmployeeView';
import { EmptyState } from '@/components/empty-state/EmptyState';
import { PageHeader } from '@/components/page-header/PageHeader';
import { useGetDepartmentsQuery } from '@/services/department.api';
import { useGetEmployeesQuery } from '@/services/employee.api';
import { useGetLeaveRequestsQuery } from '@/services/leaveRequest.api';
import { useGetPositionsQuery } from '@/services/position.api';
import { Employee, LeaveRequest } from '@/types/employee.type';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';

export default function DetailPage() {
  const { id } = useParams();
  const employeeId = Number(id); 

  const router = useRouter();
  const [isFullScreen, setIsFullScreen] = useState(false);
  
  const toggleFullScreen = ()=>{
    setIsFullScreen(!isFullScreen)
  }
 
  const { data: employees = [], isLoading: employeesLoading } = useGetEmployeesQuery({});
  const { data: departments = [], isLoading: deptsLoading } = useGetDepartmentsQuery();
  const { data: positions = [], isLoading: posLoading } = useGetPositionsQuery();
  const { data: leaveRequests = [], isLoading: leaveLoading } = useGetLeaveRequestsQuery();

  const isLoading = employeesLoading || deptsLoading || posLoading || leaveLoading;
  
  const currentEmployee = employees.find((e: Employee) => e.id === employeeId);
  const department = departments?.find((d) => d.id === currentEmployee?.departmentId)?.name || 'New';
  const position = positions?.find((p) => p.id === currentEmployee?.positionId)?.title || 'New';

  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  if (!currentEmployee) {
    return <EmptyState title="Employee not found" description="The requested employee could not be loaded" />;
  }

  return (
    <>
    <PageHeader
        name={`${currentEmployee?.firstName} ${currentEmployee?.lastName}`}
        status={currentEmployee?.status}
        department={department}
        position={position}

        isFullScreen={false}
        backToPrevious={() => router.push(`/employee`)}
        onToggleFullScreen={toggleFullScreen}
    />
    <EmployeeView
      employee={currentEmployee}
      department={department}
      position={position}
      leaveRequests={leaveRequests.filter((lr: LeaveRequest) => lr.employeeId === Number(id))}
      onEdit={() => router.push(`/employee/detail/${id}/edit`)}
    />
    </>
  );
}

