"use client"

import { useState, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "../../../store/store"
import {
  toggleMessageSelection,
  selectAllMessages,
  clearMessageSelection,
} from "../../../store/contactMessagesSlice"
import {
  useGetContactMessagesQuery,
  useMarkMessageAsReadMutation,
  useDeleteContactMessageMutation,
  useDeleteMultipleContactMessagesMutation,
} from "../../../store/api/contactMessagesApi"
import { BulkActionBar } from "./bulk-action-bar"
import { Mail, Calendar, Trash2, Eye } from "lucide-react"

export function ContactMessagesList() {
  const dispatch = useDispatch()
  const selected = useSelector((state: RootState) => state.contactMessages.selectedMessages)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRead, setFilterRead] = useState<boolean | undefined>(undefined)
  const [currentPage, setCurrentPage] = useState(1)
  const [expandedMessage, setExpandedMessage] = useState<string | null>(null)

  // Fetch messages from API
  const { data, isLoading, isError, error } = useGetContactMessagesQuery({
    search: searchTerm,
    is_read: filterRead,
    page: currentPage,
  })

  const [markAsRead] = useMarkMessageAsReadMutation()
  const [deleteMessage, { isLoading: isDeleting }] = useDeleteContactMessageMutation()
  const [deleteMultiple, { isLoading: isDeletingMultiple }] = useDeleteMultipleContactMessagesMutation()

  const messages = data?.messages || []
  const meta = data?.meta

  const allSelected = selected.size === messages.length && messages.length > 0

  const handleSelectAll = () => {
    if (allSelected) {
      dispatch(clearMessageSelection())
    } else {
      dispatch(selectAllMessages(messages.map((m) => m.id)))
    }
  }

  const handleToggleSelect = (id: string) => {
    dispatch(toggleMessageSelection(id))
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        await deleteMessage(id).unwrap()
      } catch (error: any) {
        console.error('Failed to delete message:', error)
        alert(error?.data?.message || 'Failed to delete message. Please try again.')
      }
    }
  }

  const handleBulkDelete = async () => {
    if (selected.size === 0) return

    if (!window.confirm(`Are you sure you want to delete ${selected.size} message${selected.size > 1 ? 's' : ''}?`)) {
      return
    }

    try {
      await deleteMultiple(Array.from(selected)).unwrap()
      dispatch(clearMessageSelection())
    } catch (error: any) {
      console.error('Failed to delete messages:', error)
      alert(error?.data?.message || 'Failed to delete messages. Please try again.')
    }
  }

  const handleMessageClick = async (messageId: string, isRead?: boolean) => {
    setExpandedMessage(expandedMessage === messageId ? null : messageId)
    
    // Mark as read when expanding
    if (expandedMessage !== messageId && !isRead) {
      try {
        await markAsRead(messageId).unwrap()
      } catch (error) {
        console.error('Failed to mark message as read:', error)
      }
    }
  }

  if (isError) {
    return (
      <div className="border border-red-200 rounded-lg p-6 bg-red-50 text-center">
        <p className="text-red-600">
          {(error as any)?.data?.message || 'Failed to load messages. Please try again.'}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {selected.size > 0 && (
        <BulkActionBar
          count={selected.size}
          onDelete={handleBulkDelete}
          onClear={() => dispatch(clearMessageSelection())}
        />
      )}

      <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
        <div className="mb-4 space-y-4">
          <input
            type="text"
            placeholder="Search by name, email, or subject..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setCurrentPage(1) // Reset to first page on search
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
            disabled={isLoading}
          />

          <div className="flex gap-2">
            <button
              onClick={() => {
                setFilterRead(undefined)
                setCurrentPage(1)
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterRead === undefined
                  ? 'bg-brand-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              disabled={isLoading}
            >
              All
            </button>
            <button
              onClick={() => {
                setFilterRead(false)
                setCurrentPage(1)
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterRead === false
                  ? 'bg-brand-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              disabled={isLoading}
            >
              Unread
            </button>
            <button
              onClick={() => {
                setFilterRead(true)
                setCurrentPage(1)
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterRead === true
                  ? 'bg-brand-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              disabled={isLoading}
            >
              Read
            </button>
          </div>

        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
          </div>
        )}

        {/* Messages List */}
        {!isLoading && (
          <div className="space-y-3">
            {messages.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Mail className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <p>No messages found</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`border rounded-lg transition-colors ${
                    msg.isRead ? 'border-gray-200 bg-white' : 'border-brand-200 bg-brand-50/30'
                  } ${selected.has(msg.id) ? 'ring-2 ring-brand-500' : ''}`}
                >
                  <div className="flex items-start gap-3 p-4">
                    <div
                      className="flex-1 cursor-pointer"
                      onClick={() => handleMessageClick(msg.id, msg.isRead)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className={`font-semibold ${msg.isRead ? 'text-gray-700' : 'text-gray-900'}`}>
                              {msg.name}
                            </h3>
                            {!msg.isRead && (
                              <span className="px-2 py-0.5 bg-brand-500 text-white text-xs rounded-full">
                                New
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{msg.email}</p>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500 flex-shrink-0">
                          <Calendar className="w-3 h-3" />
                          {new Date(msg.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <p className={`font-medium text-sm mb-1 ${msg.isRead ? 'text-gray-700' : 'text-gray-900'}`}>
                        {msg.subject}
                      </p>
                      <p className="text-sm text-gray-600 line-clamp-2">{msg.message}</p>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDelete(msg.id)
                      }}
                      disabled={isDeleting || isDeletingMultiple}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                      title="Delete message"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {expandedMessage === msg.id && (
                    <div className="border-t border-gray-200 bg-gray-50 p-4">
                      <div className="mb-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Full Message:</h4>
                        <p className="text-gray-700 whitespace-pre-wrap">{msg.message}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">From:</p>
                          <p className="font-medium text-gray-900">
                            {msg.firstName} {msg.lastName}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Email:</p>
                          <a href={`mailto:${msg.email}`} className="text-brand-600 hover:underline">
                            {msg.email}
                          </a>
                        </div>
                        <div className="col-span-2">
                          <p className="text-gray-600">Received:</p>
                          <p className="font-medium text-gray-900">
                            {new Date(msg.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Pagination */}
        {meta && meta.lastPage > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {((meta.currentPage - 1) * meta.perPage) + 1} to{' '}
              {Math.min(meta.currentPage * meta.perPage, meta.total)} of {meta.total} messages
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1 || isLoading}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-sm text-gray-600">
                Page {meta.currentPage} of {meta.lastPage}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(meta.lastPage, p + 1))}
                disabled={currentPage === meta.lastPage || isLoading}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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