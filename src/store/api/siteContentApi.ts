import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithAuth } from './baseQuery'

// ── Types ─────────────────────────────────────────────────────────────────────

export interface ContentPage {
  id: number
  type: string
  content_en: string
  content_ar: string
}

export interface ContactInfo {
  id: number
  email: string
  phone: string
  address_en: string
  address_ar: string
  country_id: number
  working_hours_en: string
  working_hours_ar: string
  response_time_en: string
  response_time_ar: string
  status?: string | number
  country?: { id: number; name_en: string; name_ar: string }
}

export interface HeroSection {
  id: number
  title_en: string
  title_ar: string
  description_en: string
  description_ar: string
  button_text_en: string
  button_text_ar: string
  button_url: string
  image?: string
  is_active: boolean
  cookie_policy?: ContentPage
  terms?: ContentPage
  privacy_policy?: ContentPage
  contact?: ContactInfo
}

interface HeroSectionResponse {
  status: number
  message: string
  data: HeroSection
}

interface GenericResponse {
  status: number
  message: string
  data?: unknown
}

export interface UpdateHeroPayload {
  title_en: string
  title_ar: string
  description_en: string
  description_ar: string
  button_text_en: string
  button_text_ar: string
  button_url: string
}

export interface UpdateSettingPayload {
  id: number
  content_en: string
  content_ar: string
}

export interface UpdateContactPayload {
  email: string
  phone: string
  address_en: string
  address_ar: string
  country_id: number
  working_hours_en: string
  working_hours_ar: string
  response_time_en: string
  response_time_ar: string
}

// ── API slice ─────────────────────────────────────────────────────────────────

export const siteContentApi = createApi({
  reducerPath: 'siteContentApi',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['SiteContent'],
  endpoints: (builder) => ({
    getHeroSection: builder.query<HeroSectionResponse, void>({
      query: () => '/admin/hero-sections',
      providesTags: [{ type: 'SiteContent', id: 'HERO' }],
    }),

    updateHeroSection: builder.mutation<GenericResponse, UpdateHeroPayload>({
      query: (body) => {
        const fd = new FormData()
        Object.entries(body).forEach(([k, v]) => fd.append(k, String(v)))
        return { url: '/admin/hero-sections/update/1', method: 'POST', body: fd }
      },
      invalidatesTags: [{ type: 'SiteContent', id: 'HERO' }],
    }),

    updateSetting: builder.mutation<GenericResponse, UpdateSettingPayload>({
      query: ({ id, content_en, content_ar }) => {
        const fd = new FormData()
        fd.append('content_en', content_en)
        fd.append('content_ar', content_ar)
        return { url: `/admin/setting/update/${id}`, method: 'POST', body: fd }
      },
      invalidatesTags: [{ type: 'SiteContent', id: 'HERO' }],
    }),

    updateContact: builder.mutation<GenericResponse, UpdateContactPayload>({
      query: (body) => {
        const fd = new FormData()
        Object.entries(body).forEach(([k, v]) => fd.append(k, String(v)))
        return { url: '/admin/contact/update/1', method: 'POST', body: fd }
      },
      invalidatesTags: [{ type: 'SiteContent', id: 'HERO' }],
    }),
  }),
})

export const {
  useGetHeroSectionQuery,
  useUpdateHeroSectionMutation,
  useUpdateSettingMutation,
  useUpdateContactMutation,
} = siteContentApi