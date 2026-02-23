import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithAuth } from './baseQuery'

// ── Types ─────────────────────────────────────────────────────────────────────

export interface StadiumLevel {
  id: number
  name_en: string
  name_ar: string
  desc_en?: string
  desc_ar?: string
  seating_image?: string
  price?: string | number
  price_raw?: number
  quantity?: number
  low_quantity?: number
  sold_quantity?: number
}

export interface Stadium {
  id: number
  name_en: string
  name_ar: string
  capacity: number | string
  image?: string
  country_id?: number
  city_id?: number
  created_at: string
  levels: StadiumLevel[]
  country?: { id: number; name_en: string; name_ar: string }
  city?: { id: number; name_en: string; name_ar: string }
}

interface StadiumListResponse {
  status: number
  message: string
  data: {
    current_page: number
    data: Stadium[]
    last_page: number
    per_page: number
    total: number
    from: number
    to: number
  }
}

interface StadiumSingleResponse {
  status: number
  message: string
  data: Stadium
}

interface StadiumDeleteResponse {
  status: number
  message: string
}

export interface StadiumLevelInput {
  id?: number
  name_en: string
  name_ar: string
  desc_en?: string
  desc_ar?: string
  seating_image?: File | null
}

export interface CreateStadiumPayload {
  name_en: string
  name_ar: string
  capacity: number | string
  country_id: number
  city_id: number
  image?: File | null
  levels: StadiumLevelInput[]
}

export interface UpdateStadiumPayload extends CreateStadiumPayload {
  id: number
}

// ── API slice ─────────────────────────────────────────────────────────────────

const buildStadiumFormData = (
  name_en: string,
  name_ar: string,
  capacity: number | string,
  country_id: number,
  city_id: number,
  image: File | null | undefined,
  levels: StadiumLevelInput[],
) => {
  const fd = new FormData()
  fd.append('name_en', name_en)
  fd.append('name_ar', name_ar)
  fd.append('capacity', String(capacity))
  fd.append('country_id', String(country_id))
  fd.append('city_id', String(city_id))
  if (image) fd.append('image', image)
  levels.forEach((lvl) => {
    if (lvl.id !== undefined) fd.append('levels_id[]', String(lvl.id))
    fd.append('levels_name_en[]', lvl.name_en)
    fd.append('levels_name_ar[]', lvl.name_ar)
    fd.append('levels_desc_en[]', lvl.desc_en || '')
    fd.append('levels_desc_ar[]', lvl.desc_ar || '')
    if (lvl.seating_image instanceof File) fd.append('levels_seating_image[]', lvl.seating_image)
  })
  return fd
}

export const stadiumsApi = createApi({
  reducerPath: 'stadiumsApi',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Stadium'],
  endpoints: (builder) => ({
    getStadiums: builder.query<StadiumListResponse, { page?: number; per_page?: number; search?: string } | void>({
      query: (params) => {
        const { page = 1, per_page = 100, search = '' } = params || {}
        return { url: '/admin/stadiums', params: { page, per_page, ...(search ? { search } : {}) } }
      },
      providesTags: (result) =>
        result
          ? [...result.data.data.map(({ id }) => ({ type: 'Stadium' as const, id })), { type: 'Stadium', id: 'LIST' }]
          : [{ type: 'Stadium', id: 'LIST' }],
    }),

    createStadium: builder.mutation<StadiumSingleResponse, CreateStadiumPayload>({
      query: ({ name_en, name_ar, capacity, country_id, city_id, image, levels }) => ({
        url: '/admin/stadiums',
        method: 'POST',
        body: buildStadiumFormData(name_en, name_ar, capacity, country_id, city_id, image, levels),
      }),
      invalidatesTags: [{ type: 'Stadium', id: 'LIST' }],
    }),

    updateStadium: builder.mutation<StadiumSingleResponse, UpdateStadiumPayload>({
      query: ({ id, name_en, name_ar, capacity, country_id, city_id, image, levels }) => ({
        url: `/admin/stadiums/update/${id}`,
        method: 'POST',
        body: buildStadiumFormData(name_en, name_ar, capacity, country_id, city_id, image, levels),
      }),
      invalidatesTags: (_r, _e, arg) => [{ type: 'Stadium', id: arg.id }, { type: 'Stadium', id: 'LIST' }],
    }),

    deleteStadium: builder.mutation<StadiumDeleteResponse, number>({
      query: (id) => ({ url: `/admin/stadiums/${id}`, method: 'DELETE' }),
      invalidatesTags: [{ type: 'Stadium', id: 'LIST' }],
    }),

    bulkDestroyStadiums: builder.mutation<StadiumDeleteResponse, number[]>({
      query: (ids) => {
        const fd = new FormData()
        ids.forEach((id) => fd.append('ids[]', String(id)))
        return { url: '/admin/stadiums/bulk-destroy', method: 'POST', body: fd }
      },
      invalidatesTags: [{ type: 'Stadium', id: 'LIST' }],
    }),
  }),
})

export const {
  useGetStadiumsQuery,
  useCreateStadiumMutation,
  useUpdateStadiumMutation,
  useDeleteStadiumMutation,
  useBulkDestroyStadiumsMutation,
} = stadiumsApi
