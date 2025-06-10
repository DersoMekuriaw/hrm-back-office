import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { EmployeeFormValues, employeeSchema } from '@/lib/employeeSchema';
import { Department, Position } from '@/types/employee.type';
import { Button } from '@mantine/core';

interface EmployeeFormProps {
  editMode?: string;
  employee?: EmployeeFormValues;
  departments: Department[];
  positions: Position[];
  onSubmit: (data: EmployeeFormValues) => void;
  onCancel: () => void;
}

export function EmployeeForm({
  editMode='new',
  employee,
  departments,
  positions,
  onSubmit,
  onCancel,
}: EmployeeFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues: employee,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">First Name</label>
          <input
            {...register('firstName')}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.firstName && (
            <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Last Name</label>
          <input
            {...register('lastName')}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.lastName && (
            <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            {...register('email')}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Phone</label>
          <input
            {...register('phone')}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Department</label>
          <select
            {...register('departmentId', { valueAsNumber: true })}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
          {errors.departmentId && (
            <p className="mt-1 text-sm text-red-600">{errors.departmentId.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Position</label>
          <select
            {...register('positionId', { valueAsNumber: true })}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Position</option>
            {positions.map((pos) => (
              <option key={pos.id} value={pos.id}>
                {pos.title}
              </option>
            ))}
          </select>
          {errors.positionId && (
            <p className="mt-1 text-sm text-red-600">{errors.positionId.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Hire Date</label>
          <input
            type="date"
            {...register('hireDate')}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.hireDate && (
            <p className="mt-1 text-sm text-red-600">{errors.hireDate.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Salary</label>
          <input
            type="number"
            {...register('salary', { valueAsNumber: true })}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.salary && (
            <p className="mt-1 text-sm text-red-600">{errors.salary.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <select
            {...register('status')}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* <div>
          <label className="block text-sm font-medium text-gray-700">Profile Picture URL</label>
          <input
            {...register('profilePicture')}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.profilePicture && (
            <p className="mt-1 text-sm text-red-600">{errors.profilePicture.message}</p>
          )}
        </div> */}
      </div>

      <div className="flex justify-end space-x-3 mt-2">
        {editMode ==='edit'? (
        
        <Button
                    size="md"
                    className="font-medium bg-red-500 mr-2 hover:bg-red-700 text-white px-2 py-1 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                  >
                    <span className="sr-only">Delete </span> {/* For screen readers */}
                    <span aria-hidden="true">Delete</span>
                  </Button>
        ):
          <Button
                    size="md"
                    onClick={onCancel}
                    className="px-2 py-1  border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <span className="sr-only">Cancel </span> {/* For screen readers */}
                    <span aria-hidden="true">Cancel</span>
                  </Button>
}
        <Button
                type="submit"
                    size="md"
                    className="font-medium bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                  >
                    <span className="sr-only">{editMode === 'edit'? "Update": "Save" }</span> {/* For screen readers */}
                    <span aria-hidden="true">{editMode === 'edit'? "Update": "Save" }</span>
                  </Button>
      </div>
    </form>
  );
}