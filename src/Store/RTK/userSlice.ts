import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userSlice = createApi({
  reducerPath: "user",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Users"],
  endpoints: (builder) => ({
    getUsers: builder.query<Array<User>, void>({
      query: () => "users",
      providesTags: ["Users"],
    }),

    updateUsers: builder.mutation<Array<User>, string>({
      query: (userId) => ({
        url: `users/update/${userId}`,
        method: 'PUT'
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

export const {
  useGetUsersQuery,
} = userSlice;

export type useGetUsersQueryResult = ReturnType<typeof useGetUsersQuery>

export type User = {
  id: string,
  username?: string,
  email?: string,
  num_solved?: number,
  ac_easy?: number,
  ac_medium?: number,
  ac_hard?: number
}