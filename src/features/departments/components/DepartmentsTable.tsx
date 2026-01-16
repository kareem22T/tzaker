"use client"

import { Link } from "react-router"
import type { Department } from "../../../store/departmentsSlice"
import { Trash2, Edit, Briefcase } from "lucide-react"

interface DepartmentsTableProps {
  departments: Department[]
  selectedDepartments: string[]  // Changed from Set to array
  onSelectAll: () => void
  onToggleSelect: (id: string) => void
  onDelete: (id: string) => void
  allSelected: boolean
  isDeleting?: boolean
}

export default function DepartmentsTable({
  departments,
  selectedDepartments,
  onSelectAll,
  onToggleSelect,
  onDelete,
  allSelected,
  isDeleting = false,
}: DepartmentsTableProps) {
  return (
    <div className="border border-gray-200 darkx:border-gray-700 rounded-xl overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 darkx:bg-gray-900 border-b border-gray-200 darkx:border-gray-700">
          <tr>
            {/* <th className="px-4 sm:px-6 py-4 text-left">
              <input
                type="checkbox"
                checked={allSelected && departments.length > 0}
                onChange={onSelectAll}
                disabled={isDeleting || departments.length === 0}
                className="w-5 h-5 rounded border-gray-300 darkx:border-gray-600 cursor-pointer accent-brand-500 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </th> */}
            <th className="px-4 sm:px-6 py-4 text-left font-semibold text-gray-900 darkx:text-white text-sm">
              Department
            </th>
            <th className="px-4 sm:px-6 py-4 text-left font-semibold text-gray-900 darkx:text-white text-sm hidden md:table-cell">
              Description
            </th>
            <th className="px-4 sm:px-6 py-4 text-left font-semibold text-gray-900 darkx:text-white text-sm">
              Steps
            </th>
            <th className="px-4 sm:px-6 py-4 text-left font-semibold text-gray-900 darkx:text-white text-sm hidden sm:table-cell">
              Created
            </th>
            <th className="px-4 sm:px-6 py-4 text-center font-semibold text-gray-900 darkx:text-white text-sm">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 darkx:divide-gray-700">
          {departments.map((dept) => (
            <tr key={dept.id} className="hover:bg-gray-50 darkx:hover:bg-gray-800/50 transition-colors">
              {/* <td className="px-4 sm:px-6 py-4">
                <input
                  type="checkbox"
                  checked={selectedDepartments.includes(dept.id)}
                  onChange={() => onToggleSelect(dept.id)}
                  disabled={isDeleting}
                  className="w-5 h-5 rounded border-gray-300 darkx:border-gray-600 cursor-pointer accent-brand-500 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </td> */}
              <td className="px-4 sm:px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg overflow-hidden bg-brand-50 darkx:bg-brand-500/10 flex items-center justify-center border border-brand-200 darkx:border-brand-500/20">
                    {dept.icon_url ? (
                      <img 
                        src={dept.icon_url} 
                        alt={dept.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Briefcase size={20} className="text-brand-600 darkx:text-brand-400" />
                    )}
                  </div>
                  
                  <div className="font-semibold text-gray-900 darkx:text-white text-sm sm:text-base">
                    {dept.name}
                  </div>
                </div>
              </td>
              <td className="px-4 sm:px-6 py-4 hidden md:table-cell">
                <span className="text-gray-600 darkx:text-gray-400 text-sm">
                  {dept.description || "-"}
                </span>
              </td>
              <td className="px-4 sm:px-6 py-4">
                <span className="inline-block px-3 py-1 bg-brand-50 darkx:bg-brand-500/10 text-brand-700 darkx:text-brand-400 text-xs sm:text-sm font-medium rounded-full">
                  {dept.steps_count}
                </span>
              </td>
              <td className="px-4 sm:px-6 py-4 hidden sm:table-cell">
                <span className="text-gray-600 darkx:text-gray-400 text-sm">
                  {new Date(dept.createdAt).toLocaleDateString()}
                </span>
              </td>
              <td className="px-4 sm:px-6 py-4">
                <div className="flex items-center justify-center gap-2 sm:gap-3">
                  <Link
                    to={`/departments/edit/${dept.id}`}
                    className={`p-2 text-success-600 darkx:text-success-400 hover:bg-success-50 darkx:hover:bg-success-500/10 rounded-lg transition-colors ${
                      isDeleting ? 'pointer-events-none opacity-50' : ''
                    }`}
                    title="Edit"
                  >
                    <Edit size={18} />
                  </Link>
                  <button
                    onClick={() => onDelete(dept.id)}
                    disabled={isDeleting}
                    className="p-2 text-error-600 darkx:text-error-400 hover:bg-error-50 darkx:hover:bg-error-500/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
      {departments.length === 0 && (
        <div className="px-4 sm:px-6 py-12 text-center">
          <p className="text-gray-600 darkx:text-gray-400">No departments found</p>
        </div>
      )}
    </div>
  )
}