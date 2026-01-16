"use client"

import { useState, useMemo } from "react"
import { Link } from "react-router"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "../../../store/store"
import {
  toggleIndividualSelection,
  clearIndividualSelection,
} from "../../../store/usersSlice"
import { useGetUsersQuery, useDeleteUserMutation } from "../../../store/api/usersApi"
import { BulkActionBar } from "./bulk-action-bar"
import { Eye, Trash2 } from "lucide-react"

export function IndividualUsersList() {
  const dispatch = useDispatch()
  const selectedIndividuals = useSelector((state: RootState) => state.users.selectedIndividuals)
  const [searchTerm, setSearchTerm] = useState("")
  const [page, setPage] = useState(1)

  // Fetch users from API (filter by individual)
  const { data, isLoading, isError, error } = useGetUsersQuery({
    user_type: 'individual',
    search: searchTerm,
    page,
  })

  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation()

  const individuals = data?.individuals || []

  const filteredUsers = useMemo(() => {
    // API already filters, but keep local filtering for immediate feedback
    return individuals.filter(
      (user) =>
        user.firstName?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
        user.lastName?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
        user.city?.toLowerCase().includes(searchTerm?.toLowerCase()),
    )
  }, [individuals, searchTerm])

  const allSelected = selectedIndividuals.length === filteredUsers.length && filteredUsers.length > 0

  const handleSelectAll = () => {
    if (allSelected) {
      dispatch(clearIndividualSelection())
    } else {
      // Select all current page items
      filteredUsers.forEach(user => {
        if (!selectedIndividuals.includes(user.id)) {
          dispatch(toggleIndividualSelection(user.id))
        }
      })
    }
  }

  const handleDeleteSingle = async (userId: string, userName: string) => {
    if (!window.confirm(`Are you sure you want to delete ${userName}?`)) {
      return
    }

    try {
      await deleteUser(userId).unwrap()
      // If this user was selected, remove from selection
      if (selectedIndividuals.includes(userId)) {
        dispatch(toggleIndividualSelection(userId))
      }
    } catch (error) {
      console.error(`Failed to delete user ${userId}:`, error)
      alert('Failed to delete user. Please try again.')
    }
  }

  const handleBulkDelete = async () => {
    if (selectedIndividuals.length === 0) return
    
    if (!window.confirm(`Are you sure you want to delete ${selectedIndividuals.length} user(s)?`)) {
      return
    }

    // Temporary: Delete one by one until backend provides bulk delete endpoint
    for (const id of selectedIndividuals) {
      try {
        await deleteUser(id).unwrap()
      } catch (error) {
        console.error(`Failed to delete user ${id}:`, error)
      }
    }
    dispatch(clearIndividualSelection())
  }

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setPage(1)
  }

  if (isError) {
    return (
      <div className="border border-red-200 rounded-lg p-6 bg-red-50">
        <h3 className="text-lg font-semibold text-red-900 mb-2">Error Loading Users</h3>
        <p className="text-red-700">
          {(error as any)?.data?.message || 'Failed to load users. Please try again.'}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {selectedIndividuals.length > 0 && (
        <BulkActionBar
          count={selectedIndividuals.length}
          onDelete={handleBulkDelete}
          onClear={() => dispatch(clearIndividualSelection())}
        />
      )}

      <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
        <input
          type="text"
          placeholder="Search by name, email, or city..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Phone</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">City</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Profile Complete</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                      No users found
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {user.name}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{user.email}</td>
                      <td className="px-4 py-3 text-gray-600">{user.phone}</td>
                      <td className="px-4 py-3 text-gray-600">{user.city}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-green-500 transition-all"
                              style={{ width: `${user.profile_complete}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-900">{user.profile_complete}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link to={`/users/profile/${user.id}`}>
                            <button 
                              className="inline-flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={isDeleting}
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </Link>
                          <button
                            onClick={() => handleDeleteSingle(user.id, user.name || 'this user')}
                            disabled={isDeleting}
                            className="inline-flex items-center gap-2 px-3 py-2 text-sm border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {data?.meta && data.meta.last_page > 1 && (
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {data.meta.from} to {data.meta.to} of {data.meta.total} users
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-gray-700">
                Page {page} of {data.meta.last_page}
              </span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page === data.meta.last_page}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}