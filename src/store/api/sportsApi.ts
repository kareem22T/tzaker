import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithAuth } from './baseQuery'

// ── Types ─────────────────────────────────────────────────────────────────────

export interface Sport {
  id: number
  name_en: string
  name_ar: string
  desc_en: string
  desc_ar: string
  image: string
  slug: string
  sort_order: number
  status: number | string
  created_at: string
}

interface SportListResponse {
  status: number
  message: string
  data: {
    current_page: number
    data: Sport[]
    last_page: number
    per_page: number
    total: number
    from: number
    to: number
  }
}

interface SportSingleResponse {
  status: number
  message: string
  data: Sport
}

interface SportDeleteResponse {
  status: number
  message: string
}

export interface CreateSportPayload {
  name_en: string
  name_ar: string
  desc_en?: string
  desc_ar?: string
  image?: File
}

export interface UpdateSportPayload extends CreateSportPayload {
  id: number
}

// ── API slice ─────────────────────────────────────────────────────────────────

export const sportsApi = createApi({
  reducerPath: 'sportsApi',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Sport'],
  endpoints: (builder) => ({
    getSports: builder.query<SportListResponse, { page?: number; per_page?: number; search?: string } | void>({
      query: (params) => {
        const { page = 1, per_page = 10, search = '' } = params || {}
        return { url: '/admin/sport-categories', params: { page, per_page, ...(search ? { search } : {}) } }
      },
      providesTags: (result) =>
        result
          ? [...result.data.data.map(({ id }) => ({ type: 'Sport' as const, id })), { type: 'Sport', id: 'LIST' }]
          : [{ type: 'Sport', id: 'LIST' }],
    }),

    createSport: builder.mutation<SportSingleResponse, CreateSportPayload>({
      query: ({ name_en, name_ar, desc_en, desc_ar, image }) => {
        const fd = new FormData()
        fd.append('name_en', name_en)
        fd.append('name_ar', name_ar)
        if (desc_en) fd.append('desc_en', desc_en)
        if (desc_ar) fd.append('desc_ar', desc_ar)
        if (image) fd.append('image', image)
        return { url: '/admin/sport-categories', method: 'POST', body: fd }
      },
      invalidatesTags: [{ type: 'Sport', id: 'LIST' }],
    }),

    updateSport: builder.mutation<SportSingleResponse, UpdateSportPayload>({
      query: ({ id, name_en, name_ar, desc_en, desc_ar, image }) => {
        const fd = new FormData()
        fd.append('name_en', name_en)
        fd.append('name_ar', name_ar)
        if (desc_en) fd.append('desc_en', desc_en)
        if (desc_ar) fd.append('desc_ar', desc_ar)
        if (image) fd.append('image', image)
        return { url: `/admin/sport-categories/${id}`, method: 'POST', body: fd }
      },
      invalidatesTags: (_r, _e, arg) => [{ type: 'Sport', id: arg.id }, { type: 'Sport', id: 'LIST' }],
    }),

    deleteSport: builder.mutation<SportDeleteResponse, number>({
      query: (id) => ({ url: `/admin/sport-categories/${id}`, method: 'DELETE' }),
      invalidatesTags: [{ type: 'Sport', id: 'LIST' }],
    }),
  }),
})

export const {
  useGetSportsQuery,
  useCreateSportMutation,
  useUpdateSportMutation,
  useDeleteSportMutation,
} = sportsApi
