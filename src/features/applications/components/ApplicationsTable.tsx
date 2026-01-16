"use client"

import { Star, Trash2, Eye, CheckCircle, XCircle, Clock } from "lucide-react"
import type { Application } from "../../../store/applicationsSlice"

interface ApplicationsTableProps {
  applications: Application[]
  selectedApplications: Set<string>
  onSelectAll: () => void
  onToggleSelect: (id: string) => void
  onDelete: (id: string) => void
  onView: (id: string) => void
}

export default function ApplicationsTable({
  applications,
  selectedApplications,
  onSelectAll,
  onToggleSelect,
  onDelete,
  onView,
}: ApplicationsTableProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle size={16} className="text-green-500 darkx:text-green-400" />
      case "rejected":
        return <XCircle size={16} className="text-red-500 darkx:text-red-400" />
      default:
        return <Clock size={16} className="text-yellow-500 darkx:text-yellow-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-50 darkx:bg-green-500/10 text-green-700 darkx:text-green-400"
      case "rejected":
        return "bg-red-50 darkx:bg-red-500/10 text-red-700 darkx:text-red-400"
      default:
        return "bg-yellow-50 darkx:bg-yellow-500/10 text-yellow-700 darkx:text-yellow-400"
    }
  }

  const allSelected = applications.length > 0 && selectedApplications.size === applications.length

  return (
    <div className="border border-gray-200 darkx:border-gray-700 rounded-xl overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 darkx:bg-gray-900 border-b border-gray-200 darkx:border-gray-700">
          <tr>
            <th className="px-4 sm:px-6 py-4 text-left">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={onSelectAll}
                className="w-5 h-5 rounded border-gray-300 darkx:border-gray-600 cursor-pointer accent-blue-500"
              />
            </th>
            <th className="px-4 sm:px-6 py-4 text-left font-semibold text-gray-900 darkx:text-white text-sm">User</th>
            <th className="px-4 sm:px-6 py-4 text-left font-semibold text-gray-900 darkx:text-white text-sm hidden sm:table-cell">
              Department
            </th>
            <th className="px-4 sm:px-6 py-4 text-left font-semibold text-gray-900 darkx:text-white text-sm">Status</th>
            <th className="px-4 sm:px-6 py-4 text-left font-semibold text-gray-900 darkx:text-white text-sm hidden md:table-cell">
              Completion
            </th>
            <th className="px-4 sm:px-6 py-4 text-center font-semibold text-gray-900 darkx:text-white text-sm hidden lg:table-cell">
              Rating
            </th>
            <th className="px-4 sm:px-6 py-4 text-center font-semibold text-gray-900 darkx:text-white text-sm">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 darkx:divide-gray-700">
          {applications.map((app) => (
            <tr key={app.id} className="hover:bg-gray-50 darkx:hover:bg-gray-800/50 transition-colors">
              <td className="px-4 sm:px-6 py-4">
                <input
                  type="checkbox"
                  checked={selectedApplications.has(app.id)}
                  onChange={() => onToggleSelect(app.id)}
                  className="w-5 h-5 rounded border-gray-300 darkx:border-gray-600 cursor-pointer accent-blue-500"
                />
              </td>
              <td className="px-4 sm:px-6 py-4">
                <div className="font-semibold text-gray-900 darkx:text-white text-sm sm:text-base">{app.userName}</div>
              </td>
              <td className="px-4 sm:px-6 py-4 hidden sm:table-cell">
                <span className="text-gray-600 darkx:text-gray-400 text-sm">{app.departmentName}</span>
              </td>
              <td className="px-4 sm:px-6 py-4">
                <div
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${getStatusColor(app.status)}`}
                >
                  {getStatusIcon(app.status)}
                  <span className="capitalize">{app.status}</span>
                </div>
              </td>
              <td className="px-4 sm:px-6 py-4 hidden md:table-cell">
                <div className="flex items-center gap-2">
                  <div className="w-16 h-2 bg-gray-200 darkx:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 transition-all"
                      style={{ width: `${app.completionPercentage}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-gray-700 darkx:text-gray-300 whitespace-nowrap">
                    {Math.round(app.completionPercentage)}%
                  </span>
                </div>
              </td>
              <td className="px-4 sm:px-6 py-4 hidden lg:table-cell text-center">
                {app.rating ? (
                  <div className="flex items-center justify-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={
                          i < app.rating! ? "fill-yellow-400 text-yellow-400" : "text-gray-300 darkx:text-gray-600"
                        }
                      />
                    ))}
                  </div>
                ) : (
                  <span className="text-xs text-gray-500 darkx:text-gray-400">-</span>
                )}
              </td>
              <td className="px-4 sm:px-6 py-4">
                <div className="flex items-center justify-center gap-2 sm:gap-3">
                  <button
                    onClick={() => onView(app.id)}
                    className="p-2 text-brand-600 darkx:text-brand-400 hover:bg-brand-50 darkx:hover:bg-brand-500/10 rounded-lg transition-colors"
                    title="View"
                  >
                    <Eye size={18} />
                  </button>
                  <button
                    onClick={() => onDelete(app.id)}
                    className="p-2 text-red-600 darkx:text-red-400 hover:bg-red-50 darkx:hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {applications.length === 0 && (
        <div className="px-4 sm:px-6 py-12 text-center">
          <p className="text-gray-600 darkx:text-gray-400">No applications found</p>
        </div>
      )}
    </div>
  )
}
