"use client"

import { Trash2, X } from "lucide-react"

interface BulkActionBarProps {
  count: number
  onDelete: () => void
  onClear: () => void
}

export function BulkActionBar({ count, onDelete, onClear }: BulkActionBarProps) {
  return (
    <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-900">
          {count} user{count !== 1 ? "s" : ""} selected
        </span>
        <div className="flex gap-2">
          <button
            onClick={onClear}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <X className="w-4 h-4" />
            Clear
          </button>
          <button
            onClick={onDelete}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Delete Selected
          </button>
        </div>
      </div>
    </div>
  )
}
