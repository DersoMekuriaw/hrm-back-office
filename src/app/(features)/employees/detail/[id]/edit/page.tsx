"use client";

import { EmployeeFormValues } from "@/schemas/employee.schema";
import {
  useDeleteEmployeeMutation,
  useGetEmployeesQuery,
  useUpdateEmployeeMutation,
} from "@/store/employee.api";
import { useGetDepartmentsQuery } from "@/store/department.api";
import { useGetPositionsQuery } from "@/store/position.api";
import { Employee } from "@/types/employee.type";
import { useParams, useRouter } from "next/navigation";
import { ReusableCard } from "@/shared/reusable-card/ReusableCard";
import { EmptyState } from "@/shared/empty-state/EmptyState";
import { useState } from "react";
import { PageHeader } from "@/shared/page-header/PageHeader";
import { EmployeeForm } from "../../../_components/EmployeeForm";
import { notifications } from "@mantine/notifications";
import { modals } from "@mantine/modals";
import { Box, LoadingOverlay } from "@mantine/core";

export default function EditPage() {
  const router = useRouter();
  const { id } = useParams();

  const [isFullScreen, setIsFullScreen] = useState(false);
  const [updateEmployee] = useUpdateEmployeeMutation();
  const [deleteEmployee] = useDeleteEmployeeMutation();

  const { data: employees = [], isLoading: employeesLoading } =
    useGetEmployeesQuery({});
  const { data: departments = [], isLoading: deptsLoading } =
    useGetDepartmentsQuery({});
  const { data: positions = [], isLoading: posLoading } = useGetPositionsQuery(
    {}
  );

  const isLoading = employeesLoading || deptsLoading || posLoading;
  const currentEmployee = employees.find((e: Employee) => e.id === id);
  const department = departments?.find(
    (d) => d.id === currentEmployee?.departmentId
  )?.name;
  const position = positions?.find(
    (p) => p.id === currentEmployee?.positionId
  )?.title;

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const handleCancelEdit = () => {
    router.push(`/employees/detail/${id}`);
  };

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
          console.error("Error on deleting employee", error);
        }
      },
    });
  };

  const handleSubmit = (formData: EmployeeFormValues) => {
    const updatePayload: Employee = {
      ...formData,
      id: currentEmployee?.id,
    };

    updateEmployee({ ...updatePayload })
      .unwrap()
      .then(() => {
        notifications.show({
          title: "Success",
          message: `${formData.firstName} ${formData.lastName}'s detail is updated successfully!`,
          color: "green",
        });
        router.push(`/employees/detail/${id}`);
      })
      .catch((err) => {
        console.error("Failed to update employee:", err);
        notifications.show({
          title: "Error",
          message: `Failed to update employee`,
          color: "red",
        });
      });
  };

  if (isLoading)
    return (
      <LoadingOverlay
        visible={isLoading}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
      />
    );

  if (!currentEmployee)
    return (
      <EmptyState
        title="Employee not found"
        description="The requested employee could not be loaded"
      />
    );

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
      <ReusableCard title="Edit Employee Detail">
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
        <EmployeeForm
          editMode="edit"
          data={currentEmployee}
          departments={departments}
          positions={positions}
          onDelete={(row: Employee) =>
            handleDelete(row?.id ?? "", `${row.firstName} ${row.lastName}`)
          }
          onSubmit={handleSubmit}
          onCancel={handleCancelEdit}
        />
      </ReusableCard>
    </>
  );
}
