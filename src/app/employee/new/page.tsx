'use client';

import { useRouter } from 'next/navigation';
import { EmployeeFormValues } from '@/lib/employeeSchema';
import { useCreateEmployeeMutation } from '@/services/employee.api';
import { useGetDepartmentsQuery } from '@/services/department.api';
import { useGetPositionsQuery } from '@/services/position.api';
import { EmployeeForm } from '@/app/employee/_components/EmployeeForm';
import { ReusableCard } from '@/components/reusable-card/ReusableCard';
import { PageHeader } from '@/components/page-header/PageHeader';
import { useState } from 'react';

export default function NewPage() {
  const [isFullScreen, setIsFullScreen] = useState(false);
      
  const toggleFullScreen = ()=>{
    setIsFullScreen(!isFullScreen)
  }

  const router = useRouter();
  const [addEmployee] = useCreateEmployeeMutation();

  const { data: departments = [], isLoading: deptsLoading } = useGetDepartmentsQuery();
  const { data: positions = [], isLoading: posLoading } = useGetPositionsQuery();

  const isLoading = deptsLoading || posLoading;

  const handleCancel = () => {
    router.push('/employee'); // Or back to the employee list
  };

  const handleSubmit = async (formData: EmployeeFormValues) => {
    try {
      await addEmployee(formData).unwrap();
      router.push('/employee');
    } catch (err) {
      console.error('Failed to add employee:', err);
    }
  };

  if (isLoading) return <div className="p-4">Loading...</div>;

  return (
    <>
    <PageHeader
          isFullScreen={false}
          backToPrevious={() => router.push(`/employee`)}
          onToggleFullScreen={toggleFullScreen}
      />
    <ReusableCard title="Add New Employee">
      <EmployeeForm
        editMode='new'
        departments={departments}
        positions={positions}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </ReusableCard>
  </>
  );
}
