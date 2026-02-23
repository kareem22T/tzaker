import { createApi } from '@reduxjs/toolkit/query/react'
import type { FaqCategory, Faq } from '../faqsSlice'
import { baseQueryWithAuth } from './baseQuery'

// ── Raw API types ─────────────────────────────────────────────────────────────

interface PaginatedResponse<T> {
  status: number
  message: string
  data: {
    current_page: number
    data: T[]
    last_page: number
    per_page: number
    total: number
    from: number
    to: number
  }
}

interface BackendFaqCategory {
  id: number
  name_en: string
  name_ar?: string
  desc_en?: string
  desc_ar?: string
  icon?: string
  sort_order: number
  status: number | string
  created_at: string
  updated_at?: string
}

interface BackendFaq {
  id: number
  faq_category_id: number
  question_en: string
  question_ar?: string
  answer_en: string
  answer_ar?: string
  sort_order: number
  status: number | string
  created_at: string
  updated_at?: string
  category?: { id: number; name_en: string; name_ar?: string }
}

// ── Transform helpers ─────────────────────────────────────────────────────────

const transformCategoryFromBackend = (c: BackendFaqCategory): FaqCategory => ({
  id: String(c.id),
  title: c.name_en,
  title_ar: c.name_ar,
  description: c.desc_en || '',
  description_ar: c.desc_ar,
  icon_url: c.icon || '',
  order: c.sort_order ?? 0,
  createdAt: c.created_at,
  updatedAt: c.updated_at || c.created_at,
})

const transformFaqFromBackend = (q: BackendFaq): Faq => ({
  id: String(q.id),
  categoryId: String(q.faq_category_id),
  question: q.question_en,
  question_ar: q.question_ar,
  answer: q.answer_en,
  answer_ar: q.answer_ar,
  order: q.sort_order ?? 0,
  is_published: Number(q.status) === 1,
  createdAt: q.created_at,
  updatedAt: q.updated_at || q.created_at,
})

export const faqsApi = createApi({
  reducerPath: 'faqsApi',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['FaqCategory', 'Faq'],
  endpoints: (builder) => ({
    // ── FAQ Categories ────────────────────────────────────────────────────────

    getFaqCategories: builder.query<FaqCategory[], void>({
      query: () => ({ url: '/admin/faq-categories', params: { per_page: 100 } }),
      transformResponse: (res: PaginatedResponse<BackendFaqCategory>) =>
        res.data.data.map(transformCategoryFromBackend),
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'FaqCategory' as const, id })), { type: 'FaqCategory', id: 'LIST' }]
          : [{ type: 'FaqCategory', id: 'LIST' }],
    }),

    createFaqCategory: builder.mutation<FaqCategory, {
      name: string; name_ar?: string; description?: string; description_ar?: string; icon?: File; display_order?: number
    }>({
      query: ({ name, name_ar, description, description_ar, icon, display_order }) => {
        const fd = new FormData()
        fd.append('name_en', name)
        if (name_ar) fd.append('name_ar', name_ar)
        if (description) fd.append('desc_en', description)
        if (description_ar) fd.append('desc_ar', description_ar)
        if (icon) fd.append('icon', icon)
        fd.append('sort_order', String(display_order ?? 1))
        fd.append('status', '1')
        return { url: '/admin/faq-categories', method: 'POST', body: fd }
      },
      transformResponse: (res: { status: number; message: string; data: BackendFaqCategory }) =>
        transformCategoryFromBackend(res.data),
      invalidatesTags: [{ type: 'FaqCategory', id: 'LIST' }],
    }),

    updateFaqCategory: builder.mutation<FaqCategory, {
      id: string | number; name: string; name_ar?: string; description?: string; description_ar?: string; icon?: File; display_order?: number
    }>({
      query: ({ id, name, name_ar, description, description_ar, display_order }) => ({
        url: `/admin/faq-categories/${id}`,
        method: 'PUT',
        body: { name_en: name, name_ar, desc_en: description, desc_ar: description_ar, sort_order: display_order ?? 1 },
      }),
      transformResponse: (res: { status: number; message: string; data: BackendFaqCategory }) =>
        transformCategoryFromBackend(res.data),
      invalidatesTags: (_r, _e, arg) => [
        { type: 'FaqCategory', id: String(arg.id) },
        { type: 'FaqCategory', id: 'LIST' },
      ],
    }),

    deleteFaqCategory: builder.mutation<{ status: number; message: string }, string | number>({
      query: (id) => ({ url: `/admin/faq-categories/${id}`, method: 'DELETE' }),
      invalidatesTags: [{ type: 'FaqCategory', id: 'LIST' }],
    }),

    // ── FAQ Questions ─────────────────────────────────────────────────────────

    getFaq: builder.query<Faq, string | number>({
      query: (id) => ({ url: `/admin/questions/${id}` }),
      transformResponse: (res: { status: number; message: string; data: BackendFaq }) =>
        transformFaqFromBackend(res.data),
      providesTags: (_r, _e, id) => [{ type: 'Faq' as const, id: String(id) }],
    }),

    getFaqs: builder.query<Faq[], void>({
      query: () => ({ url: '/admin/questions', params: { per_page: 200 } }),
      transformResponse: (res: PaginatedResponse<BackendFaq>) =>
        res.data.data.map(transformFaqFromBackend),
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'Faq' as const, id })), { type: 'Faq', id: 'LIST' }]
          : [{ type: 'Faq', id: 'LIST' }],
    }),

    createFaq: builder.mutation<Faq, {
      categoryId: string; question: string; question_ar?: string; answer: string; answer_ar?: string; display_order?: number; is_published?: boolean
    }>({
      query: ({ categoryId, question, question_ar, answer, answer_ar, display_order, is_published }) => {
        const fd = new FormData()
        fd.append('faq_category_id', categoryId)
        fd.append('question_en', question)
        if (question_ar) fd.append('question_ar', question_ar)
        fd.append('answer_en', answer)
        if (answer_ar) fd.append('answer_ar', answer_ar)
        fd.append('sort_order', String(display_order ?? 1))
        fd.append('status', (is_published ?? true) ? '1' : '0')
        return { url: '/admin/questions', method: 'POST', body: fd }
      },
      transformResponse: (res: { status: number; message: string; data: BackendFaq }) =>
        transformFaqFromBackend(res.data),
      invalidatesTags: [{ type: 'Faq', id: 'LIST' }],
    }),

    updateFaq: builder.mutation<Faq, {
      id: string | number; categoryId: string; question: string; question_ar?: string; answer: string; answer_ar?: string; display_order?: number; is_published?: boolean
    }>({
      query: ({ id, categoryId, question, question_ar, answer, answer_ar, display_order, is_published }) => ({
        url: `/admin/questions/${id}`,
        method: 'PUT',
        body: {
          faq_category_id: categoryId,
          question_en: question,
          question_ar,
          answer_en: answer,
          answer_ar,
          sort_order: display_order ?? 1,
          status: (is_published ?? true) ? 1 : 0,
        },
      }),
      transformResponse: (res: { status: number; message: string; data: BackendFaq }) =>
        transformFaqFromBackend(res.data),
      invalidatesTags: (_r, _e, arg) => [{ type: 'Faq', id: String(arg.id) }, { type: 'Faq', id: 'LIST' }],
    }),

    deleteFaq: builder.mutation<{ status: number; message: string }, string | number>({
      query: (id) => ({ url: `/admin/questions/${id}`, method: 'DELETE' }),
      invalidatesTags: [{ type: 'Faq', id: 'LIST' }],
    }),

    updateFaqOrder: builder.mutation<void, { id: string; order: number }>({
      query: ({ id, order }) => ({ url: `/admin/questions/${id}`, method: 'PUT', body: { sort_order: order } }),
      invalidatesTags: [{ type: 'Faq', id: 'LIST' }],
    }),
  }),
})

export const {
  useGetFaqCategoriesQuery,
  useCreateFaqCategoryMutation,
  useUpdateFaqCategoryMutation,
  useDeleteFaqCategoryMutation,
  useGetFaqQuery,
  useGetFaqsQuery,
  useCreateFaqMutation,
  useUpdateFaqMutation,
  useDeleteFaqMutation,
  useUpdateFaqOrderMutation,
} = faqsApi