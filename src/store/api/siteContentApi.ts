import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithAuth } from './baseQuery'

// Types
export interface Setting {
  id?: number
  key: string
  value: string | null
  value_ar?: string | null
  type: string
  group: string
  created_at?: string
  updated_at?: string
}

export interface StaticPage {
  id?: number
  key: string
  title: string
  title_ar?: string
  content: string
  content_ar?: string
  is_published: boolean
  created_at?: string
  updated_at?: string
}

export interface SettingsResponse {
  success: boolean
  data: Setting[]
}

export interface StaticPageResponse {
  success: boolean
  data: StaticPage
}

export interface BulkSettingsRequest {
  settings: Array<{
    key: string
    value: string
    value_ar?: string
    type: string
    group: string
  }>
}

// API Slice
export const siteContentApi = createApi({
  reducerPath: 'siteContentApi',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Settings', 'StaticPage'],
  endpoints: (builder) => ({
    // Get settings by group
    getSettingsByGroup: builder.query<SettingsResponse, string>({
      query: (group) => `/dashboard/settings?group=${group}`,
      providesTags: (result, error, group) => [{ type: 'Settings', id: group }],
    }),

    // Bulk update settings
    bulkUpdateSettings: builder.mutation<SettingsResponse, BulkSettingsRequest>({
      query: (body) => ({
        url: '/dashboard/settings/bulk',
        method: 'POST',
        body,
      }),
      invalidatesTags: (result, error, arg) => {
        const groups = [...new Set(arg.settings.map(s => s.group))]
        return groups.map(group => ({ type: 'Settings', id: group }))
      },
    }),

    // Get static page by key
    getStaticPage: builder.query<StaticPageResponse, string>({
      query: (key) => `/dashboard/static-pages/${key}`,
      providesTags: (result, error, key) => [{ type: 'StaticPage', id: key }],
    }),

    // Update static page
    updateStaticPage: builder.mutation<StaticPageResponse, Partial<StaticPage> & { key: string }>({
      query: (body) => ({
        url: '/dashboard/static-pages',
        method: 'POST',
        body,
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'StaticPage', id: arg.key }],
    }),
  }),
})

export const {
  useGetSettingsByGroupQuery,
  useBulkUpdateSettingsMutation,
  useGetStaticPageQuery,
  useUpdateStaticPageMutation,
} = siteContentApi