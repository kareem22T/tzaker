import { fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { BaseQueryFn } from '@reduxjs/toolkit/query'
import type { FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { toast } from 'sonner'
import { BASE_URL } from '../config'

export const rawBaseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('token')
    if (token) headers.set('authorization', `Bearer ${token}`)
    headers.set('Accept', 'application/json')
    return headers
  },
})

/**
 * Attempt to pull a message out of a variety of error shapes returned
 * by the backend. If no message is found, null is returned.
 */
function extractErrorMessage(data: unknown): string | null {
  if (!data || typeof data !== 'object') return null
  const d = data as Record<string, unknown>

  if (typeof d['message'] === 'string' && d['message']) return d['message']

  if (d['errors'] && typeof d['errors'] === 'object') {
    const msgs = Object.values(d['errors'] as Record<string, unknown>)
      .flatMap((v) => (Array.isArray(v) ? v : [v]))
      .filter((v) => typeof v === 'string') as string[]
    if (msgs.length) return msgs.join('\n')
  }

  if (typeof d['error'] === 'string' && d['error']) return d['error']
  return null
}

const AUTH_RESET_PATHS = [
  'departmentsApi', 'faqsApi', 'contactMessagesApi', 'dashboardApi',
  'applicationsApi', 'siteContentApi', 'suppliersApi', 'clubsApi',
  'usersApi', 'sportsApi', 'stadiumsApi', 'tournamentsApi',
  'matchesApi', 'ticketsApi', 'bookingApi', 'countriesApi',
]

export const baseQueryWithAuth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions)

  if (result.error) {
    const err = result.error as FetchBaseQueryError
    const httpStatus = err.status
    const body = err.data as unknown
    const message = extractErrorMessage(body)

    if (httpStatus === 403) {
      localStorage.removeItem('token')
      AUTH_RESET_PATHS.forEach((path) => {
        try { api.dispatch({ type: `${path}/resetApiState` }) } catch {
          /* ignore */
        }
      })
      toast.error('Session expired. Please sign in again.')
      window.location.href = '/signin'
    } else {
      toast.error(message ?? 'Something went wrong. Please try again.')
    }
  }

  return result
}
