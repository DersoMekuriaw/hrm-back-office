import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Employee } from "../types/employee.type";

export const employeeApi = createApi({
  reducerPath: "employeeApi",
  tagTypes: ["Employee"],
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:4000/" }),
  endpoints: (builder) => ({
    getEmployees: builder.query< Employee[], { limit?: number; offset?: number; search?: string; status?: string }>({
      query: ({ limit = 10, offset = 0, search = "", status = "" }) => {
        const params = new URLSearchParams();
        params.append("_limit", limit.toString());
        params.append("_start", offset.toString()); 

        if (status) params.append("status", status);

        if (search) {
          params.append("firstName_like", search);
          params.append("lastName_like", search);
          params.append("email_like", search);
          params.append("phone_like", search);
        }

        return `/employees?${params.toString()}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Employee" as const, id })),
              "Employee",
            ]
          : ["Employee"],
    }),

    getEmployee: builder.query<Employee, string>({
      query: (id) => `/employees/${id}`,
      providesTags: (result, error, id) => [{ type: "Employee", id }],
    }),

    createEmployee: builder.mutation({
      query: (data) => ({
        url: "/employees",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Employee"],
      async onQueryStarted(employee, { dispatch, queryFulfilled }) {
        try {
          const { data: createdEmployee } = await queryFulfilled;
          dispatch(
            employeeApi.util.updateQueryData("getEmployees", {}, (draft) => {
              draft.unshift(createdEmployee);
            })
          );
        } catch {}
      },
    }),

    updateEmployee: builder.mutation({
      query: ({ id, ...updates }) => ({
        url: `/employees/${id}`,
        method: "PUT",
        body: updates,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Employee", id }],
      async onQueryStarted({ id, ...updates }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          employeeApi.util.updateQueryData("getEmployee", id, (draft) => {
            Object.assign(draft, updates);
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),

    deleteEmployee: builder.mutation({
      query: (id) => ({
        url: `/employees/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Employee"],
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          employeeApi.util.updateQueryData("getEmployees", {}, (draft) => {
            return draft.filter((employee) => employee.id !== id);
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
});

export const {
  useGetEmployeesQuery,
  useCreateEmployeeMutation,
  useGetEmployeeQuery,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
} = employeeApi;
