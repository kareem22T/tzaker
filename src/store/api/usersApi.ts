import { createApi } from '@reduxjs/toolkit/query/react'
import type { IndividualUser, CompanyUser, Document } from '../usersSlice'
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

// Backend Document structure
interface BackendDocument {
  id: number
  name: string
  type: 'national_id' | 'union_card' | 'resume' | 'certificates'
  mime_type: string
  size: number
  url: string
  uploaded_at: string
}

// Backend documents can be either a single document or array of documents
interface BackendDocuments {
  national_id?: BackendDocument | null
  union_card?: BackendDocument | null
  resume?: BackendDocument | null
  certificates?: BackendDocument[] | null
}

// Backend User structure
interface BackendUser {
  id: number
  user_type: 'individual' | 'company'
  name?: string
  first_name: string
  last_name: string
  email: string
  phone: string
  profile_complete: number
  country: string
  city: string
  // Individual specific
  date_of_birth?: string
  gender?: string
  bio?: string
  primary_role?: string
  years_of_experience?: number
  portfolio_url?: string
  // Company specific
  legal_company_name?: string
  tax_number?: string
  registration_number?: string
  company_size?: string
  point_of_contact_name?: string
  point_of_contact_email?: string
  point_of_contact_phone?: string
  // Documents
  documents?: BackendDocuments
  created_at: string
  updated_at?: string
}

// Transform backend documents to frontend format
const transformDocuments = (backendDocs?: BackendDocuments): Document[] => {
  if (!backendDocs) return []
  
  const documents: Document[] = []
  
  // Handle single documents (national_id, union_card, resume)
  // Check for both existence and non-null value
  if (backendDocs.national_id && backendDocs.national_id !== null) {
    documents.push({
      id: backendDocs.national_id.id.toString(),
      type: 'national_id',
      name: backendDocs.national_id.name,
      url: backendDocs.national_id.url,
      uploadedAt: backendDocs.national_id.uploaded_at
    })
  }
  
  if (backendDocs.union_card && backendDocs.union_card !== null) {
    documents.push({
      id: backendDocs.union_card.id.toString(),
      type: 'union_card',
      name: backendDocs.union_card.name,
      url: backendDocs.union_card.url,
      uploadedAt: backendDocs.union_card.uploaded_at
    })
  }
  
  if (backendDocs.resume && backendDocs.resume !== null) {
    documents.push({
      id: backendDocs.resume.id.toString(),
      type: 'resume',
      name: backendDocs.resume.name,
      url: backendDocs.resume.url,
      uploadedAt: backendDocs.resume.uploaded_at
    })
  }
  
  // Handle certificates array - check for array and length
  if (backendDocs.certificates && Array.isArray(backendDocs.certificates) && backendDocs.certificates.length > 0) {
    backendDocs.certificates.forEach(cert => {
      documents.push({
        id: cert.id.toString(),
        type: 'certificates',
        name: cert.name,
        url: cert.url,
        uploadedAt: cert.uploaded_at
      })
    })
  }
  
  return documents
}

// Transform functions
const transformBackendToIndividual = (backend: BackendUser): IndividualUser => ({
  id: backend.id.toString(),
  type: 'individual',
  name: backend.name,
  firstName: backend.first_name,
  lastName: backend.last_name,
  email: backend.email,
  phone: backend.phone,
  country: backend.country,
  city: backend.city,
  profile_complete: backend.profile_complete,
  primaryRole: backend.primary_role || 'Not specified',
  yearsOfExperience: backend.years_of_experience || 0,
  portfolio: backend.portfolio_url,
  documents: transformDocuments(backend.documents),
  createdAt: backend.created_at
})

const transformBackendToCompany = (backend: BackendUser): CompanyUser => ({
  id: backend.id.toString(),
  type: 'company',
  name: backend.name,
  firstName: backend.first_name,
  lastName: backend.last_name,
  email: backend.email,
  phone: backend.phone,
  country: backend.country,
  city: backend.city,
  legalCompanyName: backend.legal_company_name || '',
  profile_complete: backend.profile_complete,
  taxNumber: backend.tax_number || '',
  registrationNumber: backend.registration_number || '',
  companySize: backend.company_size || '',
  pocName: backend.point_of_contact_name || '',
  pocEmail: backend.point_of_contact_email || '',
  pocPhone: backend.point_of_contact_phone || '',
  portfolio: backend.portfolio_url,
  documents: transformDocuments(backend.documents),
  createdAt: backend.created_at
})

export const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['User'],
  endpoints: (builder) => ({
    // Get all users with filters
    getUsers: builder.query<{
      individuals: IndividualUser[]
      companies: CompanyUser[]
      meta: PaginatedResponse<BackendUser>['meta']
      links: PaginatedResponse<BackendUser>['links']
    }, {
      user_type?: 'individual' | 'company' | ''
      search?: string
      page?: number
    }>({
      query: ({ user_type = '', search = '', page = 1 }) => ({
        url: '/dashboard/users',
        params: { user_type, search, page }
      }),
      transformResponse: (response: PaginatedResponse<BackendUser>) => {
        const individuals: IndividualUser[] = []
        const companies: CompanyUser[] = []

        response.data.forEach(user => {
          if (user.user_type === 'individual') {
            individuals.push(transformBackendToIndividual(user))
          } else if (user.user_type === 'company') {
            companies.push(transformBackendToCompany(user))
          }
        })

        return {
          individuals,
          companies,
          meta: response.meta,
          links: response.links
        }
      },
      providesTags: (result) =>
        result
          ? [
              ...result.individuals.map(({ id }) => ({ type: 'User' as const, id })),
              ...result.companies.map(({ id }) => ({ type: 'User' as const, id })),
              { type: 'User', id: 'LIST' },
            ]
          : [{ type: 'User', id: 'LIST' }],
    }),

    // Get single user (individual or company)
    getUser: builder.query<IndividualUser | CompanyUser, string | number>({
      query: (id) => `/dashboard/users/${id}`,
      transformResponse: (response: SingleResponse<BackendUser>) => {
        const user = response.data
        if (user.user_type === 'individual') {
          return transformBackendToIndividual(user)
        } else {
          return transformBackendToCompany(user)
        }
      },
      providesTags: (result, error, id) => [{ type: 'User', id }],
    }),

    // Delete user
    deleteUser: builder.mutation<DeleteResponse, string | number>({
      query: (id) => ({
        url: `/dashboard/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }],
    }),

    // Bulk delete users (commented out until backend endpoint is ready)
    // deleteMultipleUsers: builder.mutation<DeleteResponse, string[]>({
    //   query: (ids) => ({
    //     url: '/dashboard/users/bulk-delete',
    //     method: 'POST',
    //     body: { ids },
    //   }),
    //   invalidatesTags: [{ type: 'User', id: 'LIST' }],
    // }),

    // Create and Update endpoints are commented out as per requirements
    // Uncomment when add/edit functionality is needed

    // createUser: builder.mutation<IndividualUser | CompanyUser, Partial<BackendUser>>({
    //   query: (user) => ({
    //     url: '/dashboard/users',
    //     method: 'POST',
    //     body: user,
    //   }),
    //   invalidatesTags: [{ type: 'User', id: 'LIST' }],
    // }),

    // updateUser: builder.mutation<IndividualUser | CompanyUser, { id: string | number; data: Partial<BackendUser> }>({
    //   query: ({ id, data }) => ({
    //     url: `/dashboard/users/${id}`,
    //     method: 'PUT',
    //     body: data,
    //   }),
    //   invalidatesTags: (result, error, { id }) => [
    //     { type: 'User', id },
    //     { type: 'User', id: 'LIST' },
    //   ],
    // }),
  }),
})

export const {
  useGetUsersQuery,
  useGetUserQuery,
  useDeleteUserMutation,
  // useDeleteMultipleUsersMutation, // Uncomment when backend endpoint is ready
  // useCreateUserMutation, // Uncomment when needed
  // useUpdateUserMutation, // Uncomment when needed
} = usersApi