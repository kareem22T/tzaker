import React, { useState } from 'react'
import { ClipboardList, Eye, CheckCircle, XCircle, Clock, X, ChevronLeft, ChevronRight } from 'lucide-react'
import {
  useGetBookingsQuery,
  useUpdateBookingStatusMutation,
} from '../../store/api/bookingApi'
import type { Booking } from '../../store/api/bookingApi'

function BookingDetailModal({ booking, onClose }: { booking: Booking; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[99999999] p-4">
      <div className="bg-[#111d2d] border border-[#1e3a52] rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-[#111d2d] border-b border-[#1e3a52] px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Booking #{booking.id}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 space-y-5">
          <div className="bg-[#0a1929] border border-[#1e3a52] rounded-lg p-4">
            <h3 className="text-sm font-semibold text-[#00ff88] mb-3">Customer</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-gray-400">Name:</span> <span className="text-white ml-1">{booking.customer?.name}</span></div>
              <div><span className="text-gray-400">Email:</span> <span className="text-white ml-1">{booking.customer?.email}</span></div>
              <div><span className="text-gray-400">Phone:</span> <span className="text-white ml-1">{booking.customer?.phone}</span></div>
              <div><span className="text-gray-400">Country:</span> <span className="text-white ml-1">{booking.customer?.country?.name_en}</span></div>
            </div>
          </div>
          <div className="bg-[#0a1929] border border-[#1e3a52] rounded-lg p-4">
            <h3 className="text-sm font-semibold text-[#00ff88] mb-3">Match</h3>
            <div className="text-sm space-y-1">
              <div className="text-white font-medium">{booking.match?.first_team?.name_en} vs {booking.match?.second_team?.name_en}</div>
              <div className="text-gray-400">{booking.match?.tournament?.name_en} · {booking.match?.stadium?.name_en}</div>
              <div className="text-gray-400">{booking.match?.match_datetime?.slice(0, 16)}</div>
            </div>
          </div>
          {booking.items && booking.items.length > 0 && (
            <div className="bg-[#0a1929] border border-[#1e3a52] rounded-lg p-4">
              <h3 className="text-sm font-semibold text-[#00ff88] mb-3">Items</h3>
              <table className="w-full text-sm">
                <thead><tr className="text-gray-400 text-xs"><th className="text-left pb-2">Level</th><th className="text-right pb-2">Qty</th><th className="text-right pb-2">Price</th><th className="text-right pb-2">Subtotal</th></tr></thead>
                <tbody className="divide-y divide-[#1e3a52]">
                  {booking.items.map((item, i) => (
                    <tr key={i}>
                      <td className="py-2 text-white">{item.level_name}</td>
                      <td className="py-2 text-right text-gray-300">{item.tickets_count}</td>
                      <td className="py-2 text-right text-gray-300">{item.price_per_ticket}</td>
                      <td className="py-2 text-right text-[#00ff88] font-medium">{item.subtotal}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-3 pt-3 border-t border-[#1e3a52] flex justify-between">
                <span className="text-gray-400">Total</span>
                <span className="text-[#00ff88] font-bold text-lg">{booking.total_amount}</span>
              </div>
            </div>
          )}
          {booking.rejection_reason && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-red-400 mb-1">Rejection Reason</h3>
              <p className="text-gray-300 text-sm">{booking.rejection_reason}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function RejectModal({ booking, onClose, onConfirm, saving }: { booking: Booking; onClose: () => void; onConfirm: (reason: string) => Promise<void>; saving: boolean }) {
  const [reason, setReason] = useState('')
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[99999999] p-4">
      <div className="bg-[#111d2d] border border-[#1e3a52] rounded-lg w-full max-w-md">
        <div className="px-6 py-4 border-b border-[#1e3a52] flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Reject Booking #{booking.id}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Rejection Reason</label>
            <textarea value={reason} onChange={e => setReason(e.target.value)} rows={4} placeholder="Provide a reason for rejection..."
              className="w-full px-3 py-2 bg-[#0a1929] border border-[#1e3a52] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#00ff88] transition-colors resize-none" />
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-[#1e3a52] text-gray-300 rounded-lg hover:bg-[#1e3a52] transition-colors">Cancel</button>
            <button type="button" disabled={saving} onClick={() => onConfirm(reason)}
              className="flex-1 px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 disabled:opacity-60 transition-colors">{saving ? 'Rejecting...' : 'Reject'}</button>
          </div>
        </div>
      </div>
    </div>
  )
}

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-yellow-500/20 text-yellow-400',
  approved: 'bg-green-500/20 text-green-400',
  rejected: 'bg-red-500/20 text-red-400',
}

export default function BookingRequestsManagement() {
  const [page, setPage] = useState(1)
  const [viewBooking, setViewBooking] = useState<Booking | null>(null)
  const [rejectBooking, setRejectBooking] = useState<Booking | null>(null)

  const { data, isLoading, isFetching, isError, refetch } = useGetBookingsQuery({ page, per_page: 10 })
  const [updateStatus, { isLoading: updating }] = useUpdateBookingStatusMutation()

  const bookings = data?.data.bookings || []
  const pagination = data?.data.pagination
  const stats = data?.data.statistics
  const lastPage = pagination?.last_page || 1
  const total = pagination?.total || 0

  const handleApprove = async (b: Booking) => {
    if (!confirm(`Approve booking #${b.id}?`)) return
    try { await updateStatus({ id: b.id, status: 'approved' }).unwrap() } catch (err) { console.error(err) }
  }

  const handleReject = async (reason: string) => {
    if (!rejectBooking) return
    try {
      await updateStatus({ id: rejectBooking.id, status: 'rejected', rejection_reason: reason }).unwrap()
      setRejectBooking(null)
    } catch (err) { console.error(err) }
  }

  return (
    <div className="p-6 min-h-screen">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <ClipboardList className="w-8 h-8 text-[#00ff88]" />
          <h1 className="text-3xl font-bold text-white">Booking Requests</h1>
        </div>
        <p className="text-gray-400">Manage ticket booking requests</p>
      </div>

      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total', value: stats.total_bookings, color: 'text-white', icon: ClipboardList },
            { label: 'Pending', value: stats.pending_bookings, color: 'text-yellow-400', icon: Clock },
            { label: 'Approved', value: stats.approved_bookings, color: 'text-green-400', icon: CheckCircle },
            { label: 'Rejected', value: stats.rejected_bookings, color: 'text-red-400', icon: XCircle },
          ].map(({ label, value, color, icon: Icon }) => (
            <div key={label} className="bg-[#111d2d] border border-[#1e3a52] rounded-lg p-4 flex items-center gap-3">
              <Icon className={`w-8 h-8 ${color}`} />
              <div>
                <p className="text-gray-400 text-xs">{label}</p>
                <p className={`text-2xl font-bold ${color}`}>{value}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="bg-[#111d2d] border border-[#1e3a52] rounded-lg overflow-hidden">
        {isError && <div className="p-8 text-center text-red-400">Failed to load. <button onClick={() => refetch()} className="underline">Retry</button></div>}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#0a1929] border-b border-[#1e3a52]">
              <tr>{['#', 'Customer', 'Match', 'Tickets', 'Total', 'Status', 'Date', 'Actions'].map(h => (
                <th key={h} className="px-4 py-3 text-left font-semibold text-gray-300">{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y divide-[#1e3a52]">
              {(isLoading || isFetching) && Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}><td colSpan={8} className="px-4 py-3"><div className="h-4 bg-[#1e3a52] rounded animate-pulse" /></td></tr>
              ))}
              {!isLoading && !isFetching && bookings.map(b => (
                <tr key={b.id} className="hover:bg-[#0a1929]/50 transition-colors">
                  <td className="px-4 py-3 text-gray-400 font-mono text-xs">#{b.id}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-white">{b.customer?.name}</div>
                    <div className="text-xs text-gray-400">{b.customer?.email}</div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="text-white">{b.match?.first_team?.name_en} <span className="text-[#00ff88]">vs</span> {b.match?.second_team?.name_en}</div>
                    <div className="text-xs text-gray-400">{b.match?.match_datetime?.slice(0, 10)}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-300">{b.tickets_count}</td>
                  <td className="px-4 py-3 text-[#00ff88] font-medium">{b.total_amount}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[b.status] || 'bg-gray-500/20 text-gray-400'}`}>{b.status}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{b.requested_at?.slice(0, 10)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => setViewBooking(b)} className="p-1.5 text-blue-400 hover:bg-blue-400/10 rounded transition-colors" title="View"><Eye className="w-4 h-4" /></button>
                      {b.status === 'pending' && (
                        <>
                          <button onClick={() => handleApprove(b)} disabled={updating} className="p-1.5 text-green-400 hover:bg-green-400/10 rounded disabled:opacity-50 transition-colors" title="Approve"><CheckCircle className="w-4 h-4" /></button>
                          <button onClick={() => setRejectBooking(b)} disabled={updating} className="p-1.5 text-red-400 hover:bg-red-400/10 rounded disabled:opacity-50 transition-colors" title="Reject"><XCircle className="w-4 h-4" /></button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {!isLoading && !isFetching && bookings.length === 0 && !isError && (
                <tr><td colSpan={8} className="px-4 py-12 text-center text-gray-400">No booking requests</td></tr>
              )}
            </tbody>
          </table>
        </div>
        {lastPage > 1 && (
          <div className="px-4 py-3 border-t border-[#1e3a52] flex items-center justify-between">
            <span className="text-sm text-gray-400">{total} total</span>
            <div className="flex items-center gap-2">
              <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="p-1.5 text-gray-400 hover:text-white disabled:opacity-30 transition-colors"><ChevronLeft className="w-4 h-4" /></button>
              <span className="text-sm text-gray-300">Page {page} of {lastPage}</span>
              <button disabled={page >= lastPage} onClick={() => setPage(p => p + 1)} className="p-1.5 text-gray-400 hover:text-white disabled:opacity-30 transition-colors"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
        )}
      </div>

      {viewBooking && <BookingDetailModal booking={viewBooking} onClose={() => setViewBooking(null)} />}
      {rejectBooking && <RejectModal booking={rejectBooking} onClose={() => setRejectBooking(null)} onConfirm={handleReject} saving={updating} />}
    </div>
  )
}
