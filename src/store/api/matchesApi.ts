import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithAuth } from './baseQuery'
import type { StadiumLevel } from './stadiumsApi'

// ── Types ─────────────────────────────────────────────────────────────────────

export interface Match {
  id: number
  first_team_id: number
  second_team_id: number
  tournament_id: number
  stadium_id: number
  supplier_id?: number
  match_datetime: string
  status: string
  created_at: string
  first_team?: { id: number; name_en: string; name_ar: string; logo?: string }
  second_team?: { id: number; name_en: string; name_ar: string; logo?: string }
  tournament?: { id: number; name_en: string; name_ar: string }
  stadium?: { id: number; name_en: string; name_ar: string; levels?: StadiumLevel[] }
  supplier?: { id: number; name: string }
}

interface MatchListResponse {
  status: number
  message: string
  data: {
    current_page: number
    data: Match[]
    last_page: number
    per_page: number
    total: number
    from: number
    to: number
  }
}

interface MatchSingleResponse {
  status: number
  message: string
  data: Match
}

interface MatchDeleteResponse {
  status: number
  message: string
}

export interface CreateMatchPayload {
  first_team_id: number
  second_team_id: number
  tournament_id: number
  stadium_id: number
  match_datetime: string
  supplier_id?: number
}

export interface UpdateMatchPayload extends CreateMatchPayload {
  id: number
}

// ── API slice ─────────────────────────────────────────────────────────────────

export const matchesApi = createApi({
  reducerPath: 'matchesApi',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Match'],
  endpoints: (builder) => ({
    getMatches: builder.query<MatchListResponse, { page?: number; per_page?: number; search?: string } | void>({
      query: (params) => {
        const { page = 1, per_page = 10, search = '' } = params || {}
        return { url: '/admin/matches', params: { page, per_page, ...(search ? { search } : {}) } }
      },
      providesTags: (result) =>
        result
          ? [...result.data.data.map(({ id }) => ({ type: 'Match' as const, id })), { type: 'Match', id: 'LIST' }]
          : [{ type: 'Match', id: 'LIST' }],
    }),

    getMatchWithStadium: builder.query<MatchSingleResponse, number>({
      query: (matchId) => `/admin/matches/stadium/${matchId}`,
    }),

    createMatch: builder.mutation<MatchSingleResponse, CreateMatchPayload>({
      query: (data) => {
        const fd = new FormData()
        Object.entries(data).forEach(([k, v]) => {
          if (v !== undefined && v !== null) fd.append(k, String(v))
        })
        return { url: '/admin/matches', method: 'POST', body: fd }
      },
      invalidatesTags: [{ type: 'Match', id: 'LIST' }],
    }),

    updateMatch: builder.mutation<MatchSingleResponse, UpdateMatchPayload>({
      query: ({ id, ...data }) => {
        const fd = new FormData()
        Object.entries(data).forEach(([k, v]) => {
          if (v !== undefined && v !== null) fd.append(k, String(v))
        })
        return { url: `/admin/matches/update/${id}`, method: 'POST', body: fd }
      },
      invalidatesTags: (_r, _e, arg) => [{ type: 'Match', id: arg.id }, { type: 'Match', id: 'LIST' }],
    }),

    deleteMatch: builder.mutation<MatchDeleteResponse, number>({
      query: (id) => ({ url: `/admin/matches/${id}`, method: 'DELETE' }),
      invalidatesTags: [{ type: 'Match', id: 'LIST' }],
    }),

    bulkDestroyMatches: builder.mutation<MatchDeleteResponse, number[]>({
      query: (ids) => {
        const fd = new FormData()
        ids.forEach((id) => fd.append('ids[]', String(id)))
        return { url: '/admin/matches/bulk-destroy', method: 'POST', body: fd }
      },
      invalidatesTags: [{ type: 'Match', id: 'LIST' }],
    }),
  }),
})

export const {
  useGetMatchesQuery,
  useGetMatchWithStadiumQuery,
  useLazyGetMatchWithStadiumQuery,
  useCreateMatchMutation,
  useUpdateMatchMutation,
  useDeleteMatchMutation,
  useBulkDestroyMatchesMutation,
} = matchesApi
