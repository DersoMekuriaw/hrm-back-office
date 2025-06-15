"use client";

import { useRouter } from "next/navigation";
import { EmployeeFormValues } from "@/schemas/employee.schema";
import { useCreateEmployeeMutation } from "@/store/employee.api";
import { useGetDepartmentsQuery } from "@/store/department.api";
import { useGetPositionsQuery } from "@/store/position.api";
import { ReusableCard } from "@/shared/reusable-card/ReusableCard";
import { PageHeader } from "@/shared/page-header/PageHeader";
import { useState } from "react";
import { EmployeeForm } from "../_components/EmployeeForm";
import { v4 as uuidv4 } from "uuid";
import { Employee } from "@/types/employee.type";

export default function NewPage() {
  const router = useRouter();

  const [isFullScreen, setIsFullScreen] = useState(false);
  const [addEmployee] = useCreateEmployeeMutation();

  const { data: departments = [], isLoading: deptsLoading } = useGetDepartmentsQuery({});
  const { data: positions = [], isLoading: posLoading } = useGetPositionsQuery({});

  const isLoading = deptsLoading || posLoading;

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const handleCancel = () => {
    router.push("/employees");
  };

  const handleSubmit = async (formData: EmployeeFormValues) => {
    try {
      const employeePayload: Employee = {
        ...formData,
        id: uuidv4(),
      };
      await addEmployee(employeePayload).unwrap();
      router.push("/employees");
    } catch (err) {
      console.error("Failed to add employee:", err);
    }
  };

  if (isLoading) return <div className="text-center">Loading...</div>;

  return (
    <>
      <PageHeader
        isFullScreen={false}
        backToPrevious={() => router.push(`/employees`)}
        onToggleFullScreen={toggleFullScreen}
      />
      <ReusableCard title="Add New Employee">
        <EmployeeForm
          departments={departments}
          positions={positions}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </ReusableCard>
    </>
  );
}
