import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { User } from './userSlice'

export const authSlice = createApi({
  reducerPath: "auth",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5173/api" }),
  tagTypes: ["Auth"],
  endpoints: (builder) => ({
    getAuth: builder.query<User, void>({
      query: () => "/auth",
      providesTags: ["Auth"]
    }),
  }),
});

export const {
  useGetAuthQuery,
} = authSlice;

export type useGetAuthQueryResult = ReturnType<typeof useGetAuthQuery>