import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithAuth } from './baseQuery'

// ── Types ─────────────────────────────────────────────────────────────────────

export interface BookingItem {
  level_name: string
  tickets_count: number
  price_per_ticket: string | number
  subtotal: string | number
}

export interface Booking {
  id: number
  customer?: {
    id: number
    name: string
    email: string
    phone: string
    country?: { name_en: string; name_ar: string }
    city?: { name_en: string; name_ar: string }
  }
  match?: {
    id: number
    match_datetime: string
    first_team?: { id: number; name_en: string; name_ar: string; logo?: string }
    second_team?: { id: number; name_en: string; name_ar: string; logo?: string }
    tournament?: { id: number; name_en: string; name_ar: string }
    stadium?: { id: number; name_en: string; name_ar: string }
  }
  items?: BookingItem[]
  tickets_count: number
  total_amount: string | number
  status: string
  rejection_reason?: string
  requested_at: string
  processed_at?: string
}

export interface BookingStatistics {
  total_bookings: number
  pending_bookings: number
  approved_bookings: number
  rejected_bookings: number
  total_revenue: string | number
}

interface BookingListResponse {
  status: number
  message: string
  data: {
    statistics?: BookingStatistics
    bookings: Booking[]
    pagination: {
      current_page: number
      total: number
      per_page: number
      last_page: number
    }
  }
}

interface BookingStatusResponse {
  status: number
  message: string
  data?: Booking
}

export interface UpdateBookingStatusPayload {
  id: number
  status: 'approved' | 'rejected'
  rejection_reason?: string
}

// ── API slice ─────────────────────────────────────────────────────────────────

export const bookingApi = createApi({
  reducerPath: 'bookingApi',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Booking'],
  endpoints: (builder) => ({
    getBookings: builder.query<BookingListResponse, { page?: number; per_page?: number } | void>({
      query: (params) => {
        const { page = 1, per_page = 10 } = params || {}
        return { url: '/admin/booking', params: { page, per_page } }
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.bookings.map(({ id }) => ({ type: 'Booking' as const, id })),
              { type: 'Booking', id: 'LIST' },
            ]
          : [{ type: 'Booking', id: 'LIST' }],
    }),

    updateBookingStatus: builder.mutation<BookingStatusResponse, UpdateBookingStatusPayload>({
      query: ({ id, status, rejection_reason }) => {
        const fd = new FormData()
        fd.append('id', String(id))
        fd.append('status', status)
        if (rejection_reason) fd.append('rejection_reason', rejection_reason)
        return { url: '/admin/booking/status', method: 'POST', body: fd }
      },
      invalidatesTags: (_r, _e, arg) => [{ type: 'Booking', id: arg.id }, { type: 'Booking', id: 'LIST' }],
    }),
  }),
})

export const {
  useGetBookingsQuery,
  useUpdateBookingStatusMutation,
} = bookingApi
