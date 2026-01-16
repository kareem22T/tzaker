"use client"

import { useState } from "react"
import { useNavigate } from "react-router"
import {
  useGetApplicationsQuery,
  useDeleteApplicationMutation,
  useUpdateApplicationStatusMutation,
} from "../../store/api/applicationsApi"
import ApplicationsTable from "./components/ApplicationsTable"
import BulkApplicationActionBar from "./components/BulkApplicationActionBar"

export default function ApplicationsPage() {
  const router = useNavigate()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<'' | 'pending' | 'approved' | 'rejected'>('')
  const [departmentFilter, setDepartmentFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedApplications, setSelectedApplications] = useState<Set<string>>(new Set())

  // Fetch applications with filters
  const { data, isLoading, isFetching, error } = useGetApplicationsQuery({
    status: statusFilter,
    department_id: departmentFilter,
    search: searchTerm,
    page: currentPage,
  })

  const [deleteApplication] = useDeleteApplicationMutation()
  const [updateStatus] = useUpdateApplicationStatusMutation()

  const applications = data?.applications || []
  const pagination = data?.pagination

  const handleSelectAll = () => {
    if (selectedApplications.size === applications.length) {
      setSelectedApplications(new Set())
    } else {
      setSelectedApplications(new Set(applications.map(app => app.id)))
    }
  }

  const handleToggleSelect = (id: string) => {
    const newSelected = new Set(selectedApplications)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedApplications(newSelected)
  }

  const handleBulkDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedApplications.size} application(s)?`)) {
      return
    }

    try {
      // Delete each selected application
      await Promise.all(
        Array.from(selectedApplications).map(id => deleteApplication(id).unwrap())
      )
      setSelectedApplications(new Set())
    } catch (err) {
      console.error('Failed to delete applications:', err)
      alert('Failed to delete some applications. Please try again.')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this application?')) {
      return
    }

    try {
      await deleteApplication(id).unwrap()
    } catch (err) {
      console.error('Failed to delete application:', err)
      alert('Failed to delete application. Please try again.')
    }
  }

  const handleBulkStatusChange = async (status: "approved" | "rejected" | "pending") => {
    try {
      await Promise.all(
        Array.from(selectedApplications).map(id => 
          updateStatus({ id, status }).unwrap()
        )
      )
      setSelectedApplications(new Set())
    } catch (err) {
      console.error('Failed to update status:', err)
      alert('Failed to update some applications. Please try again.')
    }
  }

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1) // Reset to first page on search
  }

  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6 flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-auto">
              <h1 className="text-3xl sm:text-4xl font-semibold text-gray-900 darkx:text-white mb-2">Applications</h1>
              <p className="text-gray-600 darkx:text-gray-400 text-sm sm:text-base">
                Review and manage all department applications
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <input
                type="text"
                placeholder="Search by user or department..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full px-4 py-3 bg-white darkx:bg-gray-800 border border-gray-200 darkx:border-gray-700 rounded-lg text-gray-900 darkx:text-white placeholder-gray-500 darkx:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 darkx:focus:ring-blue-400"
              />
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value as '' | 'pending' | 'approved' | 'rejected')
                  setCurrentPage(1)
                }}
                className="w-full px-4 py-3 bg-white darkx:bg-gray-800 border border-gray-200 darkx:border-gray-700 rounded-lg text-gray-900 darkx:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 darkx:focus:ring-blue-400"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bulk Action Bar */}
        {selectedApplications.size > 0 && (
          <BulkApplicationActionBar
            selectedCount={selectedApplications.size}
            totalCount={applications.length}
            onSelectAll={handleSelectAll}
            onDelete={handleBulkDelete}
            onApprove={() => handleBulkStatusChange("approved")}
            onReject={() => handleBulkStatusChange("rejected")}
            onPending={() => handleBulkStatusChange("pending")}
            onClearSelection={() => setSelectedApplications(new Set())}
          />
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <p className="text-gray-600 darkx:text-gray-400">Loading applications...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-600 darkx:text-red-400">Failed to load applications. Please try again.</p>
          </div>
        )}

        {/* Table */}
        {!isLoading && !error && (
          <>
            <ApplicationsTable
              applications={applications}
              selectedApplications={selectedApplications}
              onSelectAll={handleSelectAll}
              onToggleSelect={handleToggleSelect}
              onDelete={handleDelete}
              onView={(id) => router(`/applications/${id}`)}
            />

            {/* Pagination */}
            {pagination && pagination.total_pages > 1 && (
              <div className="mt-6 flex items-center justify-between">
                <p className="text-sm text-gray-600 darkx:text-gray-400">
                  Showing {applications.length} of {pagination.total} applications
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1 || isFetching}
                    className="px-4 py-2 bg-white darkx:bg-gray-800 border border-gray-200 darkx:border-gray-700 rounded-lg text-gray-900 darkx:text-white hover:bg-gray-50 darkx:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2 bg-white darkx:bg-gray-800 border border-gray-200 darkx:border-gray-700 rounded-lg text-gray-900 darkx:text-white">
                    Page {currentPage} of {pagination.total_pages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(pagination.total_pages, p + 1))}
                    disabled={currentPage === pagination.total_pages || isFetching}
                    className="px-4 py-2 bg-white darkx:bg-gray-800 border border-gray-200 darkx:border-gray-700 rounded-lg text-gray-900 darkx:text-white hover:bg-gray-50 darkx:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  )
}