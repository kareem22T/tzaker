import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithAuth } from './baseQuery'

// ── Supplier types ────────────────────────────────────────────────────────────

export interface Supplier {
  id: number
  name: string
  name_en?: string
  name_ar?: string
  email: string
  phone: string
  username: string
  image?: string
  desc_en?: string
  desc_ar?: string
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
  // multilingual support
  name_en?: string
  name_ar?: string
  desc_en?: string
  desc_ar?: string
  // allow uploading an image file (backend should accept FormData)
  image?: File
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
      query: ({ name, email, phone, username, password, name_en, name_ar, desc_en, desc_ar, image }) => {
        const fd = new FormData()
        fd.append('name', name)
        fd.append('email', email)
        fd.append('phone', phone)
        fd.append('username', username)
        fd.append('password', password)
        if (name_en) fd.append('name_en', name_en)
        if (name_ar) fd.append('name_ar', name_ar)
        if (desc_en) fd.append('desc_en', desc_en)
        if (desc_ar) fd.append('desc_ar', desc_ar)
        if (image) fd.append('image', image)
        return { url: '/admin/suppliers', method: 'POST', body: fd }
      },
      invalidatesTags: [{ type: 'Supplier', id: 'LIST' }],
    }),

    updateSupplier: builder.mutation<SupplierSingleResponse, UpdateSupplierPayload>({
      query: ({ id, name, email, phone, username, password, name_en, name_ar, desc_en, desc_ar, image }) => {
        const fd = new FormData()
        if (name) fd.append('name', name)
        if (email) fd.append('email', email)
        if (phone) fd.append('phone', phone)
        if (username) fd.append('username', username)
        if (password) fd.append('password', password)
        if (name_en) fd.append('name_en', name_en)
        if (name_ar) fd.append('name_ar', name_ar)
        if (desc_en) fd.append('desc_en', desc_en)
        if (desc_ar) fd.append('desc_ar', desc_ar)
        if (image) fd.append('image', image)
        return { url: `/admin/suppliers/${id}`, method: 'POST', body: fd }
      },
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
