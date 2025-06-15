import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EmployeeFormValues, employeeSchema } from "@/schemas/employee.schema";
import { ACADEMIC_RANKS, Department, Employee, GENDER, JOB_TYPES, Position, SECTORS } from "@/types/employee.type";
import { Button } from "@mantine/core";
import { useEffect } from "react";

interface EmployeeFormProps {
  editMode?: string;
  data?: EmployeeFormValues;
  departments: Department[];
  positions: Position[];
  onSubmit: (data: EmployeeFormValues) => void;
  onCancel: () => void;
  onDelete?: (row: Employee) => void;
}

export function EmployeeForm({
  editMode = "new",
  data,
  departments,
  positions,
  onSubmit,
  onCancel,
  onDelete,
}: Readonly<EmployeeFormProps>) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues: data,
  });

  const sector = watch("sector");
  const departmentId = watch("departmentId");

  useEffect(() => {
    reset(data);
  }, [data, reset]);

  const filteredDepartments = departments.filter((d) => d.sector === sector);
  const filteredJobTypes = JOB_TYPES.filter((d) => d.sector === sector);
  const filteredPositions = positions.filter(
    (p) => p.departmentId === departmentId
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* First name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            First Name
          </label>
          <input
            {...register("firstName")}
            className="border border-gray-300 rounded-lg px-3 py-1 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.firstName && (
            <p className="mt-1 text-sm text-red-600">
              {errors.firstName.message}
            </p>
          )}
        </div>

        {/* Last name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Last Name
          </label>
          <input
            {...register("lastName")}
            className="border border-gray-300 rounded-lg px-3 py-1 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.lastName && (
            <p className="mt-1 text-sm text-red-600">
              {errors.lastName.message}
            </p>
          )}
        </div>

        {/* email */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            {...register("email")}
            className="border border-gray-300 rounded-lg px-3 py-1 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        {/* Phone number */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Phone
          </label>
          <input
            {...register("phone")}
            className="border border-gray-300 rounded-lg px-3 py-1 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
          )}
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Gender
          </label>
          <select
            {...register("gender")}
            className="border border-gray-300 rounded-lg px-3 py-1 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option disabled value="">
              Select Gender
            </option>
            {GENDER.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
          {errors.gender && (
            <p className="mt-1 text-sm text-red-600">{errors.gender.message}</p>
          )}
        </div>

        {/* Birth date */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Birth Date
          </label>
          <input
            type="date"
            {...register("birthDate")}
            className="border border-gray-300 rounded-lg px-3 py-1 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.birthDate && (
            <p className="mt-1 text-sm text-red-600">
              {errors.birthDate.message}
            </p>
          )}
        </div>

        {/* Citizenship */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Citizenship
          </label>
          <input
            type="citizenship"
            {...register("citizenship")}
            className="border border-gray-300 rounded-lg px-3 py-1 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.citizenship && (
            <p className="mt-1 text-sm text-red-600">
              {errors.citizenship.message}
            </p>
          )}
        </div>

        {/* Employee Sector */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Employee Sector
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

        {/* Job type */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Job Type
          </label>
          <select
            {...register("jobTypeId")}
            className={`border border-gray-300 rounded-lg px-3 py-1 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              !sector ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
            disabled={!sector}
            >
            <option value="">Select Job Type</option>
            {filteredJobTypes.map((jobType) => (
              <option key={jobType.id} value={jobType.id}>
                {jobType.title}
              </option>
            ))}
          </select>
          {errors.jobTypeId && (
            <p className="mt-1 text-sm text-red-600">
              {errors.jobTypeId.message}
            </p>
          )}
        </div>

        {/* Academic Rank */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Academic Rank
          </label>
          <select
            {...register("academicRankId")}
            className={`border border-gray-300 rounded-lg px-3 py-1 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              (sector !== 'academic') ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
            disabled={sector !== 'academic'}
            >
            <option value="">Select Academic Rank</option>
            {ACADEMIC_RANKS.map((rank) => (
              <option key={rank.id} value={rank.id}>
                {rank.title}
              </option>
            ))}
          </select>
          {errors.academicRankId && (
            <p className="mt-1 text-sm text-red-600">
              {errors.academicRankId.message}
            </p>
          )}
        </div>

        {/* Department */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Department
          </label>
          <select
            {...register("departmentId")}
            className={`border border-gray-300 rounded-lg px-3 py-1 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${
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
            <p className="mt-1 text-sm text-red-600">
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
            className={`border border-gray-300 rounded-lg px-3 py-1 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              !departmentId ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
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
            <p className="mt-1 text-sm text-red-600">
              {errors.positionId.message}
            </p>
          )}
        </div>

        {/* Hire Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Hire Date
          </label>
          <input
            type="date"
            {...register("hireDate")}
            className="border border-gray-300 rounded-lg px-3 py-1 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.hireDate && (
            <p className="mt-1 text-sm text-red-600">
              {errors.hireDate.message}
            </p>
          )}
        </div>

        {/* Profile Picture */}
          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Profile Picture
            </label>
            <input
              type="file"
              accept="image/png, image/jpeg, image/jpg"
              {...register("profilePicture", {
                required: "Profile picture is required",
                validate: {
                  fileType: (files) =>
                    files?.[0] &&
                    !["image/jpeg", "image/png", "image/jpg"].includes(
                      files[0].type
                    )
                      ? "Only JPG, JPEG, PNG files are allowed"
                      : true,
                },
              })}
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.profilePicture && (
              <p className="mt-1 text-sm text-red-600">
                {errors.profilePicture.message as string}
              </p>
            )}
          </div> */}

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            {...register("status")}
            className="border border-gray-300 rounded-lg px-3 py-1 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option disabled value="">
              Select Status
            </option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          {errors.status && (
            <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
          )}
        </div>
      </div>

        {/* Buttons */}
      <div className="flex justify-end space-x-3 mt-2">
        {editMode === "edit" ? (
          <Button
            onClick={() => onDelete?.(data as Employee)}
            size="sm"
            variant="danger"
            className="font-medium bg-red-500 mr-2 hover:bg-red-700 text-white px-2 py-1 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            <span className="sr-only">Delete </span> {/* For screen readers */}
            <span aria-hidden="true">Delete</span>
          </Button>
        ) : (
          <Button
            size="sm"
            variant="default"
            onClick={onCancel}
            className="px-2 py-1  border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <span className="sr-only">Cancel </span> {/* For screen readers */}
            <span aria-hidden="true">Cancel</span>
          </Button>
        )}
        <Button
          type="submit"
          size="sm"
          variant="primary"
          className="font-medium bg-blue-900 hover:bg-blue-700 text-white px-4 py-1 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          <span className="sr-only">
            {editMode === "edit" ? "Update" : "Save"}
          </span>{" "}
          {/* For screen readers */}
          <span aria-hidden="true">
            {editMode === "edit" ? "Update" : "Save"}
          </span>
        </Button>
      </div>
    </form>
  );
}
