import { createApi } from '@reduxjs/toolkit/query/react'
import type { FaqCategory, Faq } from '../faqsSlice'
import { baseQueryWithAuth } from './baseQuery'

// API Response types
interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

interface ListResponse<T> {
  success: boolean
  data: T[]
}

// Backend structures
interface BackendFaqCategory {
  id: number
  name: string
  name_ar?: string
  description?: string
  description_ar?: string
  icon?: string
  icon_url?: string
  display_order: number
  created_at: string
  updated_at: string
}

interface BackendFaq {
  id: number
  category_id: number
  question: string
  question_ar?: string
  answer: string
  answer_ar?: string
  display_order: number
  is_published: boolean
  created_at: string
  updated_at: string
}

// Transform functions
const transformCategoryFromBackend = (backend: BackendFaqCategory): FaqCategory => ({
  id: backend.id?.toString(),
  title: backend.name,
  title_ar: backend.name_ar,
  description: backend.description || '',
  description_ar: backend.description_ar,
  icon_url: backend.icon_url || '',
  order: backend.display_order,
  createdAt: backend.created_at,
  updatedAt: backend.updated_at,
})

const transformFaqFromBackend = (backend: BackendFaq): Faq => ({
  id: backend.id?.toString(),
  categoryId: backend.category_id?.toString(),
  question: backend.question,
  question_ar: backend.question_ar,
  answer: backend.answer,
  answer_ar: backend.answer_ar,
  order: backend.display_order,
  createdAt: backend.created_at,
  updatedAt: backend.updated_at,
})

export const faqsApi = createApi({
  reducerPath: 'faqsApi',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['FaqCategory', 'Faq'],
  endpoints: (builder) => ({
    // ==================== FAQ CATEGORIES ====================
    
    // Get all categories
    getFaqCategories: builder.query<FaqCategory[], void>({
      query: () => '/dashboard/faqs/categories',
      transformResponse: (response: ListResponse<BackendFaqCategory>) =>
        response.data.map(transformCategoryFromBackend),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'FaqCategory' as const, id })),
              { type: 'FaqCategory', id: 'LIST' },
            ]
          : [{ type: 'FaqCategory', id: 'LIST' }],
    }),

    // Create category (with file upload)
    createFaqCategory: builder.mutation<FaqCategory, {
      name: string
      name_ar?: string
      description?: string
      description_ar?: string
      icon?: File
      display_order?: number
    }>({
      query: (data) => {
        const formData = new FormData()
        formData.append('name', data.name)
        if (data.name_ar) formData.append('name_ar', data.name_ar)
        if (data.description) formData.append('description', data.description)
        if (data.description_ar) formData.append('description_ar', data.description_ar)
        if (data.icon) formData.append('icon', data.icon)
        if (data.display_order) formData.append('display_order', data.display_order?.toString())

        return {
          url: '/dashboard/faqs/categories',
          method: 'POST',
          body: formData,
          prepareHeaders: (headers: Headers) => {
            headers.delete('Content-Type')
            return headers
          },
        }
      },
      transformResponse: (response: ApiResponse<BackendFaqCategory>) =>
        transformCategoryFromBackend(response.data),
      invalidatesTags: [{ type: 'FaqCategory', id: 'LIST' }],
    }),

    // Update category (with file upload)
    updateFaqCategory: builder.mutation<FaqCategory, {
      id: string | number
      name?: string
      name_ar?: string
      description?: string
      description_ar?: string
      icon?: File
      display_order?: number
    }>({
      query: ({ id, ...data }) => {
        const formData = new FormData()
        formData.append('_method', 'PUT')
        if (data.name) formData.append('name', data.name)
        if (data.name_ar !== undefined) formData.append('name_ar', data.name_ar)
        if (data.description !== undefined) formData.append('description', data.description)
        if (data.description_ar !== undefined) formData.append('description_ar', data.description_ar)
        if (data.icon) formData.append('icon', data.icon)
        if (data.display_order) formData.append('display_order', data.display_order?.toString())

        return {
          url: `/dashboard/faqs/categories/${id}`,
          method: 'POST',
          body: formData,
          prepareHeaders: (headers: Headers) => {
            headers.delete('Content-Type')
            return headers
          },
        }
      },
      transformResponse: (response: ApiResponse<BackendFaqCategory>) =>
        transformCategoryFromBackend(response.data),
      invalidatesTags: (result, error, { id }) => [
        { type: 'FaqCategory', id },
        { type: 'FaqCategory', id: 'LIST' },
      ],
    }),

    // Delete category
    deleteFaqCategory: builder.mutation<{ success: boolean; message: string }, string | number>({
      query: (id) => ({
        url: `/dashboard/faqs/categories/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'FaqCategory', id: 'LIST' }, { type: 'Faq', id: 'LIST' }],
    }),

    // ==================== FAQs ====================
    
    // Get all FAQs
    getFaqs: builder.query<Faq[], {
      category_id?: string | number
      search?: string
      is_published?: boolean
    }>({
      query: ({ category_id = '', search = '', is_published }) => ({
        url: '/dashboard/faqs',
        params: {
          ...(category_id ? { category_id } : {}),
          search,
          ...(is_published !== undefined && { is_published: is_published ? 1 : 0 }),
        },
      }),
      transformResponse: (response: ListResponse<BackendFaq>) =>
        response.data.map(transformFaqFromBackend),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Faq' as const, id })),
              { type: 'Faq', id: 'LIST' },
            ]
          : [{ type: 'Faq', id: 'LIST' }],
    }),

    // Get single FAQ
    getFaq: builder.query<Faq, string | number>({
      query: (id) => `/dashboard/faqs/${id}`,
      transformResponse: (response: ApiResponse<BackendFaq>) =>
        transformFaqFromBackend(response.data),
      providesTags: (result, error, id) => [{ type: 'Faq', id }],
    }),

    // Create FAQ
    createFaq: builder.mutation<Faq, {
      category_id: number
      question: string
      question_ar?: string
      answer: string
      answer_ar?: string
      display_order?: number
      is_published?: boolean
    }>({
      query: (data) => ({
        url: '/dashboard/faqs',
        method: 'POST',
        body: {
          faq_category_id: data.category_id,
          question: data.question,
          question_ar: data.question_ar,
          answer: data.answer,
          answer_ar: data.answer_ar,
          display_order: data.display_order || 1,
          is_published: data.is_published !== false,
        },
      }),
      transformResponse: (response: ApiResponse<BackendFaq>) =>
        transformFaqFromBackend(response.data),
      invalidatesTags: [{ type: 'Faq', id: 'LIST' }],
    }),

    // Update FAQ
    updateFaq: builder.mutation<Faq, {
      id: string | number
      faq_category_id?: number
      question?: string
      question_ar?: string
      answer?: string
      answer_ar?: string
      display_order?: number
      is_published?: boolean
    }>({
      query: ({ id, ...data }) => ({
        url: `/dashboard/faqs/${id}`,
        method: 'PUT',
        body: data,
      }),
      transformResponse: (response: ApiResponse<BackendFaq>) =>
        transformFaqFromBackend(response.data),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Faq', id },
        { type: 'Faq', id: 'LIST' },
      ],
    }),

    // Delete FAQ
    deleteFaq: builder.mutation<{ success: boolean; message: string }, string | number>({
      query: (id) => ({
        url: `/dashboard/faqs/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Faq', id: 'LIST' }],
    }),

    // Update FAQ order (for drag and drop)
    updateFaqOrder: builder.mutation<void, Array<{
      id: string | number
      faq_category_id: number
      question: string
      question_ar?: string
      answer: string
      answer_ar?: string
      display_order: number
      is_published: boolean
    }>>({
      async queryFn(faqs, _api, _extraOptions, baseQuery) {
        try {
          for (const faq of faqs) {
            const { id, ...data } = faq
            await baseQuery({
              url: `/dashboard/faqs/${id}`,
              method: 'PUT',
              body: data,
            })
          }
          return { data: undefined }
        } catch (error) {
          return { error: { status: 'CUSTOM_ERROR', error: String(error) } }
        }
      },
      invalidatesTags: [{ type: 'Faq', id: 'LIST' }],
    }),
  }),
})

export const {
  useGetFaqCategoriesQuery,
  useCreateFaqCategoryMutation,
  useUpdateFaqCategoryMutation,
  useDeleteFaqCategoryMutation,
  useGetFaqsQuery,
  useGetFaqQuery,
  useCreateFaqMutation,
  useUpdateFaqMutation,
  useDeleteFaqMutation,
  useUpdateFaqOrderMutation,
} = faqsApi