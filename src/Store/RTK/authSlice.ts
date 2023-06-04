import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { User } from './userSlice'
import { website } from ".";

export const authSlice = createApi({
  reducerPath: "auth",
  baseQuery: fetchBaseQuery({ baseUrl: `${website}/api` }),
  tagTypes: ["Auth"],
  endpoints: (builder) => ({
    getAuth: builder.query<User, void>({
      query: () => "/auth",
      providesTags: ["Auth"]
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: `auth/logout`,
        method: 'POST'
      }),
      invalidatesTags: ["Auth"],
    }),
  }),
});

export const {
  useGetAuthQuery,
  useLogoutMutation
} = authSlice;

export type useGetAuthQueryResult = ReturnType<typeof useGetAuthQuery>