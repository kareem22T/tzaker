import { createApi } from '@reduxjs/toolkit/query/react'
import type { Department, FormField } from '../departmentsSlice'
import { baseQueryWithAuth } from './baseQuery'

// API Response types
interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  links: {
    first: string | null
    last: string | null
    prev: string | null
    next: string | null
  }
  meta: {
    current_page: number
    from: number
    last_page: number
    per_page: number
    to: number
    total: number
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

// Backend Department structure
interface BackendDepartment {
  id: number
  name: string
  name_ar?: string
  description?: string
  description_ar?: string
  icon_url?: string
  steps_count: number
  workflow_steps?: BackendWorkflowStep[]
  created_at: string
  updated_at: string
}

interface BackendWorkflowStep {
  id: number
  title: string
  title_ar?: string
  description?: string
  description_ar?: string
  display_order: number
  form_fields: BackendFormField[]
  created_at?: string
}

interface BackendFormField {
  id: number
  field_type: string
  field_label: string
  field_label_ar?: string
  field_name: string
  placeholder?: string
  placeholder_ar?: string
  field_options?: string[]
  is_required: boolean
  display_order: number
  validation_rules?: string
}

// Transform functions
const transformBackendToFrontend = (backend: BackendDepartment): Department => ({
  id: backend.id.toString(),
  name: backend.name,
  name_ar: backend.name_ar,
  description: backend.description || '',
  description_ar: backend.description_ar,
  icon_url: backend.icon_url,
  steps_count: backend.steps_count,
  steps: backend.workflow_steps?.map(step => ({
    id: step.id.toString(),
    title: step.title,
    title_ar: step.title_ar,
    description: step.description || '',
    description_ar: step.description_ar,
    order: step.display_order,
    formFields: step.form_fields.map(field => ({
      id: field.id.toString(),
      type: field.field_type as FormField['type'],
      label: field.field_label,
      label_ar: field.field_label_ar,
      name: field.field_name,
      placeholder: field.placeholder,
      placeholder_ar: field.placeholder_ar,
      required: field.is_required,
      options: field.field_options?.map(opt => ({ value: opt.toLowerCase().replace(/\s+/g, '-'), label: opt }))
    }))
  })) || [],
  createdAt: backend.created_at,
  updatedAt: backend.updated_at
})

const transformFrontendToBackend = (frontend: Partial<Department> | FormData) => {
  // If it's already FormData (for file uploads), return as is
  if (frontend instanceof FormData) {
    return frontend
  }

  // Otherwise, create JSON payload (for non-file updates)
  const payload: any = {
    name: frontend.name,
    name_ar: frontend.name_ar || '',
    description: frontend.description || '',
    description_ar: frontend.description_ar || ''
  }

  if (frontend.steps && frontend.steps.length > 0) {
    payload.workflow_steps = frontend.steps.map((step, index) => ({
      ...(step.id && !step.id.includes('-') ? { id: parseInt(step.id) } : {}),
      title: step.title,
      title_ar: step.title_ar || '',
      description: step.description || '',
      description_ar: step.description_ar || '',
      form_fields: step.formFields.map((field, fieldIndex) => ({
        ...(field.id && !field.id.includes('-') ? { id: parseInt(field.id) } : {}),
        field_type: field.type,
        field_label: field.label,
        field_label_ar: field.label_ar || '',
        field_name: field.name,
        placeholder: field.placeholder || '',
        placeholder_ar: field.placeholder_ar || '',
        is_required: field.required || false,
        ...(field.options ? { field_options: field.options.map(opt => opt.label) } : {})
      }))
    }))
  }

  return payload
}

export const departmentsApi = createApi({
  reducerPath: 'departmentsApi',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Department'],
  endpoints: (builder) => ({
    // Get all departments with pagination
    getDepartments: builder.query<{
      departments: Department[]
      meta: PaginatedResponse<BackendDepartment>['meta']
      links: PaginatedResponse<BackendDepartment>['links']
    }, {
      page?: number
      per_page?: number
      search?: string
      sort_by?: string
      sort_order?: 'asc' | 'desc'
    }>({
      query: ({ page = 1, per_page = 15, search = '', sort_by = 'created_at', sort_order = 'desc' }) => ({
        url: '/dashboard/departments',
        params: { page, per_page, search, sort_by, sort_order }
      }),
      transformResponse: (response: PaginatedResponse<BackendDepartment>) => ({
        departments: response.data.map(transformBackendToFrontend),
        meta: response.meta,
        links: response.links
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.departments.map(({ id }) => ({ type: 'Department' as const, id })),
              { type: 'Department', id: 'LIST' },
            ]
          : [{ type: 'Department', id: 'LIST' }],
    }),

    // Get single department
    getDepartment: builder.query<Department, string | number>({
      query: (id) => `/dashboard/departments/${id}`,
      transformResponse: (response: SingleResponse<BackendDepartment>) =>
        transformBackendToFrontend(response.data),
      providesTags: (result, error, id) => [{ type: 'Department', id }],
    }),

    // Create department
    createDepartment: builder.mutation<Department, Partial<Department> | FormData>({
      query: (department) => {
        const body = transformFrontendToBackend(department)
        
        return {
          url: '/dashboard/departments',
          method: 'POST',
          body: body,
          formData: body instanceof FormData,
        }
      },
      transformResponse: (response: SingleResponse<BackendDepartment>) =>
        transformBackendToFrontend(response.data),
      invalidatesTags: [{ type: 'Department', id: 'LIST' }],
    }),

    // Update department
    updateDepartment: builder.mutation<Department, { id: string | number; data: Partial<Department> | FormData }>({
      query: ({ id, data }) => {
        const body = transformFrontendToBackend(data)
        
        // Laravel workaround: Use POST with _method=PUT for FormData
        if (body instanceof FormData) {
          body.append('_method', 'PUT')
          return {
            url: `/dashboard/departments/${id}`,
            method: 'POST',
            body: body,
            formData: true,
          }
        }
        
        // Regular JSON update
        return {
          url: `/dashboard/departments/${id}`,
          method: 'PUT',
          body: body,
        }
      },
      transformResponse: (response: SingleResponse<BackendDepartment>) =>
        transformBackendToFrontend(response.data),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Department', id },
        { type: 'Department', id: 'LIST' },
      ],
    }),

    // Delete department
    deleteDepartment: builder.mutation<DeleteResponse, string | number>({
      query: (id) => ({
        url: `/dashboard/departments/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Department', id: 'LIST' }],
    }),
  }),
})

export const {
  useGetDepartmentsQuery,
  useGetDepartmentQuery,
  useCreateDepartmentMutation,
  useUpdateDepartmentMutation,
  useDeleteDepartmentMutation,
} = departmentsApi