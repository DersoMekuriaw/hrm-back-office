"use client";
import { ReusableCard } from "@/shared/reusable-card/ReusableCard";
import {
  useCreatePositionMutation,
  useDeletePositionMutation,
  useGetPositionsQuery,
  useUpdatePositionMutation,
} from "@/store/position.api";
import React, { useEffect, useState } from "react";
import { notifications } from "@mantine/notifications";
import { Pagination } from "@/shared/pagination/Pagination";
import { Position } from "@/types/employee.type";
import { PositionForm } from "./_components/PositionForm";
import { PositionFormValues } from "@/schemas/position.schema";
import { PositionList } from "./_components/PositionList";
import { useGetDepartmentsQuery } from "@/store/department.api";
import { v4 as uuidv4 } from "uuid";
import { modals } from "@mantine/modals";
import { Box, LoadingOverlay } from "@mantine/core";

const PositionsPage = () => {
  const [deletePosition] = useDeletePositionMutation();
  const [addPosition] = useCreatePositionMutation();
  const [updatePosition] = useUpdatePositionMutation();

  interface NewPositionFormProps {
    id: string;
    sector: string;
    title: string;
    description?: string;
    departmentId: string;
    termDuration: number;
  }

  const createDefaultPosition = (): NewPositionFormProps => ({
    id: "",
    sector: "",
    title: "",
    description: "",
    departmentId: "",
    termDuration: 1
  });

  const [selectedData, setSelectedData] = useState<NewPositionFormProps>(
    createDefaultPosition()
  );

  const [sector, setSector] = useState("");  
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const { data: departments = [] } = useGetDepartmentsQuery({});
  const {
    data: positions,
    isLoading,
    isError,
    refetch,
  } = useGetPositionsQuery({
    limit: pageSize,
    offset: (page - 1) * pageSize,
    search: query,
    sector: sector,
  });

  const total = Number(positions?.length) || 0;

  useEffect(() => {
    refetch();
  }, [page, pageSize, query, refetch]);

  const totalPages = Math.ceil(total / pageSize);

  const handleSubmit = async (formData: PositionFormValues) => {
    try {
      delete formData.sector;
      console.log("Form Data: ", formData);

      if (selectedData?.id) {
        const updatePayload: Position = {
          ...formData,
          id: selectedData?.id,
        };
        await updatePosition({ ...updatePayload })
          .unwrap()
          .then(() => {
            notifications.show({
              title: "Success",
              message: `${formData.title}'s detail is updated successfully!`,
              color: "green",
            });
          })
          .catch((err) => {
            console.error("Failed to update position:", err);
          });
      } else {
        try {
          const createPayload: Position = {
            ...formData,
            id: uuidv4(),
          };
          await addPosition(createPayload).unwrap();
          notifications.show({
            title: "Success",
            message: `Position is registered successfully!`,
            color: "green",
          });
        } catch (err) {
          console.error("Failed to add position:", err);
        }
      }
      await refetch();
    } catch (err) {
      console.error("Failed to submit position:", err);
      notifications.show({
        title: "Error",
        message: "Failed to submit position",
        color: "red",
      });
    }
  };

  const handleDelete = async () => {
    modals.openConfirmModal({
      title: `Are you sure you want to delete ${selectedData?.title}?`,
      children: <p>This action cannot be undone.</p>,
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: async () => {
        try {
          await deletePosition(selectedData?.id).unwrap();
          setSelectedData(createDefaultPosition());
          notifications.show({
            title: "Success",
            message: `Position is deleted successfully!`,
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
  const handleViewDetail = (row: Position) => {
    const selectedSector = departments.find(
      (department) => department.id === row.departmentId
    )?.sector;
    setSelectedData({ sector: selectedSector ?? "", ...row });
  };
  const columns = [
    { key: "title", label: "Title" },
    { key: "description", label: "Description" },
    { key: "termDuration", label: "Term Duration" },
  ];

  if (isError)
    return (
      <div className="text-red-600 text-center">Failed to load positions.</div>
    );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div>
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
        <ReusableCard title="Positions" collapsible={false}>
          <PositionList
            isLoading={isLoading}
            data={positions || []}
            columns={columns}
            onFilter={(filterValue: string) => setSector(filterValue)}
            onSearch={(inputValue: string) => setQuery(inputValue)}
            onViewDetail={(row) => handleViewDetail(row)}
          />
          <Pagination
            page={page}
            totalPages={totalPages}
            pageSize={pageSize}
            onPageChange={(newPage) => setPage(newPage)}
            onPageSizeChange={(newSize) => {
              setPageSize(newSize);
              setPage(1); // Reset to first page when changing page size
            }}
          />
        </ReusableCard>
      </div>
      <div>
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
        <ReusableCard
          title={selectedData.id ? "Edit Position" : "Add Position"}
          collapsible={false}
        >
          <PositionForm
            departments={departments}
            data={selectedData}
            editMode={selectedData.id ? "edit" : "new"}
            onSubmit={handleSubmit}
            onDelete={handleDelete}
            onCancel={() => setSelectedData(createDefaultPosition())}
          />
        </ReusableCard>
      </div>
    </div>
  );
};

export default PositionsPage;
