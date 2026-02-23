import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithAuth } from './baseQuery'

// ── Types ─────────────────────────────────────────────────────────────────────

export interface User {
  id: number
  full_name: string
  phone: string
  email: string
  gender: string
  dob: string
  nationality_id: number
  country_id: number
  city_id: number
  passport_number: string
  passport_expiration_date: string
  has_valid_visa: number
  visa_type?: string
  visa_expiration_date?: string
  status: string | number
  created_at: string
  nationality?: { id: number; name_en: string; name_ar: string }
  country?: { id: number; name_en: string; name_ar: string }
  city?: { id: number; name_en: string; name_ar: string }
}

interface UserListResponse {
  status: number
  message: string
  data: {
    current_page: number
    data: User[]
    last_page: number
    per_page: number
    total: number
    from: number
    to: number
  }
}

interface UserSingleResponse {
  status: number
  message: string
  data: User
}

interface UserDeleteResponse {
  status: number
  message: string
}

export interface CreateUserPayload {
  full_name: string
  phone: string
  email: string
  password: string
  gender: string
  dob: string
  nationality_id: number
  country_id: number
  city_id: number
  passport_number: string
  passport_expiration_date: string
  has_valid_visa: number
  visa_type?: string
  visa_expiration_date?: string
}

export interface UpdateUserPayload extends Omit<CreateUserPayload, 'password'> {
  id: number
}

// ── API slice ─────────────────────────────────────────────────────────────────

export const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['User'],
  endpoints: (builder) => ({
    getUsers: builder.query<UserListResponse, { page?: number; per_page?: number; search?: string }>({
      query: ({ page = 1, per_page = 10, search = '' }) => ({
        url: '/admin/users',
        params: { page, per_page, ...(search ? { search } : {}) },
      }),
      providesTags: (result) =>
        result
          ? [...result.data.data.map(({ id }) => ({ type: 'User' as const, id })), { type: 'User', id: 'LIST' }]
          : [{ type: 'User', id: 'LIST' }],
    }),

    createUser: builder.mutation<UserSingleResponse, CreateUserPayload>({
      query: (data) => {
        const fd = new FormData()
        Object.entries(data).forEach(([k, v]) => {
          if (v !== undefined && v !== null && v !== '') fd.append(k, String(v))
        })
        return { url: '/admin/users', method: 'POST', body: fd }
      },
      invalidatesTags: [{ type: 'User', id: 'LIST' }],
    }),

    updateUser: builder.mutation<UserSingleResponse, UpdateUserPayload>({
      query: ({ id, ...data }) => {
        const fd = new FormData()
        Object.entries(data).forEach(([k, v]) => {
          if (v !== undefined && v !== null && v !== '') fd.append(k, String(v))
        })
        return { url: `/admin/users/update/${id}`, method: 'POST', body: fd }
      },
      invalidatesTags: (_r, _e, arg) => [{ type: 'User', id: arg.id }, { type: 'User', id: 'LIST' }],
    }),

    deleteUser: builder.mutation<UserDeleteResponse, number>({
      query: (id) => ({ url: `/admin/users/${id}`, method: 'DELETE' }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }],
    }),

    bulkDestroyUsers: builder.mutation<UserDeleteResponse, number[]>({
      query: (ids) => {
        const fd = new FormData()
        ids.forEach((id) => fd.append('ids[]', String(id)))
        return { url: '/admin/users/bulk-destroy/', method: 'POST', body: fd }
      },
      invalidatesTags: [{ type: 'User', id: 'LIST' }],
    }),
  }),
})

export const {
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useBulkDestroyUsersMutation,
} = usersApi
