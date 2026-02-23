import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithAuth } from './baseQuery'

// ── Types ─────────────────────────────────────────────────────────────────────

export interface TicketStadiumLevel {
  id: number
  name_en: string
  name_ar: string
  seating_image?: string
  price: string
  price_raw: number
  quantity: number
  low_quantity: number
  sold_quantity: number
}

export interface MatchTicket {
  id: number
  match: {
    id: number
    match_datetime: string
    first_team?: { id: number; name_en: string; name_ar: string; logo?: string }
    second_team?: { id: number; name_en: string; name_ar: string; logo?: string }
    tournament?: { id: number; name_en: string; name_ar: string }
    stadium?: { id: number; name_en: string; name_ar: string }
  }
  stadium_level: TicketStadiumLevel
}

interface TicketPagination {
  current_page: number
  total: number
  per_page: number
  last_page: number
}

interface TicketListResponse {
  status: number
  message: string
  data: {
    tickets: MatchTicket[]
    pagination: TicketPagination
  }
}

interface TicketSingleResponse {
  status: number
  message: string
  data: MatchTicket
}

interface TicketDeleteResponse {
  status: number
  message: string
}

export interface TicketLevelInput {
  stadium_level_id: number
  price: number | string
  quantity: number | string
  low_quantity: number | string
}

export interface CreateTicketPayload {
  match_id: number
  levels: TicketLevelInput[]
}

export interface UpdateTicketPayload {
  id: number
  match_id: number
  stadium_level_id: number
  price: number | string
  quantity: number | string
  low_quantity: number | string
}

// ── API slice ─────────────────────────────────────────────────────────────────

export const ticketsApi = createApi({
  reducerPath: 'ticketsApi',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Ticket'],
  endpoints: (builder) => ({
    getTickets: builder.query<TicketListResponse, { page?: number; per_page?: number } | void>({
      query: (params) => {
        const { page = 1, per_page = 10 } = params || {}
        return { url: '/admin/match-tickets', params: { page, per_page } }
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.tickets.map(({ id }) => ({ type: 'Ticket' as const, id })),
              { type: 'Ticket', id: 'LIST' },
            ]
          : [{ type: 'Ticket', id: 'LIST' }],
    }),

    createTicket: builder.mutation<TicketSingleResponse, CreateTicketPayload>({
      query: ({ match_id, levels }) => {
        const fd = new FormData()
        fd.append('match_id', String(match_id))
        levels.forEach((lvl) => {
          fd.append('stadium_level_id[]', String(lvl.stadium_level_id))
          fd.append('price[]', String(lvl.price))
          fd.append('quantity[]', String(lvl.quantity))
          fd.append('low_quantity[]', String(lvl.low_quantity))
        })
        return { url: '/admin/match-tickets', method: 'POST', body: fd }
      },
      invalidatesTags: [{ type: 'Ticket', id: 'LIST' }],
    }),

    updateTicket: builder.mutation<TicketSingleResponse, UpdateTicketPayload>({
      query: ({ id, match_id, stadium_level_id, price, quantity, low_quantity }) => {
        const fd = new FormData()
        fd.append('match_id', String(match_id))
        fd.append('stadium_level_id[]', String(stadium_level_id))
        fd.append('price[]', String(price))
        fd.append('quantity[]', String(quantity))
        fd.append('low_quantity[]', String(low_quantity))
        return { url: `/admin/match-tickets/update/${id}`, method: 'POST', body: fd }
      },
      invalidatesTags: (_r, _e, arg) => [{ type: 'Ticket', id: arg.id }, { type: 'Ticket', id: 'LIST' }],
    }),

    deleteTicket: builder.mutation<TicketDeleteResponse, number>({
      query: (id) => ({ url: `/admin/match-tickets/${id}`, method: 'DELETE' }),
      invalidatesTags: [{ type: 'Ticket', id: 'LIST' }],
    }),

    bulkDestroyTickets: builder.mutation<TicketDeleteResponse, number[]>({
      query: (ids) => {
        const fd = new FormData()
        ids.forEach((id) => fd.append('ids[]', String(id)))
        return { url: '/admin/match-tickets/bulk-destroy', method: 'POST', body: fd }
      },
      invalidatesTags: [{ type: 'Ticket', id: 'LIST' }],
    }),
  }),
})

export const {
  useGetTicketsQuery,
  useCreateTicketMutation,
  useUpdateTicketMutation,
  useDeleteTicketMutation,
  useBulkDestroyTicketsMutation,
} = ticketsApi
