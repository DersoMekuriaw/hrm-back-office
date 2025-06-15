import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@mantine/core";
import { useEffect } from "react";
import { Department, Employee, Position, SECTORS } from "@/types/employee.type";
import {
  roleSettingSchema,
  RoleSettingSchemaFormValues,
} from "@/schemas/role-setting.schema";

interface RoleSettingFormProps {
  editMode?: string;
  departments: Department[];
  positions: Position[];
  employees: Employee[];
  selectedRow?: RoleSettingSchemaFormValues;

  onSubmit: (data: RoleSettingSchemaFormValues) => void;
  onCancel?: () => void;
  onDelete?: () => void;
}

export function RoleSettingForm({
  editMode = "new",
  departments,
  positions,
  employees,
  selectedRow,

  onSubmit,
  onCancel,
  onDelete,
}: Readonly<RoleSettingFormProps>) {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<RoleSettingSchemaFormValues>({
    resolver: zodResolver(roleSettingSchema),
    defaultValues: selectedRow,
  });

  const sector = watch("sector");
  const departmentId = watch("departmentId");

  useEffect(() => {
    if (selectedRow) {
      reset(selectedRow);

      setTimeout(() => {
        const currentSector = selectedRow.sector;
        const currentDepartmentId = selectedRow.departmentId;

        setValue("sector", currentSector);
        setValue("departmentId", currentDepartmentId);
        setValue("positionId", selectedRow.positionId);
        setValue("employeeId", selectedRow.employeeId);
      }, 0);
    }
  }, [selectedRow, reset]);

  const filteredDepartments = sector
    ? departments.filter((d) => d.sector === sector)
    : departments;

  const filteredPositions = departmentId
    ? positions.filter((p) => p.departmentId === departmentId)
    : positions;

  const filteredEmployees = departmentId
    ? employees.filter((e) => e.departmentId === departmentId)
    : employees;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Sector */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Sector
          </label>
          <select
            {...register("sector")}
            className="mt-1 border border-gray-300 rounded-md px-3 py-1 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option disabled value="">
              Select Sector
            </option>
            {SECTORS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
          {errors.sector && (
            <p className="text-red-600 text-sm">{errors.sector.message}</p>
          )}
        </div>

        {/* Department */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Department
          </label>
          <select
            {...register("departmentId")}
            className={`mt-1 border rounded-md border-gray-300 px-3 py-1 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              !sector ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
            disabled={!sector}
          >
            <option value="">Select Department</option>
            {filteredDepartments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
          {errors.departmentId && (
            <p className="text-red-600 text-sm">
              {errors.departmentId.message}
            </p>
          )}
        </div>

        {/* Position */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Position
          </label>
          <select
            {...register("positionId")}
            className={`mt-1 border rounded-md border-gray-300 px-3 py-1 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 
              ${!departmentId ? "bg-gray-100 cursor-not-allowed" : ""}`}
            disabled={!departmentId}
          >
            <option value="">Select Position</option>
            {filteredPositions.map((pos) => (
              <option key={pos.id} value={pos.id}>
                {pos.title}
              </option>
            ))}
          </select>
          {errors.positionId && (
            <p className="text-red-600 text-sm">{errors.positionId.message}</p>
          )}
        </div>

        {/* Employee */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700">
            Employee
          </label>
          <select
            {...register("employeeId")}
            className={`mt-1 border rounded-md border-gray-300 px-3 py-1 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            <option value="">Select Employee</option>
            {filteredEmployees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.firstName} {emp.lastName}
              </option>
            ))}
          </select>
          {errors.employeeId && (
            <p className="text-red-600 text-sm">{errors.employeeId.message}</p>
          )}
        </div>

        {/* Start Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Start Date
          </label>
          <input
            type="date"
            {...register("startDate")}
            className="mt-1 border border-gray-300 rounded-md px-3 py-1 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.startDate && (
            <p className="text-red-600 text-sm">{errors.startDate.message}</p>
          )}
        </div>

        {/* End Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            End Date
          </label>
          <input
            type="date"
            {...register("endDate")}
            className="mt-1 border border-gray-300 rounded-md px-3 py-1 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.endDate && (
            <p className="text-red-600 text-sm">{errors.endDate.message}</p>
          )}
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 mt-2">
        <Button
          size="sm"
          variant="outline"
          type="button"
          onClick={onCancel}
          className="px-2 py-1 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </Button>
        {editMode === "edit" && (
          <Button
            size="sm"
            variant="danger"
            type="button"
            onClick={onDelete}
            className="font-medium bg-red-500 mr-2 hover:bg-red-700 text-white px-2 py-1 rounded-lg"
          >
            Delete
          </Button>
        )}
        <Button
          type="submit"
          size="sm"
          variant="primary"
          className="font-medium bg-blue-900 hover:bg-blue-700 text-white px-4 py-1 rounded-lg"
        >
          {editMode === "edit" ? "Update" : "Save"}
        </Button>
      </div>
    </form>
  );
}
