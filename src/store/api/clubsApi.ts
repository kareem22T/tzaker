import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithAuth } from './baseQuery'

// ── Club types ────────────────────────────────────────────────────────────────

export interface Club {
  id: number
  name_en: string
  name_ar: string
  logo: string
  slug: string
  status: boolean
  deleted_at: string | null
  created_at: string
  updated_at: string
}

interface ClubListResponse {
  status: number
  message: string
  data: {
    current_page: number
    data: Club[]
    last_page: number
    next_page_url: string | null
    prev_page_url: string | null
    per_page: number
    total: number
    from: number
    to: number
  }
}

interface ClubSingleResponse {
  status: number
  message: string
  data: Club
}

interface ClubDeleteResponse {
  status: number
  message: string
}

export interface CreateClubPayload {
  name_en: string
  name_ar: string
  logo: File
}

export interface UpdateClubPayload {
  id: number
  name_en?: string
  name_ar?: string
  logo?: File
}

// ── API slice ─────────────────────────────────────────────────────────────────

export const clubsApi = createApi({
  reducerPath: 'clubsApi',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Club'],
  endpoints: (builder) => ({
    getClubs: builder.query<ClubListResponse, { page?: number; per_page?: number; search?: string }>({
      query: ({ page = 1, per_page = 10, search = '' }) => ({
        url: '/admin/clubs',
        params: { page, per_page, ...(search ? { search } : {}) },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.data.map(({ id }) => ({ type: 'Club' as const, id })),
              { type: 'Club', id: 'LIST' },
            ]
          : [{ type: 'Club', id: 'LIST' }],
    }),

    createClub: builder.mutation<ClubSingleResponse, CreateClubPayload>({
      query: ({ name_en, name_ar, logo }) => {
        const formData = new FormData()
        formData.append('name_en', name_en)
        formData.append('name_ar', name_ar)
        formData.append('logo', logo)
        return { url: '/admin/clubs', method: 'POST', body: formData }
      },
      invalidatesTags: [{ type: 'Club', id: 'LIST' }],
    }),

    updateClub: builder.mutation<ClubSingleResponse, UpdateClubPayload>({
      query: ({ id, name_en, name_ar, logo }) => {
        const formData = new FormData()
        if (name_en) formData.append('name_en', name_en)
        if (name_ar) formData.append('name_ar', name_ar)
        if (logo) formData.append('logo', logo)
        return { url: `/admin/clubs/update/${id}`, method: 'POST', body: formData }
      },
      invalidatesTags: (_result, _err, arg) => [
        { type: 'Club', id: arg.id },
        { type: 'Club', id: 'LIST' },
      ],
    }),

    deleteClub: builder.mutation<ClubDeleteResponse, number>({
      query: (id) => ({ url: `/admin/clubs/${id}`, method: 'DELETE' }),
      invalidatesTags: [{ type: 'Club', id: 'LIST' }],
    }),
  }),
})

export const {
  useGetClubsQuery,
  useCreateClubMutation,
  useUpdateClubMutation,
  useDeleteClubMutation,
} = clubsApi
