import { Department } from "@/types/employee.type";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const departmentApi = createApi({
  reducerPath: "departmentApi",
  tagTypes: ['Department'],
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:4000/" }),
  endpoints: (builder) => ({
    getDepartments: builder.query<Department[], {limit?: number, offset?: number, search?: string, sector?: string}>({
            query: ({ limit = 10, offset = 0, search = "", sector = "" }) => {
        const params = new URLSearchParams();
        params.append("_limit", limit.toString());
        params.append("_start", offset.toString()); 

        if (sector) params.append("sector", sector);

        if (search) {
          params.append("name_like", search);
          params.append("description_like", search);
        }

        return `/departments?${params.toString()}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Department" as const, id })),
              "Department",
            ]
          : ["Department"],
    }),

    getDepartment: builder.query<Department, string>({
      query: (id) => `/departments/${id}`,
      providesTags: (result, error, id) => [{ type: 'Department', id }],
    }),
    createDepartment: builder.mutation<Department, Partial<Department>>({
      query: (data) => ({
        url: "/departments",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Department"],
      async onQueryStarted(employee, { dispatch, queryFulfilled }) {
        try {
          const { data: createDepartment } = await queryFulfilled;
          dispatch(
            departmentApi.util.updateQueryData("getDepartments", {}, (draft) => {
              draft.unshift(createDepartment);
            })
          );
        } catch {}
      },
    }),

    updateDepartment: builder.mutation({
            query: ({ id, ...updates }) => ({
        url: `/departments/${id}`,
        method: "PUT",
        body: updates,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Department", id }],
      async onQueryStarted({ id, ...updates }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          departmentApi.util.updateQueryData("getDepartment", id, (draft) => {
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

    deleteDepartment: builder.mutation<{ success: boolean; id: string }, string>({
      query: (id) => ({
        url: `/departments/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Department"],
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          departmentApi.util.updateQueryData("getDepartments", {}, (draft) => {
            return draft.filter((department) => department.id !== id);
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
  useGetDepartmentsQuery,
  useGetDepartmentQuery,
  useCreateDepartmentMutation,
  useUpdateDepartmentMutation,
  useDeleteDepartmentMutation,
} = departmentApi;