import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithAuth } from './baseQuery'

interface DashboardResponse {
  success: boolean
  data: any
}

export const dashboardApi = createApi({
  reducerPath: 'dashboardApi',
  baseQuery: baseQueryWithAuth,
  endpoints: (builder) => ({
    getDashboard: builder.query<DashboardResponse, void>({
      query: () => ({ url: '/dashboard' }),
    }),
  }),
})

export const { useGetDashboardQuery } = dashboardApi
