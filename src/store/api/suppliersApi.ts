import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithAuth } from './baseQuery'

// ── Supplier types ────────────────────────────────────────────────────────────

export interface Supplier {
  id: number
  name: string
  email: string
  phone: string
  username: string
  image?: string
  status: number
  type: string
  created_at: string
}

interface SupplierListResponse {
  status: number
  message: string
  data: {
    current_page: number
    data: Supplier[]
    last_page: number
    next_page_url: string | null
    prev_page_url: string | null
    per_page: number
    total: number
    from: number
    to: number
  }
}

interface SupplierSingleResponse {
  status: number
  message: string
  data: Supplier
}

interface SupplierDeleteResponse {
  status: number
  message: string
}

export interface CreateSupplierPayload {
  name: string
  email: string
  phone: string
  username: string
  password: string
}

export interface UpdateSupplierPayload extends Partial<CreateSupplierPayload> {
  id: number
}

// ── API slice ─────────────────────────────────────────────────────────────────

export const suppliersApi = createApi({
  reducerPath: 'suppliersApi',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Supplier'],
  endpoints: (builder) => ({
    getSuppliers: builder.query<SupplierListResponse, { page?: number; per_page?: number; search?: string }>({
      query: ({ page = 1, per_page = 10, search = '' }) => ({
        url: '/admin/suppliers',
        params: { page, per_page, ...(search ? { search } : {}) },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.data.map(({ id }) => ({ type: 'Supplier' as const, id })),
              { type: 'Supplier', id: 'LIST' },
            ]
          : [{ type: 'Supplier', id: 'LIST' }],
    }),

    createSupplier: builder.mutation<SupplierSingleResponse, CreateSupplierPayload>({
      query: (body) => ({ url: '/admin/suppliers', method: 'POST', body }),
      invalidatesTags: [{ type: 'Supplier', id: 'LIST' }],
    }),

    updateSupplier: builder.mutation<SupplierSingleResponse, UpdateSupplierPayload>({
      query: ({ id, ...body }) => ({ url: `/admin/suppliers/${id}`, method: 'PUT', body }),
      invalidatesTags: (_result, _err, arg) => [
        { type: 'Supplier', id: arg.id },
        { type: 'Supplier', id: 'LIST' },
      ],
    }),

    deleteSupplier: builder.mutation<SupplierDeleteResponse, number>({
      query: (id) => ({ url: `/admin/suppliers/${id}`, method: 'DELETE' }),
      invalidatesTags: [{ type: 'Supplier', id: 'LIST' }],
    }),
  }),
})

export const {
  useGetSuppliersQuery,
  useCreateSupplierMutation,
  useUpdateSupplierMutation,
  useDeleteSupplierMutation,
} = suppliersApi
