import { createApi } from '@reduxjs/toolkit/query/react'
import type { ContactMessage } from '../contactMessagesSlice'
import { baseQueryWithAuth } from './baseQuery'

// API Response types
interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  meta?: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}

interface UnreadCountResponse {
  success: boolean
  data: {
    unread_count: number
  }
}

// Backend structure
interface BackendContactMessage {
  id: number
  name: string
  first_name: string
  last_name: string
  email: string
  subject: string
  message: string
  is_read: boolean
  created_at: string
  updated_at: string
}

// Transform functions
const transformMessageFromBackend = (backend: BackendContactMessage): ContactMessage => ({
  id: backend.id?.toString(),
  name: backend.name,
  firstName: backend.first_name,
  lastName: backend.last_name,
  email: backend.email,
  subject: backend.subject,
  message: backend.message,
  isRead: backend.is_read,
  createdAt: backend.created_at,
})

export const contactMessagesApi = createApi({
  reducerPath: 'contactMessagesApi',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['ContactMessage', 'UnreadCount'],
  endpoints: (builder) => ({
    // Get all messages with filters
    getContactMessages: builder.query<{
      messages: ContactMessage[]
      meta?: {
        currentPage: number
        lastPage: number
        perPage: number
        total: number
      }
    }, {
      is_read?: boolean
      search?: string
      page?: number
    }>({
      query: ({ is_read, search = '', page = 1 }) => ({
        url: '/dashboard/messages',
        params: {
          ...(is_read !== undefined && { is_read: is_read ? 1 : 0 }),
          search,
          page,
        },
      }),
      transformResponse: (response: PaginatedResponse<BackendContactMessage>) => ({
        messages: response.data.map(transformMessageFromBackend),
        meta: response.meta ? {
          currentPage: response.meta.current_page,
          lastPage: response.meta.last_page,
          perPage: response.meta.per_page,
          total: response.meta.total,
        } : undefined,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.messages.map(({ id }) => ({ type: 'ContactMessage' as const, id })),
              { type: 'ContactMessage', id: 'LIST' },
            ]
          : [{ type: 'ContactMessage', id: 'LIST' }],
    }),

    // Get unread count
    getUnreadCount: builder.query<number, void>({
      query: () => '/dashboard/messages/unread-count',
      transformResponse: (response: UnreadCountResponse) => response.data.unread_count,
      providesTags: [{ type: 'UnreadCount', id: 'COUNT' }],
    }),

    // Get single message details
    getContactMessage: builder.query<ContactMessage, string | number>({
      query: (id) => `/dashboard/messages/${id}`,
      transformResponse: (response: ApiResponse<BackendContactMessage>) =>
        transformMessageFromBackend(response.data),
      providesTags: (result, error, id) => [{ type: 'ContactMessage', id }],
    }),

    // Mark message as read
    markMessageAsRead: builder.mutation<ContactMessage, string | number>({
      query: (id) => ({
        url: `/dashboard/messages/${id}/read`,
        method: 'PUT',
      }),
      transformResponse: (response: ApiResponse<BackendContactMessage>) =>
        transformMessageFromBackend(response.data),
      invalidatesTags: (result, error, id) => [
        { type: 'ContactMessage', id },
        { type: 'ContactMessage', id: 'LIST' },
        { type: 'UnreadCount', id: 'COUNT' },
      ],
    }),

    // Delete single message
    deleteContactMessage: builder.mutation<{ success: boolean; message: string }, string | number>({
      query: (id) => ({
        url: `/dashboard/messages/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [
        { type: 'ContactMessage', id: 'LIST' },
        { type: 'UnreadCount', id: 'COUNT' },
      ],
    }),

    // Bulk delete messages (if backend supports it)
    // If not supported, we'll handle it in the component by calling deleteContactMessage multiple times
    deleteMultipleContactMessages: builder.mutation<
      { success: boolean; message: string },
      (string | number)[]
    >({
      async queryFn(ids, _api, _extraOptions, baseQuery) {
        try {
          // Delete each message individually
          for (const id of ids) {
            const result = await baseQuery({
              url: `/dashboard/messages/${id}`,
              method: 'DELETE',
            })
            
            if (result.error) {
              return { error: result.error }
            }
          }
          return {
            data: {
              success: true,
              message: `Successfully deleted ${ids.length} message${ids.length > 1 ? 's' : ''}`,
            },
          }
        } catch (error) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: String(error),
            },
          }
        }
      },
      invalidatesTags: [
        { type: 'ContactMessage', id: 'LIST' },
        { type: 'UnreadCount', id: 'COUNT' },
      ],
    }),
  }),
})

export const {
  useGetContactMessagesQuery,
  useGetUnreadCountQuery,
  useGetContactMessageQuery,
  useMarkMessageAsReadMutation,
  useDeleteContactMessageMutation,
  useDeleteMultipleContactMessagesMutation,
} = contactMessagesApi