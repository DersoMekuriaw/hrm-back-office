'use client'

import { Employee, LeaveRequest } from '@/types/employee.type';
import { Button } from '@mantine/core';
import React, { useState } from 'react'

interface EmployeeViewProps {
  employee: Employee;
  department: string;
  position: string;
  leaveRequests: LeaveRequest[];
  onEdit: () => void;
}

const EmployeeView = ({
  employee,
  department,
  position,
  leaveRequests,
  onEdit,
}: EmployeeViewProps) => {
  
  const [activeTab, setActiveTab] = useState('details');

  const employeeLeaveRequests = leaveRequests?.filter((lr) => lr.employeeId === employee.id);

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">

      <div className="border-b border-gray-200">
        <nav className="flex -mb-px">
          <button
            onClick={() => setActiveTab('details')}
            className={`whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm ${
              activeTab === 'details'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Details
          </button>
          {employeeLeaveRequests?.length > 0 &&(
          <button
            onClick={() => setActiveTab('leave')}
            className={`whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm ${
              activeTab === 'leave'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Leave Requests ({employeeLeaveRequests?.length})
          </button>
        )}
        </nav>
      </div>

      <div className="px-4 py-5 sm:p-6">
        {activeTab === 'details' && (
          <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="mt-1 text-sm text-gray-900">{employee?.email}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Phone</dt>
              <dd className="mt-1 text-sm text-gray-900">{employee?.phone}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Department</dt>
              <dd className="mt-1 text-sm text-gray-900">{department}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Position</dt>
              <dd className="mt-1 text-sm text-gray-900">{position}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Hire Date</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(employee?.hireDate).toLocaleDateString()}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Salary</dt>
              <dd className="mt-1 text-sm text-gray-900">
                ${employee?.salary.toLocaleString()}
              </dd>
            </div>
          </div>
        )}

        {activeTab === 'leave' && (
          <div className="overflow-x-auto">
            {employeeLeaveRequests?.length === 0 ? (
              <p className="text-sm text-gray-500">No leave requests found</p>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dates
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reason
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {employeeLeaveRequests.map((request) => (
                    <tr key={request?.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {request?.leaveType}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(request?.startDate).toLocaleDateString()} -{' '}
                        {new Date(request?.endDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {request?.reason}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            request?.status === 'approved'
                              ? 'bg-green-100 text-green-800'
                              : request?.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {request?.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      <div className="px-2 py-2 bg-white shadow rounded-lg border-t border-gray-100 flex justify-end sm:px-6">
          <Button
            size="md"
            className="font-medium bg-red-500 mr-2 hover:bg-red-700 text-white px-2 py-1 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            <span className="sr-only">Delete </span> {/* For screen readers */}
            <span aria-hidden="true">Delete</span>
          </Button>
          <Button
            onClick={onEdit}
            size="md"
            className="font-medium bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            <span className="sr-only">Edit </span> {/* For screen readers */}
            <span aria-hidden="true">Edit</span>
          </Button>
        </div>
    </div>
  );
}

export default EmployeeView;