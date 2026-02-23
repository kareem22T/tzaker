import React, { useState } from 'react'
import { Trophy, Plus, Search, Edit2, Trash2, X, ChevronLeft, ChevronRight } from 'lucide-react'
import {
  useGetTournamentsQuery,
  useCreateTournamentMutation,
  useUpdateTournamentMutation,
  useDeleteTournamentMutation,
} from '../../store/api/tournamentsApi'
import type { Tournament, CreateTournamentPayload, UpdateTournamentPayload } from '../../store/api/tournamentsApi'

function TournamentForm({ tournament, mode, onClose, onSave, saving }: {
  tournament: Tournament | null; mode: 'create' | 'edit' | 'view'; onClose: () => void
  onSave: (d: CreateTournamentPayload | UpdateTournamentPayload) => Promise<void>; saving: boolean
}) {
  const [name_en, setNameEn] = useState(tournament?.name_en || '')
  const [name_ar, setNameAr] = useState(tournament?.name_ar || '')
  const [description_en, setDescEn] = useState(tournament?.description_en || '')
  const [description_ar, setDescAr] = useState(tournament?.description_ar || '')
  const readOnly = mode === 'view'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (readOnly) return
    const base = { name_en, name_ar, description_en, description_ar }
    if (mode === 'create') await onSave(base as CreateTournamentPayload)
    else if (tournament) await onSave({ ...base, id: tournament.id } as UpdateTournamentPayload)
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999] p-4">
      <div className="bg-[#111d2d] border border-[#1e3a52] rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-[#111d2d] border-b border-[#1e3a52] px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">
            {mode === 'create' ? 'Add Tournament' : mode === 'edit' ? 'Edit Tournament' : 'Tournament Details'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {([['Name (English)', name_en, setNameEn, true], ['Name (Arabic)', name_ar, setNameAr, true],
              ['Description (English)', description_en, setDescEn, false], ['Description (Arabic)', description_ar, setDescAr, false]
            ] as [string, string, React.Dispatch<React.SetStateAction<string>>, boolean][]).map(([label, val, setter, req]) => (
              <div key={label}>
                <label className="block text-sm font-medium text-gray-300 mb-1">{label}{req ? ' *' : ''}</label>
                <input value={val} onChange={e => setter(e.target.value)} readOnly={readOnly} required={req}
                  className="w-full px-3 py-2 bg-[#0a1929] border border-[#1e3a52] rounded-lg text-white focus:outline-none focus:border-[#00ff88] transition-colors" />
              </div>
            ))}
          </div>
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

export default function TournamentsManagement() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [modal, setModal] = useState<{ open: boolean; mode: 'create' | 'edit' | 'view'; tournament: Tournament | null }>({ open: false, mode: 'create', tournament: null })

  const { data, isLoading, isFetching, isError, refetch } = useGetTournamentsQuery({ page, per_page: 10, search })
  const [createTournament, { isLoading: creating }] = useCreateTournamentMutation()
  const [updateTournament, { isLoading: updating }] = useUpdateTournamentMutation()
  const [deleteTournament] = useDeleteTournamentMutation()

  const tournaments = data?.data.data || []
  const lastPage = data?.data.last_page || 1
  const total = data?.data.total || 0

  const handleSave = async (payload: CreateTournamentPayload | UpdateTournamentPayload) => {
    try {
      if (modal.mode === 'create') await createTournament(payload as CreateTournamentPayload).unwrap()
      else if (modal.tournament) await updateTournament(payload as UpdateTournamentPayload).unwrap()
      setModal({ open: false, mode: 'create', tournament: null })
    } catch (err) { console.error(err) }
  }

  const handleDelete = async (t: Tournament) => {
    if (!confirm(`Delete tournament "${t.name_en}"?`)) return
    try { await deleteTournament(t.id).unwrap() } catch (err) { console.error(err) }
  }

  return (
    <div className="p-6 min-h-screen">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <Trophy className="w-8 h-8 text-[#00ff88]" />
          <h1 className="text-3xl font-bold text-white">Tournaments</h1>
        </div>
        <p className="text-gray-400">Manage tournaments</p>
      </div>

      <div className="bg-[#111d2d] border border-[#1e3a52] rounded-lg p-4 mb-4 flex flex-col sm:flex-row gap-3">
        <form onSubmit={e => { e.preventDefault(); setSearch(searchInput); setPage(1) }} className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input value={searchInput} onChange={e => setSearchInput(e.target.value)} placeholder="Search tournaments..."
              className="w-full pl-9 pr-3 py-2 bg-[#0a1929] border border-[#1e3a52] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#00ff88] text-sm transition-colors" />
          </div>
          <button type="submit" className="px-4 py-2 bg-[#1e3a52] text-white rounded-lg hover:bg-[#2a4a62] text-sm transition-colors">Search</button>
        </form>
        <button onClick={() => setModal({ open: true, mode: 'create', tournament: null })}
          className="flex items-center gap-2 px-4 py-2 bg-[#00ff88] text-[#0a1929] font-semibold rounded-lg hover:bg-[#00dd77] text-sm transition-colors">
          <Plus className="w-4 h-4" /> Add Tournament
        </button>
      </div>

      <div className="bg-[#111d2d] border border-[#1e3a52] rounded-lg overflow-hidden">
        {isError && <div className="p-8 text-center text-red-400">Failed to load. <button onClick={() => refetch()} className="underline">Retry</button></div>}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#0a1929] border-b border-[#1e3a52]">
              <tr>{['Name (EN)', 'Name (AR)', 'Description', 'Status', 'Created', 'Actions'].map(h => (
                <th key={h} className="px-4 py-3 text-left font-semibold text-gray-300">{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y divide-[#1e3a52]">
              {(isLoading || isFetching) && Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}><td colSpan={6} className="px-4 py-3"><div className="h-4 bg-[#1e3a52] rounded animate-pulse" /></td></tr>
              ))}
              {!isLoading && !isFetching && tournaments.map(t => (
                <tr key={t.id} className="hover:bg-[#0a1929]/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-white">{t.name_en}</td>
                  <td className="px-4 py-3 text-gray-300">{t.name_ar}</td>
                  <td className="px-4 py-3 text-gray-400 max-w-xs truncate">{t.description_en}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${t.status == 1 || t.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                      {t.status == 1 || t.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400">{t.created_at?.slice(0, 10)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => setModal({ open: true, mode: 'edit', tournament: t })} className="p-1.5 text-[#00ff88] hover:bg-[#00ff88]/10 rounded transition-colors"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(t)} className="p-1.5 text-red-400 hover:bg-red-400/10 rounded transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {!isLoading && !isFetching && tournaments.length === 0 && !isError && (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-gray-400">No tournaments found</td></tr>
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
        <TournamentForm tournament={modal.tournament} mode={modal.mode}
          onClose={() => setModal({ open: false, mode: 'create', tournament: null })}
          onSave={handleSave} saving={creating || updating} />
      )}
    </div>
  )
}
