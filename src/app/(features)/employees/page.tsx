"use client";
import { ReusableCard } from "@/shared/reusable-card/ReusableCard";
import { DataTable } from "@/shared/reuseable-table/ReuseableTable";
import {
  // useDeleteEmployeeMutation,
  useGetEmployeesQuery,
} from "@/store/employee.api";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Pagination } from "@/shared/pagination/Pagination";
// import { Employee } from "@/types/employee.type";
// import { modals } from "@mantine/modals";
// import { notifications } from "@mantine/notifications";
import { useDebouncedValue } from "@mantine/hooks";
import { Box, LoadingOverlay } from "@mantine/core";

const EmployeesPage = () => {
  const router = useRouter();
  // const [deleteEmployee] = useDeleteEmployeeMutation();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("active");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [debouncedQuery] = useDebouncedValue(query, 300);

  const {
    data: employees,
    isLoading,
    isError,
  } = useGetEmployeesQuery({
    limit: pageSize,
    offset: (page - 1) * pageSize,
    search: debouncedQuery,
    status: status,
  });

  const total = employees?.length ?? 0;
  const totalPages = Math.ceil(total / pageSize);

  // const handleDelete = (empId: string, fullName: string) => {
  //   modals.openConfirmModal({
  //     title: `Are you sure you want to delete ${fullName}?`,
  //     children: <p>This action cannot be undone.</p>,
  //     labels: { confirm: "Delete", cancel: "Cancel" },
  //     confirmProps: { color: "red" },
  //     onConfirm: async () => {
  //       try {
  //         await deleteEmployee(empId).unwrap();
  //         notifications.show({
  //           title: "Success",
  //           message: "Employee deleted successfully!",
  //           color: "green",
  //         });
  //       } catch (err) {
  //         console.error("Failed to delete employee:", err);
  //         notifications.show({
  //           title: "Error",
  //           message: "Failed to delete employee",
  //           color: "red",
  //         });
  //       }
  //     },
  //   });
  // };

  const columns = [
    { key: "firstName", label: "First Name" },
    { key: "lastName", label: "Last Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "status", label: "Status" },
  ];

  if (isError)
    return (
      <div className="text-red-600 text-center">Failed to load employees.</div>
    );

  return (
    <ReusableCard title="Employees">
      {isLoading && (
        <Box pos="relative">
          <LoadingOverlay
            visible={isLoading}
            zIndex={1000}
            overlayProps={{ radius: "sm", blur: 2 }}
            loaderProps={{ color: "pink", type: "bars" }}
          />
        </Box>
      )}
      <DataTable
        isLoading={isLoading}
        data={employees || []}
        columns={columns}
        onAddNew={() => router.push("/employees/new")}
        onSearch={(inputValue: string) => setQuery(inputValue)}
        onFilter={(filterValue: string) => setStatus(filterValue)}
        onViewDetail={(e) => router.push(`/employees/detail/${e.id}`)}
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
