import { Position } from "@/types/employee.type";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const positionApi = createApi({
  reducerPath: "positionApi",
  tagTypes: ['Position'],
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:4000/" }),
  endpoints: (builder) => ({
    getPositions: builder.query<Position[], void>({
      query: () => '/positions',
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'Position' as const, id })), 'Position']
          : ['Position'],
    }),
    getPosition: builder.query<Position, number>({
      query: (id) => `/positions/${id}`,
      providesTags: (result, error, id) => [{ type: 'Position', id }],
    }),
    createPosition: builder.mutation<Position, Partial<Position>>({
      query: (body) => ({
        url: '/positions',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Position'],
    }),
    updatePosition: builder.mutation<Position, Partial<Position>>({
      query: ({ id, ...patch }) => ({
        url: `/positions/${id}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Position', id }],
    }),
    deletePosition: builder.mutation<{ success: boolean; id: number }, number>({
      query: (id) => ({
        url: `/positions/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Position', id }],
    }),
    getPositionsByDepartment: builder.query<Position[], number>({
      query: (departmentId) => `/positions?departmentId=${departmentId}`,
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'Position' as const, id })), 'Position']
          : ['Position'],
    }),
  }),
});

export const {
  useGetPositionsQuery,
  useGetPositionQuery,
  useCreatePositionMutation,
  useUpdatePositionMutation,
  useDeletePositionMutation,
  useGetPositionsByDepartmentQuery,
} = positionApi;