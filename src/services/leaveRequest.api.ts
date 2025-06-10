import { LeaveRequest } from "@/types/employee.type";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const leaveRequestApi = createApi({
  reducerPath: "leaveRequestApi",
  tagTypes: ['LeaveRequest'],
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:4000/" }),
  endpoints: (builder) => ({
    getLeaveRequests: builder.query<LeaveRequest[], void>({
      query: () => '/leaveRequests',
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'LeaveRequest' as const, id })), 'LeaveRequest']
          : ['LeaveRequest'],
    }),
    getLeaveRequest: builder.query<LeaveRequest, number>({
      query: (id) => `/leaveRequests/${id}`,
      providesTags: (result, error, id) => [{ type: 'LeaveRequest', id }],
    }),
    createLeaveRequest: builder.mutation<LeaveRequest, Partial<LeaveRequest>>({
      query: (body) => ({
        url: '/leaveRequests',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['LeaveRequest'],
    }),
    updateLeaveRequest: builder.mutation<LeaveRequest, Partial<LeaveRequest>>({
      query: ({ id, ...patch }) => ({
        url: `/leaveRequests/${id}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'LeaveRequest', id }],
    }),
    deleteLeaveRequest: builder.mutation<{ success: boolean; id: number }, number>({
      query: (id) => ({
        url: `/leaveRequests/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'LeaveRequest', id }],
    }),
    getLeaveRequestsByEmployee: builder.query<LeaveRequest[], number>({
      query: (employeeId) => `/leaveRequests?employeeId=${employeeId}`,
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'LeaveRequest' as const, id })), 'LeaveRequest']
          : ['LeaveRequest'],
    }),
  }),
});

export const {
  useGetLeaveRequestsQuery,
  useGetLeaveRequestQuery,
  useCreateLeaveRequestMutation,
  useUpdateLeaveRequestMutation,
  useDeleteLeaveRequestMutation,
  useGetLeaveRequestsByEmployeeQuery,
} = leaveRequestApi;