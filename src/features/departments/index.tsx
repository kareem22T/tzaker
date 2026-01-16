"use client"

import { useState } from "react"
import { Link } from "react-router"
import { useDispatch, useSelector } from "react-redux"
import {
  toggleDepartmentSelection,
  selectAllDepartments,
  clearSelection,
} from "../../store/departmentsSlice"
import type { RootState } from "../../store/store"
import { useGetDepartmentsQuery, useDeleteDepartmentMutation } from "../../store/api/departmentsApi"
import DepartmentsTable from "./components/DepartmentsTable"
import BulkActionBar from "./components/BulkActionBar"

export default function DepartmentsPage() {
  const dispatch = useDispatch()
  const selectedDepartments = useSelector((state: RootState) => state.departments.selectedDepartments)
  const [searchTerm, setSearchTerm] = useState("")
  const [page, setPage] = useState(1)
  const [sortBy, setSortBy] = useState("created_at")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  // Fetch departments from API
  const { data, isLoading, isError, error } = useGetDepartmentsQuery({
    page,
    per_page: 15,
    search: searchTerm,
    sort_by: sortBy,
    sort_order: sortOrder,
  })

  const [deleteDepartment, { isLoading: isDeleting }] = useDeleteDepartmentMutation()

  const departments = data?.departments || []
  const meta = data?.meta

  const handleSelectAll = () => {
    if (selectedDepartments.length === departments.length) {
      dispatch(clearSelection())
    } else {
      dispatch(selectAllDepartments())
    }
  }

  const handleToggleSelect = (id: string) => {
    dispatch(toggleDepartmentSelection(id))
  }

  const handleBulkDelete = async () => {
    // Bulk delete functionality commented out until backend endpoint is ready
    // const idsToDelete = Array.from(selectedDepartments)
    // try {
    //   await deleteMultipleDepartments(idsToDelete).unwrap()
    //   dispatch(clearSelection())
    // } catch (error) {
    //   console.error('Failed to delete departments:', error)
    //   alert('Failed to delete departments. Please try again.')
    // }
    
    // Temporary: Delete one by one
    const idsToDelete = Array.from(selectedDepartments)
    for (const id of idsToDelete) {
      try {
        await deleteDepartment(id).unwrap()
      } catch (error) {
        console.error(`Failed to delete department ${id}:`, error)
      }
    }
    dispatch(clearSelection())
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      try {
        await deleteDepartment(id).unwrap()
      } catch (error: any) {
        console.error('Failed to delete department:', error)
        alert(error?.data?.message || 'Failed to delete department. Please try again.')
      }
    }
  }

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setPage(1) // Reset to first page on search
  }

  if (isError) {
    return (
      <main className="min-h-screen">
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-semibold text-error-600 darkx:text-error-400 mb-2">
            Error Loading Departments
          </h1>
          <p className="text-gray-600 darkx:text-gray-400">
            {(error as any)?.data?.message || 'Failed to load departments. Please try again.'}
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6 flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-auto">
              <h1 className="text-3xl sm:text-4xl font-semibold text-gray-900 darkx:text-white mb-2">
                Departments
              </h1>
              <p className="text-gray-600 darkx:text-gray-400 text-sm sm:text-base">
                Manage your organization's departments and workflows
              </p>
            </div>
            <Link
              to="/departments/add"
              className="w-full sm:w-auto px-6 py-3 bg-brand-500 text-white rounded-lg font-medium hover:bg-brand-600 darkx:hover:bg-brand-400 transition-colors text-center"
            >
              + New Department
            </Link>
          </div>

          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search departments..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full px-4 py-3 bg-white darkx:bg-gray-800 border border-gray-200 darkx:border-gray-700 rounded-lg text-gray-900 darkx:text-white placeholder-gray-500 darkx:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 darkx:focus:ring-brand-400"
            />
          </div>
        </div>

        {/* Bulk Action Bar - Commented out until bulk delete endpoint is ready */}
        {selectedDepartments.length > 0 && (
          <BulkActionBar
            selectedCount={selectedDepartments.length}
            totalCount={departments.length}
            onSelectAll={handleSelectAll}
            onDelete={handleBulkDelete}
            onClearSelection={() => dispatch(clearSelection())}
          />
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
          </div>
        )}

        {/* Table */}
        {!isLoading && (
          <>
            <DepartmentsTable
              departments={departments}
              selectedDepartments={selectedDepartments}
              onSelectAll={handleSelectAll}
              onToggleSelect={handleToggleSelect}
              onDelete={handleDelete}
              allSelected={selectedDepartments.length === departments.length}
              isDeleting={isDeleting}
            />

            {/* Pagination */}
            {meta && meta.last_page > 1 && (
              <div className="mt-6 flex items-center justify-between">
                <div className="text-sm text-gray-600 darkx:text-gray-400">
                  Showing {meta.from} to {meta.to} of {meta.total} departments
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                    className="px-4 py-2 bg-white darkx:bg-gray-800 border border-gray-200 darkx:border-gray-700 rounded-lg text-gray-700 darkx:text-gray-300 hover:bg-gray-50 darkx:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  <div className="flex items-center gap-2">
                    {Array.from({ length: meta.last_page }, (_, i) => i + 1)
                      .filter(p => {
                        // Show first, last, current, and nearby pages
                        return p === 1 || 
                               p === meta.last_page || 
                               Math.abs(p - page) <= 1
                      })
                      .map((p, i, arr) => {
                        // Add ellipsis
                        if (i > 0 && p - arr[i - 1] > 1) {
                          return [
                            <span key={`ellipsis-${p}`} className="px-2 text-gray-500">...</span>,
                            <button
                              key={p}
                              onClick={() => setPage(p)}
                              className={`px-4 py-2 rounded-lg transition-colors ${
                                p === page
                                  ? 'bg-brand-500 text-white'
                                  : 'bg-white darkx:bg-gray-800 border border-gray-200 darkx:border-gray-700 text-gray-700 darkx:text-gray-300 hover:bg-gray-50 darkx:hover:bg-gray-700'
                              }`}
                            >
                              {p}
                            </button>
                          ]
                        }
                        return (
                          <button
                            key={p}
                            onClick={() => setPage(p)}
                            className={`px-4 py-2 rounded-lg transition-colors ${
                              p === page
                                ? 'bg-brand-500 text-white'
                                : 'bg-white darkx:bg-gray-800 border border-gray-200 darkx:border-gray-700 text-gray-700 darkx:text-gray-300 hover:bg-gray-50 darkx:hover:bg-gray-700'
                            }`}
                          >
                            {p}
                          </button>
                        )
                      })}
                  </div>
                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={page === meta.last_page}
                    className="px-4 py-2 bg-white darkx:bg-gray-800 border border-gray-200 darkx:border-gray-700 rounded-lg text-gray-700 darkx:text-gray-300 hover:bg-gray-50 darkx:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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