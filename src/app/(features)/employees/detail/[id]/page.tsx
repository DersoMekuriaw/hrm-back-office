"use client";

import { EmptyState } from "@/shared/empty-state/EmptyState";
import { PageHeader } from "@/shared/page-header/PageHeader";
import { useGetDepartmentsQuery } from "@/store/department.api";
import {
  useDeleteEmployeeMutation,
  useGetEmployeesQuery,
} from "@/store/employee.api";
import { useGetLeaveRequestsQuery } from "@/store/leaveRequest.api";
import { useGetPositionsQuery } from "@/store/position.api";
import { Employee, LeaveRequest } from "@/types/employee.type";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import EmployeeView from "../../_components/EmployeeView";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { Box, LoadingOverlay } from "@mantine/core";

export default function DetailPage() {
  const { id } = useParams();

  const router = useRouter();
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [deleteEmployee] = useDeleteEmployeeMutation();

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const { data: employees = [], isLoading: employeesLoading } =
    useGetEmployeesQuery({});
  const { data: departments = [], isLoading: deptsLoading } =
    useGetDepartmentsQuery({});
  const { data: positions = [], isLoading: posLoading } = useGetPositionsQuery(
    {}
  );
  const { data: leaveRequests = [], isLoading: leaveLoading } =
    useGetLeaveRequestsQuery();

  const isLoading =
    employeesLoading || deptsLoading || posLoading || leaveLoading;

  const currentEmployee = employees.find((e: Employee) => e.id === id);
  const department = departments?.find((d) => d.id === currentEmployee?.departmentId)?.name ?? "";
  const position = positions?.find((p) => p.id === currentEmployee?.positionId)?.title ?? "";

  if (!currentEmployee) {
    return (
      <EmptyState
        title="Employee not found"
        description="The requested employee could not be loaded"
      />
    );
  }

  const handleDelete = async (empId: string, fullName: string) => {
    modals.openConfirmModal({
      title: `Are you sure you want to delete ${fullName}?`,
      children: <p>This action cannot be undone.</p>,
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: async () => {
        try {
          await deleteEmployee(empId).unwrap();
          router.push(`/employees`);
          notifications.show({
            title: "Success",
            message: `Employee is deleted successfully!`,
            color: "green",
          });
        } catch (error) {
          notifications.show({
            title: "Error",
            message: `Failed to delete employee`,
            color: "red",
          });
          console.error("Error on deleting department", error);
        }
      },
    });
  };

  return (
    <>
      <PageHeader
        name={`${currentEmployee?.firstName} ${currentEmployee?.lastName}`}
        status={currentEmployee?.status}
        department={department}
        position={position}
        isFullScreen={false}
        backToPrevious={() => router.push(`/employees`)}
        onToggleFullScreen={toggleFullScreen}
      />
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
      <EmployeeView
        employee={currentEmployee}
        department={department}
        position={position}
        leaveRequests={leaveRequests.filter(
          (lr: LeaveRequest) => lr.employeeId === id
        )}
        onEdit={() => router.push(`/employees/detail/${id}/edit`)}
        onDelete={(row: Employee) =>
          handleDelete(row?.id ?? "", `${row.firstName} ${row.lastName}`)
        }
      />
    </>
  );
}
