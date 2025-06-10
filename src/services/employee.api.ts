import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Employee } from "../types/employee.type";

export const employeeApi = createApi({
    reducerPath: "employeeApi",
    tagTypes: ['Employee', 'Department', 'Position', 'LeaveRequest'],
    
    baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:4000/" }),
    endpoints: (builder) => ({
      
      getEmployees: builder.query<Employee[], {limit?: number, offset?: number, search?: string}>({
        query: ({limit, offset, search}) => `/employees?_limit=${limit}&_offset=${offset}&_query=${search}`,
        providesTags: ['Employee'],
      }),

      getEmployee: builder.query<Employee, number>({
        query: (id) => `/employees/${id}`,
        providesTags: (result, error, id) => [{ type: 'Employee', id }],
      }),

      createEmployee: builder.mutation({
        query: (data: Employee) => ({
          url: '/employees',
          method: 'POST',
          body: data,
        }),
        invalidatesTags: ['Employee'], // Invalidate cache after mutation
      }),

      updateEmployee: builder.mutation({
        query: ({ ...employee }: Employee) => ({
          url: `/employees/${employee.id}`,
          method: 'PUT',
          body: employee,
        }),
        invalidatesTags: (result, error, { id }) => [{ type: 'Employee', id }],
      }),

      deleteEmployee: builder.mutation({
        query: (id: number) => ({
          url: `/employees/${id}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['Employee'],
      }),
    }),
  });

export const { 
  useGetEmployeesQuery, 
  useCreateEmployeeMutation, 
  useGetEmployeeQuery, 
  useUpdateEmployeeMutation, 
  useDeleteEmployeeMutation 
} = employeeApi;