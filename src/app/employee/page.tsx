'use client';
import { ReusableCard } from '@/components/reusable-card/ReusableCard';
import { DataTable } from '@/components/reuseable-table/ReuseableTable'
import { useDeleteEmployeeMutation, useGetEmployeesQuery } from '@/services/employee.api';
import { modals } from '@mantine/modals';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { notifications } from "@mantine/notifications";
import { Pagination } from '@/components/pagination/Pagination';
import { Employee } from '@/types/employee.type';

const EmployeesPage = () => {
  const router = useRouter();
  const [deleteEmployee] = useDeleteEmployeeMutation();
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const { data: employees, isLoading, isError, refetch } = useGetEmployeesQuery({
    limit: pageSize,
    offset: (page - 1) * pageSize,
    search: query,
  });

  const total = employees?.length ?? 0;
  const totalPages = Math.ceil(total / pageSize);

  const handleDelete = (empId: number, fullName: string) => {
    modals.openConfirmModal({
      title: 'Delete Employee',
      children: (
        <p>Are you sure you want to delete {fullName}? This action cannot be undone.</p>
      ),
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: () => {
        // Create a separate async function to handle the deletion
        const performDelete = async () => {
          try {
            await deleteEmployee(empId).unwrap();
            notifications.show({
              title: 'Success',
              message: 'Employee deleted successfully',
              color: 'green',
            });
            refetch();
          } catch (error) {
            notifications.show({
              title: 'Error',
              message: 'Failed to delete employee',
              color: 'red',
            });
            console.error('Delete error:', error);
          }
        };
        
        // Call the async function without returning the promise
        performDelete().catch(() => {});
      },
    });
  };

  const columns = [
    { key: "firstName", label: "First Name" },
    { key: "lastName", label: "Last Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "status", label: "Status" }
  ];

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading employees</div>;

  return (
    <ReusableCard title="Employees">
      <DataTable
        isLoading={isLoading}
        data={employees || []}
        columns={columns}
        onAddNew={() => router.push('/employee/new')}
        onSearch={(inputValue: string) => setQuery(inputValue)}
        onViewDetail={(e) => router.push(`/employee/detail/${e.id}`)}
        onEdit={(row: Employee) => router.push(`/employee/detail/${row.id}/edit`)}
        onDelete={(row: Employee) => handleDelete(row.id ?? 0, `${row.firstName} ${row.lastName}`)}
      />
      <Pagination
        page={page}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />
    </ReusableCard>
  );
};

export default EmployeesPage;