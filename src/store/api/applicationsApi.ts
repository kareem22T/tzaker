import { createApi } from '@reduxjs/toolkit/query/react'
import type { Application } from './../applicationsSlice'
import { baseQueryWithAuth } from './baseQuery'

// API Response types
interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  pagination: {
    current_page: number
    total_pages: number
    total: number
    per_page: number
  }
}

interface SingleResponse<T> {
  success: boolean
  data: T
  message?: string
}

interface DeleteResponse {
  success: boolean
  message: string
}

interface UpdateStatusResponse {
  success: boolean
  message: string
  data?: BackendApplication
}

interface UpdateRatingResponse {
  success: boolean
  message: string
  data?: BackendApplication
}

// Backend Application structure
interface BackendApplicationUser {
  id: number
  name: string
  email: string
  phone?: string
  city?: string
  user_type: 'individual' | 'company'
  portfolio_url?: string
}

interface BackendApplicationDepartment {
  id: number
  name: string
}

interface BackendApplicationStep {
  step_id: number
  step_title: string
  data: Record<string, unknown>
  is_completed: boolean
  completed_at: string | null
}

interface BackendApplication {
  id: number
  user: BackendApplicationUser
  department: BackendApplicationDepartment | string // Can be string in list view, object in detail view
  status: 'draft' | 'pending' | 'approved' | 'rejected'
  completion: number // Used in list view
  completion_percentage?: number // Used in detail view
  rating: number | null
  rating_comment?: string | null
  form_data?: BackendApplicationStep[] // Only in detail view
  submitted_at: string | null
  approved_at?: string | null
  rejected_at?: string | null
  created_at: string
}

// Transform functions
const transformBackendToApplication = (backend: BackendApplication): Application => {
  const departmentName = typeof backend.department === 'string' 
    ? backend.department 
    : backend.department.name
  
  const departmentId = typeof backend.department === 'string'
    ? '' // We don't have department ID in list view, you may need to fetch it separately
    : backend.department.id.toString()

  return {
    id: backend.id.toString(),
    userId: backend.user.id.toString(),
    userName: backend.user.name,
    departmentId: departmentId,
    departmentName: departmentName,
    status: backend.status === 'draft' ? 'pending' : backend.status,
    rating: backend.rating ?? undefined,
    ratingComment: backend.rating_comment ?? undefined,
    steps: backend.form_data?.map(step => ({
      stepId: step.step_id.toString(),
      stepTitle: step.step_title,
      formData: step.data,
      completed: step.is_completed,
    })) || [],
    completionPercentage: backend.completion_percentage ?? backend.completion,
    createdAt: backend.created_at,
    updatedAt: backend.submitted_at || backend.created_at,
  }
}

export const applicationsApi = createApi({
  reducerPath: 'applicationsApi',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Application'],
  endpoints: (builder) => ({
    // Get all applications with filters
    getApplications: builder.query<{
      applications: Application[]
      pagination: PaginatedResponse<BackendApplication>['pagination']
    }, {
      status?: '' | 'pending' | 'approved' | 'rejected'
      department_id?: string
      search?: string
      page?: number
    }>({
      query: ({ status = '', department_id = '', search = '', page = 1 }) => ({
        url: '/dashboard/applications',
        params: { ...(status && {status}), ...(department_id && {department_id}), search, page }
      }),
      transformResponse: (response: PaginatedResponse<BackendApplication>) => {
        const applications = response.data.map(transformBackendToApplication)
        return {
          applications,
          pagination: response.pagination
        }
      },
      providesTags: (result) =>
        result
          ? [
              ...result.applications.map(({ id }) => ({ type: 'Application' as const, id })),
              { type: 'Application', id: 'LIST' },
            ]
          : [{ type: 'Application', id: 'LIST' }],
    }),

    // Get single application details
    getApplication: builder.query<Application, string | number>({
      query: (id) => `/dashboard/applications/${id}`,
      transformResponse: (response: SingleResponse<BackendApplication>) => {
        return transformBackendToApplication(response.data)
      },
      providesTags: (result, error, id) => [{ type: 'Application', id }],
    }),

    // Update application status
    updateApplicationStatus: builder.mutation<UpdateStatusResponse, { 
      id: string | number
      status: 'pending' | 'approved' | 'rejected'
    }>({
      query: ({ id, status }) => ({
        url: `/dashboard/applications/${id}/status`,
        method: 'PUT',
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Application', id },
        { type: 'Application', id: 'LIST' },
      ],
    }),

    // Update application rating
    updateApplicationRating: builder.mutation<UpdateRatingResponse, {
      id: string | number
      rating: number
      rating_comment?: string
    }>({
      query: ({ id, rating, rating_comment }) => ({
        url: `/dashboard/applications/${id}/rating`,
        method: 'PUT',
        body: { rating, rating_comment },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Application', id },
        { type: 'Application', id: 'LIST' },
      ],
    }),

    // Delete application
    deleteApplication: builder.mutation<DeleteResponse, string | number>({
      query: (id) => ({
        url: `/dashboard/applications/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Application', id: 'LIST' }],
    }),

    // Bulk delete applications (if backend supports it in the future)
    // deleteMultipleApplications: builder.mutation<DeleteResponse, string[]>({
    //   query: (ids) => ({
    //     url: '/dashboard/applications/bulk-delete',
    //     method: 'POST',
    //     body: { ids },
    //   }),
    //   invalidatesTags: [{ type: 'Application', id: 'LIST' }],
    // }),
  }),
})

export const {
  useGetApplicationsQuery,
  useGetApplicationQuery,
  useUpdateApplicationStatusMutation,
  useUpdateApplicationRatingMutation,
  useDeleteApplicationMutation,
  // useDeleteMultipleApplicationsMutation, // Uncomment when backend endpoint is ready
} = applicationsApi