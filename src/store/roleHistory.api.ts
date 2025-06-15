import { RoleSetting } from "@/types/employee.type";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const roleHistoryApi = createApi({
  reducerPath: "roleHistories",
  tagTypes: ["RoleHistory"],
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:4000/" }),
  endpoints: (builder) => ({
    getRoleHistories: builder.query<RoleSetting[], { limit?: number; offset?: number; search?: string; sector?: string }>({
          query: ({ limit = 10, offset = 0, search = "", sector = "" }) => {
            const params = new URLSearchParams();
            params.append("_limit", limit.toString());
            params.append("_start", offset.toString());
    
            if (sector) params.append("sector", sector);
    
            if (search) {
              params.append("title_like", search);
              params.append("description_like", search);
            }
    
            return `/roleHistories?${params.toString()}`;
          },
          providesTags: (result) =>
            result
              ? [
                  ...result.map(({ id }) => ({ type: "RoleHistory" as const, id })),
                  "RoleHistory",
                ]
              : ["RoleHistory"],
        }),
    
        getRoleHistory: builder.query<RoleSetting, string>({
          query: (id) => `/roleHistories/${id}`,
          providesTags: (result, error, id) => [{ type: "RoleHistory", id }],
        }),

        createRoleHistory: builder.mutation<RoleSetting, Partial<RoleSetting>>({
          query: (data) => ({
            url: "/roleHistories",
            method: "POST",
            body: data,
          }),
          invalidatesTags: ["RoleHistory"],
          async onQueryStarted(history, { dispatch, queryFulfilled }) {
            try {
              const { data: createRoleHistory } = await queryFulfilled;
              dispatch(
                roleHistoryApi.util.updateQueryData("getRoleHistories", {}, (draft) => {
                  draft.unshift(createRoleHistory);
                })
              );
            } catch {}
          },
        }),
    
        updateRoleHistory: builder.mutation({
          query: ({ id, ...updates }) => ({
            url: `/roleHistories/${id}`,
            method: "PUT",
            body: updates,
          }),
          invalidatesTags: (result, error, { id }) => [{ type: "RoleHistory", id }],
          async onQueryStarted({ id, ...updates }, { dispatch, queryFulfilled }) {
            const patchResult = dispatch(
              roleHistoryApi.util.updateQueryData("getRoleHistory", id, (draft) => {
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
    
        deleteRoleHistory: builder.mutation<{ success: boolean; id: string }, string>({
          query: (id) => ({
            url: `/roleHistories/${id}`,
            method: "DELETE",
          }),
          invalidatesTags: ["RoleHistory"],
          async onQueryStarted(id, { dispatch, queryFulfilled }) {
            const patchResult = dispatch(
              roleHistoryApi.util.updateQueryData("getRoleHistories", {}, (draft) => {
                return draft.filter((history) => history.id !== id);
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
  useGetRoleHistoriesQuery,
  useGetRoleHistoryQuery,
  useCreateRoleHistoryMutation,
  useUpdateRoleHistoryMutation,
  useDeleteRoleHistoryMutation,
} = roleHistoryApi;
