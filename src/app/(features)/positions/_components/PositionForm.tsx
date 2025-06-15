import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@mantine/core";
import { PositionFormValues, positionSchema } from "@/schemas/position.schema";
import { useEffect } from "react";
import { Department, SECTORS } from "@/types/employee.type";

interface PositionFormProps {
  editMode?: string;
  departments: Department[];
  data?: PositionFormValues;
  onSubmit: (data: PositionFormValues) => void;
  onCancel?: () => void;
  onDelete?: () => void;
}

export function PositionForm({
  editMode = "new",
  departments,
  data,

  onSubmit,
  onCancel,
  onDelete,
}: Readonly<PositionFormProps>) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<PositionFormValues>({
    resolver: zodResolver(positionSchema),
    defaultValues: data,
  });

  const selectedSector = watch("sector");

  useEffect(() => {
    reset(data);
  }, [data, reset]);

  const filteredDepartments = departments.filter(
    (dept) => dept.sector === selectedSector
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Sector
          </label>
          <select
            {...register("sector")}
            className="border border-gray-300 rounded-lg px-3 py-1 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            <p className="mt-1 text-sm text-red-600">{errors.sector.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Department
          </label>
          <select
            {...register("departmentId")}
            className={`border border-gray-300 rounded-lg px-3 py-1 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 
              ${
                !selectedSector ? "bg-gray-100 cursor-not-allowed" : "bg-white"
              }`}
            disabled={!selectedSector}
          >
            <option value="">Select Department</option>
            {filteredDepartments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
          {errors.departmentId && (
            <p className="mt-1 text-sm text-red-600">
              {errors.departmentId.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            {...register("title")}
            className="border border-gray-300 rounded-lg px-3 py-1 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
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
            Term Duration
          </label>
          <input
            type="number"
            {...register("termDuration", { valueAsNumber: true })}
            className="border border-gray-300 rounded-lg px-3 py-1 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.termDuration && (
            <p className="mt-1 text-sm text-red-600">{errors.termDuration.message}</p>
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
