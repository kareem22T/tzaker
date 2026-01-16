"use client"

import { Trash2 } from "lucide-react"

interface BulkActionBarProps {
  selectedCount: number
  totalCount: number
  onSelectAll: () => void
  onDelete: () => void
  onClearSelection: () => void
}

export default function BulkActionBar({
  selectedCount,
  totalCount,
  onSelectAll,
  onDelete,
  onClearSelection,
}: BulkActionBarProps) {
  return (
    <div className="mb-6 p-4 bg-blue-50 darkx:bg-blue-500/10 border border-blue-200 darkx:border-blue-500/20 rounded-lg flex items-center justify-between flex-col sm:flex-row gap-4">
      <div className="flex items-center gap-4 flex-col sm:flex-row w-full sm:w-auto">
        <span className="text-gray-900 darkx:text-white font-medium text-sm sm:text-base">
          {selectedCount} of {totalCount} selected
        </span>
        {selectedCount < totalCount && (
          <button
            onClick={onSelectAll}
            className="text-blue-600 darkx:text-blue-400 hover:underline text-sm font-medium"
          >
            Select all
          </button>
        )}
      </div>
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <button
          onClick={onClearSelection}
          className="flex-1 sm:flex-none px-4 py-2 text-gray-700 darkx:text-gray-300 hover:bg-gray-100 darkx:hover:bg-white/10 rounded-lg transition-colors text-sm font-medium"
        >
          Clear
        </button>
        <button
          onClick={onDelete}
          className="flex-1 sm:flex-none px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 darkx:hover:bg-red-400 transition-colors font-medium flex items-center justify-center gap-2 text-sm"
        >
          <Trash2 size={16} />
          Delete
        </button>
      </div>
    </div>
  )
}
