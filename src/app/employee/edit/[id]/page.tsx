'use client';

import { EmployeeFormValues } from '@/lib/employeeSchema';
import { useGetEmployeesQuery, useUpdateEmployeeMutation } from '@/services/employee.api';
import { useGetDepartmentsQuery } from '@/services/department.api';
import { useGetPositionsQuery } from '@/services/position.api';
import { Employee } from '@/types/employee.type';
import { EmployeeForm } from '@/app/employee/_components/EmployeeForm';
import { useParams, useRouter } from 'next/navigation';
import { ReusableCard } from '@/components/reusable-card/ReusableCard';
import { EmptyState } from '@/components/empty-state/EmptyState';

export default function EditPage() {
  const { id } = useParams();
  const employeeId = Number(id); 

  const router = useRouter();

  const [updateEmployee] = useUpdateEmployeeMutation();

  const { data: employees = [], isLoading: employeesLoading } = useGetEmployeesQuery({});
  const { data: departments = [], isLoading: deptsLoading } = useGetDepartmentsQuery();
  const { data: positions = [], isLoading: posLoading } = useGetPositionsQuery();

  const isLoading = employeesLoading || deptsLoading || posLoading;
  const currentEmployee = employees.find((e: Employee) => e.id === employeeId);

  const handleCancelEdit = () => {
    router.push(`/employee/detail/${id}`);
  };


  const handleSubmit = (formData: EmployeeFormValues) => {
    const updatePayload: Employee = {
        ...formData,
        id: currentEmployee?.id
      };
    updateEmployee({ ...updatePayload })
      .unwrap()
      .then(() => {
        alert(`${formData.firstName} ${formData.lastName}'s detail is updated successfully!`);
        router.push(`/employee/detail/${id}`);
      })
      .catch((err) => {
        console.error("Failed to update employee:", err);
      });
  };

  if (isLoading) return <div className="p-4">Loading...</div>;
  if (!currentEmployee) return <EmptyState title="Employee not found" description="The requested employee could not be loaded" />;

  return (
    <ReusableCard title="Edit Employee Detail">
      <EmployeeForm
        employee={currentEmployee}
        departments={departments}
        positions={positions}
        onSubmit={handleSubmit}
        onCancel={handleCancelEdit}
      />
    </ReusableCard>
  );
}