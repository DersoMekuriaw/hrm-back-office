"use client";
import { ReusableCard } from "@/shared/reusable-card/ReusableCard";
import { useGetPositionsQuery } from "@/store/position.api";
import React, { useState } from "react";
import { notifications } from "@mantine/notifications";
import { Pagination } from "@/shared/pagination/Pagination";
import { RoleSettingForm } from "./_components/RoleSettingForm";
import { RoleSettingList } from "./_components/RoleSettingList";
import { useGetDepartmentsQuery } from "@/store/department.api";
import { useGetEmployeesQuery } from "@/store/employee.api";
import {
  useCreateRoleHistoryMutation,
  useDeleteRoleHistoryMutation,
  useGetRoleHistoriesQuery,
  useUpdateRoleHistoryMutation,
} from "@/store/roleHistory.api";
import { RoleSettingSchemaFormValues } from "@/schemas/role-setting.schema";
import { v4 as uuidv4 } from "uuid";
import { modals } from "@mantine/modals";
import { Box, LoadingOverlay } from "@mantine/core";

const RoleSettingPage = () => {
  const [deleteRoleHistory] = useDeleteRoleHistoryMutation();
  const [addRoleHistory] = useCreateRoleHistoryMutation();
  const [updateRoleHistory] = useUpdateRoleHistoryMutation();

  interface RoleSetting {
    id?: string;
    employeeId: string;
    departmentId: string;
    positionId: string;
    startDate: string;
    endDate: string;
    sector: string;
  }

  const createDefaultPosition = (): RoleSetting => ({
    id: "",
    employeeId: "",
    departmentId: "",
    positionId: "",
    startDate: "",
    endDate: "",
    sector: "",
  });

  const [selectedData, setSelectedData] = useState<RoleSetting>(
    createDefaultPosition()
  );

  const [filterValue, setFilterValue] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const { data: roleHistories = [], isLoading: rolesHistoryLoading } =
    useGetRoleHistoriesQuery({});
  const { data: employees = [], isLoading: empLoading } = useGetEmployeesQuery(
    {}
  );
  const { data: departments = [], isLoading: deptsLoading } =
    useGetDepartmentsQuery({});
  const {
    data: positions = [],
    isLoading: posLoading,
    isError,
    refetch,
  } = useGetPositionsQuery({
    limit: pageSize,
    offset: (page - 1) * pageSize,
    search: query,
    sector: filterValue,
  });

  const isLoading =
    rolesHistoryLoading || empLoading || deptsLoading || posLoading;

  const total = positions?.length ?? 0;
  const totalPages = Math.ceil(total / pageSize);

  const handleSubmit = async (formData: RoleSettingSchemaFormValues) => {
    try {
      if (selectedData?.id) {
        const updatePayload: RoleSetting = {
          id: selectedData?.id,
          ...formData,
        };
        await updateRoleHistory({ ...updatePayload })
          .unwrap()
          .then(() => {
            notifications.show({
              title: "Success",
              message: `Role setting detail is updated successfully!`,
              color: "green",
            });
          })
          .catch((err) => {
            console.error("Failed to update role history:", err);
          });
      } else {
        try {
          const createPayload: RoleSetting = {
            ...formData,
            id: uuidv4(),
          };
          await addRoleHistory(createPayload).unwrap();
          notifications.show({
            title: "Success",
            message: `Role detail is registered successfully!`,
            color: "green",
          });
        } catch (err) {
          console.error("Failed to add role history:", err);
        }
      }
      await refetch();
    } catch (err) {
      console.error("Failed to submit role history:", err);
      notifications.show({
        title: "Error",
        message: "Failed to submit role history",
        color: "red",
      });
    }
  };

  const handleDelete = async () => {
    modals.openConfirmModal({
      title: `Are you sure you want to delete?`,
      children: <p>This action cannot be undone.</p>,
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: async () => {
        try {
          await deleteRoleHistory(String(selectedData?.id)).unwrap();
          setSelectedData(createDefaultPosition());
          await refetch();
          notifications.show({
            title: "Success",
            message: `Role is deleted successfully!`,
            color: "green",
          });
        } catch (error) {
          notifications.show({
            title: "Error",
            message: `Failed to delete role`,
            color: "red",
          });
          console.error("Error on deleting role", error);
        }
      },
    });
  };

  const columns = [
    { key: "employeeName", label: "Employee" },
    { key: "departmentName", label: "Department" },
    { key: "positionTitle", label: "Position" },
    // { key: "sector", label: "Sector" },
  ];

  if (isError)
    return <div className="text-red-600 text-center">Failed to load data.</div>;

  const roleHistoriesWithDisplay = roleHistories.map((role) => {
    const employee = employees.find((e) => e.id === role.employeeId);
    const department = departments.find((d) => d.id === role.departmentId);
    const position = positions.find((p) => p.id === role.positionId);

    return {
      ...role,
      employeeName: employee
        ? `${employee.firstName} ${employee.lastName}`
        : "Unknown",
      departmentName: department?.name || "Unknown",
      positionTitle: position?.title || "Unknown",
    };
  });

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
        <ReusableCard title="Active Roles" collapsible={false}>
          <RoleSettingList
            isLoading={isLoading}
            data={roleHistoriesWithDisplay}
            columns={columns}
            onFilter={(filterValue: string) => setFilterValue(filterValue)}
            onSearch={(inputValue: string) => setQuery(inputValue)}
            onViewDetail={(row) => {
              const original = roleHistories.find((r) => r.id === row.id);
              console.log("Original: ", original);
              if (original) setSelectedData(original);
            }}
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
          title={selectedData.id ? "Edit Role Assignment" : "Assign New Role"}
          collapsible={false}
        >
          <RoleSettingForm
            departments={departments}
            positions={positions}
            employees={employees}
            selectedRow={selectedData}
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

export default RoleSettingPage;
