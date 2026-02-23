import React, { useState, useEffect } from 'react'
import { Ticket, Plus, Edit2, Trash2, X, ChevronLeft, ChevronRight } from 'lucide-react'
import {
  useGetTicketsQuery,
  useCreateTicketMutation,
  useUpdateTicketMutation,
  useDeleteTicketMutation,
} from '../../store/api/ticketsApi'
import type { MatchTicket, CreateTicketPayload, UpdateTicketPayload } from '../../store/api/ticketsApi'
import { useGetMatchesQuery } from '../../store/api/matchesApi'
import { useLazyGetMatchWithStadiumQuery } from '../../store/api/matchesApi'

function TicketForm({ ticket, mode, onClose, onSave, saving }: {
  ticket: MatchTicket | null; mode: 'create' | 'edit' | 'view'; onClose: () => void
  onSave: (d: CreateTicketPayload | UpdateTicketPayload) => Promise<void>; saving: boolean
}) {
  type LevelKey = 'price' | 'quantity' | 'low_quantity'

  const [match_id, setMatchId] = useState(String(ticket?.match.id || ''))
  const [levels, setLevels] = useState<{ stadium_level_id: number; name: string; price: string; quantity: string; low_quantity: string }[]>(
    ticket ? [{ stadium_level_id: ticket.stadium_level.id, name: ticket.stadium_level.name_en, price: String(ticket.stadium_level.price_raw || ticket.stadium_level.price), quantity: String(ticket.stadium_level.quantity), low_quantity: String(ticket.stadium_level.low_quantity) }] : []
  )
  const readOnly = mode === 'view'

  const { data: matchesData } = useGetMatchesQuery({ per_page: 100 })
  const [fetchMatchStadium, { isFetching: loadingLevels }] = useLazyGetMatchWithStadiumQuery()
  const matches = matchesData?.data.data || []

  useEffect(() => {
    if (match_id && mode === 'create') {
      fetchMatchStadium(Number(match_id)).then(res => {
        const lvls = res.data?.data.stadium?.levels || []
        setLevels(lvls.map((l: { id: number; name_en: string }) => ({ stadium_level_id: l.id, name: l.name_en, price: '', quantity: '', low_quantity: '' })))
      })
    }
  }, [match_id, fetchMatchStadium, mode])

  const setLevel = (i: number, k: LevelKey, v: string) =>
    setLevels(prev => prev.map((l, idx) => idx === i ? { ...l, [k]: v } : l))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (readOnly) return
    if (mode === 'create') {
      await onSave({ match_id: Number(match_id), levels: levels.map(l => ({ stadium_level_id: l.stadium_level_id, price: l.price, quantity: l.quantity, low_quantity: l.low_quantity })) } as CreateTicketPayload)
    } else if (ticket) {
      await onSave({ id: ticket.id, match_id: ticket.match.id, stadium_level_id: ticket.stadium_level.id, price: levels[0]?.price || '', quantity: levels[0]?.quantity || '', low_quantity: levels[0]?.low_quantity || '' } as UpdateTicketPayload)
    }
  }

  const matchLabel = (m: { id: number; first_team?: { name_en: string }; second_team?: { name_en: string }; match_datetime?: string }) =>
    `${m.first_team?.name_en || '?'} vs ${m.second_team?.name_en || '?'} — ${m.match_datetime?.slice(0, 10) || ''}`

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999] p-4">
      <div className="bg-[#111d2d] border border-[#1e3a52] rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-[#111d2d] border-b border-[#1e3a52] px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">{mode === 'create' ? 'Add Tickets' : mode === 'edit' ? 'Edit Ticket' : 'Ticket Details'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Match *</label>
            <select value={match_id} onChange={e => setMatchId(e.target.value)} disabled={readOnly || mode === 'edit'} required
              className="w-full px-3 py-2 bg-[#0a1929] border border-[#1e3a52] rounded-lg text-white focus:outline-none focus:border-[#00ff88] transition-colors">
              <option value="">Select match...</option>
              {matches.map(m => <option key={m.id} value={m.id}>{matchLabel(m)}</option>)}
            </select>
          </div>

          {loadingLevels && <div className="text-center text-gray-400 py-4">Loading stadium levels...</div>}

          {!loadingLevels && levels.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-[#00ff88]">Stadium Levels</h3>
              {levels.map((lvl, i) => (
                <div key={i} className="bg-[#0a1929] border border-[#1e3a52] rounded-lg p-4">
                  <p className="text-white font-medium mb-3">{lvl.name}</p>
                  <div className="grid grid-cols-3 gap-3">
                    {([['Price', 'price'], ['Quantity', 'quantity'], ['Low Stock', 'low_quantity']] as [string, LevelKey][]).map(([l, k]) => (
                      <div key={k}>
                        <label className="block text-xs font-medium text-gray-400 mb-1">{l} *</label>
                        <input type="number" value={lvl[k]} onChange={e => setLevel(i, k, e.target.value)} readOnly={readOnly} required min="0"
                          className="w-full px-2 py-1.5 bg-[#111d2d] border border-[#1e3a52] rounded text-white text-sm focus:outline-none focus:border-[#00ff88] transition-colors" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {!readOnly && (
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-[#1e3a52] text-gray-300 rounded-lg hover:bg-[#1e3a52] transition-colors">Cancel</button>
              <button type="submit" disabled={saving} className="flex-1 px-4 py-2 bg-[#00ff88] text-[#0a1929] font-semibold rounded-lg hover:bg-[#00dd77] disabled:opacity-60 transition-colors">{saving ? 'Saving...' : 'Save'}</button>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

export default function TicketsManagement() {
  const [page, setPage] = useState(1)
  const [modal, setModal] = useState<{ open: boolean; mode: 'create' | 'edit' | 'view'; ticket: MatchTicket | null }>({ open: false, mode: 'create', ticket: null })

  const { data, isLoading, isFetching, isError, refetch } = useGetTicketsQuery({ page, per_page: 10 })
  const [createTicket, { isLoading: creating }] = useCreateTicketMutation()
  const [updateTicket, { isLoading: updating }] = useUpdateTicketMutation()
  const [deleteTicket] = useDeleteTicketMutation()

  const tickets = data?.data.tickets || []
  const pagination = data?.data.pagination
  const lastPage = pagination?.last_page || 1
  const total = pagination?.total || 0

  const handleSave = async (payload: CreateTicketPayload | UpdateTicketPayload) => {
    try {
      if (modal.mode === 'create') await createTicket(payload as CreateTicketPayload).unwrap()
      else if (modal.ticket) await updateTicket(payload as UpdateTicketPayload).unwrap()
      setModal({ open: false, mode: 'create', ticket: null })
    } catch (err) { console.error(err) }
  }

  const handleDelete = async (t: MatchTicket) => {
    if (!confirm('Delete this ticket?')) return
    try { await deleteTicket(t.id).unwrap() } catch (err) { console.error(err) }
  }

  return (
    <div className="p-6 min-h-screen">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <Ticket className="w-8 h-8 text-[#00ff88]" />
          <h1 className="text-3xl font-bold text-white">Match Tickets</h1>
        </div>
        <p className="text-gray-400">Manage ticket pricing and availability</p>
      </div>

      <div className="bg-[#111d2d] border border-[#1e3a52] rounded-lg p-4 mb-4 flex justify-end">
        <button onClick={() => setModal({ open: true, mode: 'create', ticket: null })}
          className="flex items-center gap-2 px-4 py-2 bg-[#00ff88] text-[#0a1929] font-semibold rounded-lg hover:bg-[#00dd77] text-sm transition-colors">
          <Plus className="w-4 h-4" /> Add Tickets
        </button>
      </div>

      <div className="bg-[#111d2d] border border-[#1e3a52] rounded-lg overflow-hidden">
        {isError && <div className="p-8 text-center text-red-400">Failed to load. <button onClick={() => refetch()} className="underline">Retry</button></div>}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#0a1929] border-b border-[#1e3a52]">
              <tr>{['Match', 'Level', 'Price', 'Qty', 'Sold', 'Low Stock', 'Actions'].map(h => (
                <th key={h} className="px-4 py-3 text-left font-semibold text-gray-300">{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y divide-[#1e3a52]">
              {(isLoading || isFetching) && Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}><td colSpan={7} className="px-4 py-3"><div className="h-4 bg-[#1e3a52] rounded animate-pulse" /></td></tr>
              ))}
              {!isLoading && !isFetching && tickets.map(t => (
                <tr key={t.id} className="hover:bg-[#0a1929]/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-medium text-white text-sm">
                      {t.match.first_team?.name_en || '—'} <span className="text-[#00ff88]">vs</span> {t.match.second_team?.name_en || '—'}
                    </div>
                    <div className="text-xs text-gray-400">{t.match.match_datetime?.slice(0, 10)}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-300">{t.stadium_level.name_en}</td>
                  <td className="px-4 py-3 text-[#00ff88] font-medium">{t.stadium_level.price}</td>
                  <td className="px-4 py-3 text-gray-300">{t.stadium_level.quantity}</td>
                  <td className="px-4 py-3 text-gray-300">{t.stadium_level.sold_quantity}</td>
                  <td className="px-4 py-3 text-gray-300">{t.stadium_level.low_quantity}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => setModal({ open: true, mode: 'edit', ticket: t })} className="p-1.5 text-[#00ff88] hover:bg-[#00ff88]/10 rounded transition-colors"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(t)} className="p-1.5 text-red-400 hover:bg-red-400/10 rounded transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {!isLoading && !isFetching && tickets.length === 0 && !isError && (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-gray-400">No tickets found</td></tr>
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

      {modal.open && (
        <TicketForm ticket={modal.ticket} mode={modal.mode}
          onClose={() => setModal({ open: false, mode: 'create', ticket: null })}
          onSave={handleSave} saving={creating || updating} />
      )}
    </div>
  )
}
