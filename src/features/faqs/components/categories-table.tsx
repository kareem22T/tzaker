"use client"
import { Link } from "react-router"
import type { FaqCategory } from "../../../store/faqsSlice"
import { Trash2, Edit } from "lucide-react"

interface CategoriesTableProps {
  categories: FaqCategory[]
  selectedCategories: Set<string>
  onSelectAll: () => void
  onToggleSelect: (id: string) => void
  onDelete: (id: string) => void
  allSelected: boolean
  isDeleting?: boolean
}

export default function CategoriesTable({
  categories,
  selectedCategories,
  onSelectAll,
  onToggleSelect,
  onDelete,
  allSelected,
  isDeleting = false,
}: CategoriesTableProps) {
  return (
    <table className="w-full text-sm">
      <thead className="bg-[#0a1929] border-b border-[#1e3a52]">
        <tr>
          <th className="px-4 py-3 text-left font-semibold text-gray-300">
            Category
          </th>
          <th className="px-4 py-3 text-left font-semibold text-gray-300 hidden md:table-cell">
            Description
          </th>
          <th className="px-4 py-3 text-left font-semibold text-gray-300 hidden sm:table-cell">
            Icon
          </th>
          <th className="px-4 py-3 text-left font-semibold text-gray-300 hidden sm:table-cell">
            Created
          </th>
          <th className="px-4 py-3 text-center font-semibold text-gray-300">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-[#1e3a52]">
        {categories.map((category) => (
          <tr key={category.id} className="hover:bg-[#0a1929]/50 transition-colors">
            <td className="px-4 py-3">
              <div className="font-medium text-white">{category.title}</div>
            </td>
            <td className="px-4 py-3 hidden md:table-cell">
              <span className="text-gray-300">{category.description || "—"}</span>
            </td>
            <td className="px-4 py-3 hidden sm:table-cell">
              {category.icon_url ? (
                <img
                  src={category.icon_url}
                  alt={`${category.title} icon`}
                  className="w-10 h-10 rounded-lg object-cover border border-[#1e3a52]"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                    e.currentTarget.parentElement!.innerHTML =
                      '<span class="text-gray-400 text-sm">No icon</span>'
                  }}
                />
              ) : (
                <span className="text-gray-400">No icon</span>
              )}
            </td>
            <td className="px-4 py-3 hidden sm:table-cell">
              <span className="text-gray-300">
                {new Date(category.createdAt).toLocaleDateString()}
              </span>
            </td>
            <td className="px-4 py-3">
              <div className="flex items-center justify-center gap-2">
                <Link
                  to={`/faqs/categories/edit/${category.id}`}
                  className={`p-1.5 text-[#00ff88] hover:bg-[#00ff88]/10 rounded transition-colors ${
                    isDeleting ? 'pointer-events-none opacity-50' : ''
                  }`}
                >
                  <Edit size={16} />
                </Link>
                <button
                  onClick={() => onDelete(category.id)}
                  disabled={isDeleting}
                  className="p-1.5 text-red-400 hover:bg-red-400/10 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
      {categories.length === 0 && (
        <tbody>
          <tr>
            <td colSpan={5} className="px-4 py-12 text-center text-gray-400">
              No categories found
            </td>
          </tr>
        </tbody>
      )}
    </table>
  )
}