"use client";
import { ReusableCard } from "@/shared/reusable-card/ReusableCard";
import {
  useCreateDepartmentMutation,
  useDeleteDepartmentMutation,
  useGetDepartmentsQuery,
  useUpdateDepartmentMutation,
} from "@/store/department.api";
import React, { useState } from "react";
import { notifications } from "@mantine/notifications";
import { Pagination } from "@/shared/pagination/Pagination";
import { Department } from "@/types/employee.type";
import { DepartmentForm } from "./_components/DepartmentForm";
import { DepartmentFormValues } from "@/schemas/department.schema";
import { DepartmentList } from "./_components/DepartmentList";
import { v4 as uuidv4 } from "uuid";
import { modals } from "@mantine/modals";
import { Box, LoadingOverlay } from "@mantine/core";

const DepartmentsPage = () => {
  const [deleteDepartment] = useDeleteDepartmentMutation();
  const [addDepartment] = useCreateDepartmentMutation();
  const [updateDepartment] = useUpdateDepartmentMutation();

  const createDefaultDepartment = (): Department => ({
    id: "",
    sector: "",
    parentId: "",
    name: "",
    description: "",
  });

  const [selectedData, setSelectedData] = useState<Department>(
    createDefaultDepartment()
  );

  const [sector, setSector] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const {
    data: departments,
    isLoading,
    isError,
    refetch,
  } = useGetDepartmentsQuery({
    limit: pageSize,
    offset: (page - 1) * pageSize,
    search: query,
    sector: sector,
  });

  const total = departments?.length ?? 0;
  const totalPages = Math.ceil(total / pageSize);

  const handleSubmit = async (formData: DepartmentFormValues) => {
    try {
      if (selectedData?.id) {
        const updatePayload: Department = {
          ...formData,
          id: selectedData?.id,
          parentId: formData.parentId || undefined,
        };
        await updateDepartment({ ...updatePayload })
          .unwrap()
          .then(() => {
            notifications.show({
              title: "Success",
              message: `${formData.name}'s detail is updated successfully!`,
              color: "green",
            });
          })
          .catch((err) => {
            console.error("Failed to update department:", err);
          });
      } else {
        try {
          const createPayload: Department = {
            ...formData,
            id: uuidv4(),
            parentId: formData.parentId || undefined,
          };
          await addDepartment(createPayload).unwrap();
          notifications.show({
            title: "Success",
            message: `Department is registered successfully!`,
            color: "green",
          });
        } catch (err) {
          console.error("Failed to add department:", err);
        }
      }

      await refetch();
    } catch (err) {
      console.error("Failed to submit department:", err);
      notifications.show({
        title: "Error",
        message: "Failed to submit department",
        color: "red",
      });
    }
  };

  const handleDelete = async () => {
    modals.openConfirmModal({
      title: `Are you sure you want to delete ${selectedData?.name}?`,
      children: <p>This action cannot be undone.</p>,
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: async () => {
        try {
          await deleteDepartment(selectedData?.id).unwrap();
          setSelectedData(createDefaultDepartment());
          notifications.show({
            title: "Success",
            message: `Department is deleted successfully!`,
            color: "green",
          });
        } catch (error) {
          notifications.show({
            title: "Error",
            message: `Failed to delete department`,
            color: "red",
          });
          console.error("Error on deleting department", error);
        }
      },
    });
  };
  const handleViewDetail = (row: Department) => {
    setSelectedData(row);
  };
  const columns = [
    { key: "name", label: "Department Name" },
    { key: "description", label: "Description" },
  ];

  if (isError)
    return (
      <div className="text-red-600 text-center">
        Failed to load departments.
      </div>
    );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div>
        <ReusableCard title="List of Departments" collapsible={false}>
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
          <DepartmentList
            isLoading={isLoading}
            data={departments || []}
            columns={columns}
            onFilter={(filterValue: string) => setSector(filterValue)}
            onSearch={(inputValue: string) => setQuery(inputValue)}
            onViewDetail={(row) => handleViewDetail(row)}
          />
          <Pagination
            page={page}
            totalPages={totalPages}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
          />
        </ReusableCard>
      </div>
      <div>
        <ReusableCard
          title={selectedData.id ? "Edit Department" : "Add New Department"}
          collapsible={false}
        >
          <DepartmentForm
            departments={departments || []}
            data={selectedData}
            editMode={selectedData.id ? "edit" : "new"}
            onSubmit={handleSubmit}
            onDelete={handleDelete}
            onCancel={() => setSelectedData(createDefaultDepartment())}
          />
        </ReusableCard>
      </div>
    </div>
  );
};

export default DepartmentsPage;
