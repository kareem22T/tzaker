import { fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { BASE_URL } from '../config'

export const rawBaseQuery = fetchBaseQuery({

  baseUrl: BASE_URL,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('token')
    if (token) {
      headers.set('authorization', `Bearer ${token}`)
    }
    headers.set('Accept', 'application/json')
    return headers
  },
})

import type { BaseQueryFn } from '@reduxjs/toolkit/query'
import type { FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query'

export const baseQueryWithAuth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions)

  // if (result.error && result.error.status === 401) {
  //   // 🔴 Unauthorized → clear auth data
  //   localStorage.clear()

  //   // Optional: reset RTK Query cache
  //   api.dispatch({ type: 'auth/logout' }) // if you have auth slice
  //   api.dispatch({ type: 'applicationsApi/resetApiState' })

  //   // 🔁 Redirect to login
  //   window.location.href = '/signin'
  // }

  return result
}
