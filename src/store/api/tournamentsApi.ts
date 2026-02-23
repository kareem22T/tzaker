import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithAuth } from './baseQuery'

// ── Types ─────────────────────────────────────────────────────────────────────

export interface Tournament {
  id: number
  name_en: string
  name_ar: string
  description_en: string
  description_ar: string
  slug: string
  status: string | number
  created_at: string
}

interface TournamentListResponse {
  status: number
  message: string
  data: {
    current_page: number
    data: Tournament[]
    last_page: number
    per_page: number
    total: number
    from: number
    to: number
  }
}

interface TournamentSingleResponse {
  status: number
  message: string
  data: Tournament
}

interface TournamentDeleteResponse {
  status: number
  message: string
}

export interface CreateTournamentPayload {
  name_en: string
  name_ar: string
  description_en?: string
  description_ar?: string
}

export interface UpdateTournamentPayload extends CreateTournamentPayload {
  id: number
}

// ── API slice ─────────────────────────────────────────────────────────────────

export const tournamentsApi = createApi({
  reducerPath: 'tournamentsApi',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Tournament'],
  endpoints: (builder) => ({
    getTournaments: builder.query<TournamentListResponse, { page?: number; per_page?: number; search?: string } | void>({
      query: (params) => {
        const { page = 1, per_page = 10, search = '' } = params || {}
        return { url: '/admin/tournaments', params: { page, per_page, ...(search ? { search } : {}) } }
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.data.map(({ id }) => ({ type: 'Tournament' as const, id })),
              { type: 'Tournament', id: 'LIST' },
            ]
          : [{ type: 'Tournament', id: 'LIST' }],
    }),

    createTournament: builder.mutation<TournamentSingleResponse, CreateTournamentPayload>({
      query: (body) => ({ url: '/admin/tournaments', method: 'POST', body }),
      invalidatesTags: [{ type: 'Tournament', id: 'LIST' }],
    }),

    updateTournament: builder.mutation<TournamentSingleResponse, UpdateTournamentPayload>({
      query: ({ id, ...body }) => ({ url: `/admin/tournaments/${id}`, method: 'PUT', body }),
      invalidatesTags: (_r, _e, arg) => [
        { type: 'Tournament', id: arg.id },
        { type: 'Tournament', id: 'LIST' },
      ],
    }),

    deleteTournament: builder.mutation<TournamentDeleteResponse, number>({
      query: (id) => ({ url: `/admin/tournaments/${id}`, method: 'DELETE' }),
      invalidatesTags: [{ type: 'Tournament', id: 'LIST' }],
    }),

    bulkDestroyTournaments: builder.mutation<TournamentDeleteResponse, number[]>({
      query: (ids) => {
        const fd = new FormData()
        ids.forEach((id) => fd.append('ids[]', String(id)))
        return { url: '/admin/tournaments/bulk-destroy/', method: 'POST', body: fd }
      },
      invalidatesTags: [{ type: 'Tournament', id: 'LIST' }],
    }),
  }),
})

export const {
  useGetTournamentsQuery,
  useCreateTournamentMutation,
  useUpdateTournamentMutation,
  useDeleteTournamentMutation,
  useBulkDestroyTournamentsMutation,
} = tournamentsApi
