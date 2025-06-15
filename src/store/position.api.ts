import { Position } from "@/types/employee.type";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const positionApi = createApi({
  reducerPath: "positionApi",
  tagTypes: ["Position"],
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:4000/" }),
  endpoints: (builder) => ({
    getPositions: builder.query<
      Position[],
      { limit?: number; offset?: number; search?: string; sector?: string }
    >({
      query: ({ limit = 10, offset = 0, search = "", sector = "" }) => {
        const params = new URLSearchParams();
        params.append("_limit", limit.toString());
        params.append("_start", offset.toString());

        if (sector) params.append("sector", sector);

        if (search) {
          params.append("title_like", search);
          params.append("description_like", search);
        }

        return `/positions?${params.toString()}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Position" as const, id })),
              "Position",
            ]
          : ["Position"],
    }),

    getPosition: builder.query<Position, string>({
      query: (id) => `/positions/${id}`,
      providesTags: (result, error, id) => [{ type: "Position", id }],
    }),
    createPosition: builder.mutation<Position, Partial<Position>>({
      query: (data) => ({
        url: "/positions",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Position"],
      async onQueryStarted(position, { dispatch, queryFulfilled }) {
        try {
          const { data: createPosition } = await queryFulfilled;
          dispatch(
            positionApi.util.updateQueryData("getPositions", {}, (draft) => {
              draft.unshift(createPosition);
            })
          );
        } catch {}
      },
    }),

    updatePosition: builder.mutation({
      query: ({ id, ...updates }) => ({
        url: `/positions/${id}`,
        method: "PUT",
        body: updates,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Position", id }],
      async onQueryStarted({ id, ...updates }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          positionApi.util.updateQueryData("getPosition", id, (draft) => {
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

    deletePosition: builder.mutation<{ success: boolean; id: string }, string>({
      query: (id) => ({
        url: `/positions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Position"],
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          positionApi.util.updateQueryData("getPositions", {}, (draft) => {
            return draft.filter((position) => position.id !== id);
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
  useGetPositionsQuery,
  useGetPositionQuery,
  useCreatePositionMutation,
  useUpdatePositionMutation,
  useDeletePositionMutation,
} = positionApi;
