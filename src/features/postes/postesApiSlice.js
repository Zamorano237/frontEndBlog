import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const postesAdapter = createEntityAdapter({
  sortComparer: (a, b) =>
    a.createdAt === b.createdAt ? 0 : a.createdAt ? 1 : -1,
});

const initialState = postesAdapter.getInitialState();

export const postesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPostes: builder.query({
      query: () => ({
        url: "/posts",
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      transformResponse: (responseData) => {
        const loadedPostes = responseData.map((poste) => {
          poste.id = poste._id;
          return poste;
        });
        return postesAdapter.setAll(initialState, loadedPostes);
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "Poste", id: "LIST" },
            ...result.ids.map((id) => ({ type: "Poste", id })),
          ];
        } else return [{ type: "Poste", id: "LIST" }];
      },
    }),
    addNewPoste: builder.mutation({
      query: (initialPoste) => ({
        url: "/postes",
        method: "POST",
        body: {
          ...initialPoste,
        },
      }),
      invalidatesTags: [{ type: "Poste", id: "LIST" }],
    }),
    updatePoste: builder.mutation({
      query: (initialPoste) => ({
        url: "/postes",
        method: "PATCH",
        body: {
          ...initialPoste,
        },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Poste", id: arg.id }],
    }),
    deletePoste: builder.mutation({
      query: ({ id }) => ({
        url: `/posts`,
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Poste", id: arg.id }],
    }),
  }),
});

export const {
  useGetPostesQuery,
  useAddNewPosteMutation,
  useUpdatePosteMutation,
  useDeletePosteMutation,
} = postesApiSlice;

// returns the query result object
export const selectPostesResult = postesApiSlice.endpoints.getPostes.select();

// creates memoized selector
const selectPostesData = createSelector(
  selectPostesResult,
  (postesResult) => postesResult.data // normalized state object with ids & entities
);

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllPostes,
  selectById: selectPosteById,
  selectIds: selectPosteIds,
  // Pass in a selector that returns the postes slice of state
} = postesAdapter.getSelectors(
  (state) => selectPostesData(state) ?? initialState
);
