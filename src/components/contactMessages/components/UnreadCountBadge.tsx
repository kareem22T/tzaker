"use client"

import { useGetUnreadCountQuery } from "../../../store/api/contactMessagesApi"

export function UnreadCountBadge() {
  const { data: unreadCount, isLoading } = useGetUnreadCountQuery(undefined, {
    pollingInterval: 30000, // Poll every 30 seconds
  })

  if (isLoading || !unreadCount || unreadCount === 0) {
    return null
  }

  return (
    <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
      {unreadCount > 99 ? '99+' : unreadCount}
    </span>
  )
}