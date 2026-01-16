"use client"

import { Trash2, CheckCircle, XCircle, Clock } from "lucide-react"

interface BulkApplicationActionBarProps {
  selectedCount: number
  totalCount: number
  onSelectAll: () => void
  onDelete: () => void
  onApprove: () => void
  onReject: () => void
  onPending: () => void
  onClearSelection: () => void
}

export default function BulkApplicationActionBar({
  selectedCount,
  totalCount,
  onSelectAll,
  onDelete,
  onApprove,
  onReject,
  onPending,
  onClearSelection,
}: BulkApplicationActionBarProps) {
  return (
    <div className="mb-6 p-4 bg-blue-50 darkx:bg-blue-500/10 border border-blue-200 darkx:border-blue-500/20 rounded-lg space-y-4">
      <div className="flex items-center justify-between flex-col sm:flex-row gap-4">
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
        <button
          onClick={onClearSelection}
          className="px-4 py-2 text-gray-700 darkx:text-gray-300 hover:bg-gray-100 darkx:hover:bg-white/10 rounded-lg transition-colors text-sm font-medium"
        >
          Clear
        </button>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={onApprove}
          className="flex items-center gap-2 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 darkx:hover:bg-green-400 transition-colors font-medium text-sm"
        >
          <CheckCircle size={16} />
          Approve
        </button>
        <button
          onClick={onReject}
          className="flex items-center gap-2 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 darkx:hover:bg-red-400 transition-colors font-medium text-sm"
        >
          <XCircle size={16} />
          Reject
        </button>
        <button
          onClick={onPending}
          className="flex items-center gap-2 px-3 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 darkx:hover:bg-yellow-400 transition-colors font-medium text-sm"
        >
          <Clock size={16} />
          Pending
        </button>
        <button
          onClick={onDelete}
          className="flex items-center gap-2 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 darkx:hover:bg-red-400 transition-colors font-medium text-sm ml-auto"
        >
          <Trash2 size={16} />
          Delete
        </button>
      </div>
    </div>
  )
}
