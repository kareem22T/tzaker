import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithAuth } from './baseQuery'

// ── Types ─────────────────────────────────────────────────────────────────────

export interface Country {
  id: number
  name_en: string
  name_ar: string
  code: string
}

export interface City {
  id: number
  name_en: string
  name_ar: string
  country_id: number
}

interface CountriesResponse {
  status: number
  message: string
  data: Country[]
}

interface CitiesResponse {
  status: number
  message: string
  data: City[]
}

// ── API slice ─────────────────────────────────────────────────────────────────

export const countriesApi = createApi({
  reducerPath: 'countriesApi',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Country', 'City'],
  endpoints: (builder) => ({
    getCountries: builder.query<CountriesResponse, void>({
      query: () => '/admin/countries',
      providesTags: [{ type: 'Country', id: 'LIST' }],
    }),
    getCities: builder.query<CitiesResponse, number>({
      query: (countryId) => `/admin/cities/${countryId}`,
      providesTags: (_r, _e, countryId) => [{ type: 'City', id: countryId }],
    }),
  }),
})

export const {
  useGetCountriesQuery,
  useGetCitiesQuery,
  useLazyGetCitiesQuery,
} = countriesApi
