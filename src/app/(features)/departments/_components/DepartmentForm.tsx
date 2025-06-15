import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@mantine/core";
import {
  DepartmentFormValues,
  departmentSchema,
} from "@/schemas/department.schema";
import { useEffect } from "react";
import { Department, SECTORS } from "@/types/employee.type";

interface DepartmentFormProps {
  editMode?: string;
  departments?: Department[];
  data?: DepartmentFormValues;
  onSubmit: (data: DepartmentFormValues) => void;
  onCancel?: () => void;
  onDelete?: () => void;
}

export function DepartmentForm({
  editMode = "new",
  departments,
  data,

  onSubmit,
  onCancel,
  onDelete,
}: Readonly<DepartmentFormProps>) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<DepartmentFormValues>({
    resolver: zodResolver(departmentSchema),
    defaultValues: data,
  });

  const sector = watch("sector");

  useEffect(() => {
    reset(data);
  }, [data, reset]);

  const filteredDepartments = departments?.filter((d) => d.sector === sector);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            {...register("name")}
            className="border border-gray-300 rounded-lg px-3 py-1 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <input
            {...register("description")}
            className="border border-gray-300 rounded-lg px-3 py-1 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">
              {errors.description.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Sector
          </label>
          <select
            {...register("sector")}
            className="border border-gray-300 rounded-lg px-3 py-1 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option disabled value="">Select Sector</option>
            {SECTORS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}

          </select>
          {errors.sector && (
            <p className="mt-1 text-sm text-red-600">{errors.sector.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Department
          </label>
          <select
            {...register("parentId")}
            className={`border border-gray-300 rounded-lg px-3 py-1 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              !sector ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
            disabled={!sector}
          >
            <option value="" className="text-blue-900 text-bold">
              Mark as root
            </option>
            {filteredDepartments?.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
          {errors.parentId && (
            <p className="mt-1 text-sm text-red-600">
              {errors.parentId.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-3 mt-2">
        <Button
          size="sm"
          type="button"
          variant="outline"
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
          size="sm"
          variant="primary"
          type="submit"
          className="font-medium bg-blue-900 hover:bg-blue-700 text-white px-4 py-1 rounded-lg"
        >
          {editMode === "edit" ? "Update" : "Save"}
        </Button>
      </div>
    </form>
  );
}
