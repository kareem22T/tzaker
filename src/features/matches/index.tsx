import React, { useState } from 'react'
import { Calendar, Plus, Search, Edit2, Trash2, X, ChevronLeft, ChevronRight } from 'lucide-react'
import {
  useGetMatchesQuery,
  useCreateMatchMutation,
  useUpdateMatchMutation,
  useDeleteMatchMutation,
} from '../../store/api/matchesApi'
import type { Match, CreateMatchPayload, UpdateMatchPayload } from '../../store/api/matchesApi'
import { useGetClubsQuery } from '../../store/api/clubsApi'
import { useGetTournamentsQuery } from '../../store/api/tournamentsApi'
import { useGetStadiumsQuery } from '../../store/api/stadiumsApi'

function MatchForm({ match, mode, onClose, onSave, saving }: {
  match: Match | null; mode: 'create' | 'edit' | 'view'; onClose: () => void
  onSave: (d: CreateMatchPayload | UpdateMatchPayload) => Promise<void>; saving: boolean
}) {
  const [first_team_id, setFirstTeam] = useState(String(match?.first_team_id || ''))
  const [second_team_id, setSecondTeam] = useState(String(match?.second_team_id || ''))
  const [tournament_id, setTournament] = useState(String(match?.tournament_id || ''))
  const [stadium_id, setStadium] = useState(String(match?.stadium_id || ''))
  const [match_datetime, setDatetime] = useState(match?.match_datetime?.slice(0, 16) || '')
  const readOnly = mode === 'view'

  const { data: clubsData } = useGetClubsQuery({ per_page: 100 })
  const { data: tournamentsData } = useGetTournamentsQuery({ per_page: 100 })
  const { data: stadiumsData } = useGetStadiumsQuery({ per_page: 100 })

  const clubs = clubsData?.data.data || []
  const tournaments = tournamentsData?.data.data || []
  const stadiums = stadiumsData?.data.data || []

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (readOnly) return
    const formatted = match_datetime.replace('T', ' ') + ':00'
    const base: CreateMatchPayload = {
      first_team_id: Number(first_team_id), second_team_id: Number(second_team_id),
      tournament_id: Number(tournament_id), stadium_id: Number(stadium_id),
      match_datetime: formatted,
    }
    if (mode === 'create') await onSave(base)
    else if (match) await onSave({ ...base, id: match.id } as UpdateMatchPayload)
  }

  const sel = (label: string, value: string, setter: (v: string) => void, items: { id: number; name_en: string }[], req = false) => (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-1">{label}{req ? ' *' : ''}</label>
      <select value={value} onChange={e => setter(e.target.value)} disabled={readOnly} required={req}
        className="w-full px-3 py-2 bg-[#0a1929] border border-[#1e3a52] rounded-lg text-white focus:outline-none focus:border-[#00ff88] transition-colors">
        <option value="">Select...</option>
        {items.map(i => <option key={i.id} value={i.id}>{i.name_en}</option>)}
      </select>
    </div>
  )

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999] p-4">
      <div className="bg-[#111d2d] border border-[#1e3a52] rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-[#111d2d] border-b border-[#1e3a52] px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">{mode === 'create' ? 'Add Match' : mode === 'edit' ? 'Edit Match' : 'Match Details'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {sel('First Team *', first_team_id, setFirstTeam, clubs, true)}
            {sel('Second Team *', second_team_id, setSecondTeam, clubs, true)}
            {sel('Tournament *', tournament_id, setTournament, tournaments, true)}
            {sel('Stadium *', stadium_id, setStadium, stadiums, true)}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Match Date & Time *</label>
            <input type="datetime-local" value={match_datetime} onChange={e => setDatetime(e.target.value)} readOnly={readOnly} required
              className="w-full px-3 py-2 bg-[#0a1929] border border-[#1e3a52] rounded-lg text-white focus:outline-none focus:border-[#00ff88] transition-colors" />
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

export default function MatchesManagement() {
  const [page, setPage] = useState(1)
  const [modal, setModal] = useState<{ open: boolean; mode: 'create' | 'edit' | 'view'; match: Match | null }>({ open: false, mode: 'create', match: null })

  const { data, isLoading, isFetching, isError, refetch } = useGetMatchesQuery({ page, per_page: 10 })
  const [createMatch, { isLoading: creating }] = useCreateMatchMutation()
  const [updateMatch, { isLoading: updating }] = useUpdateMatchMutation()
  const [deleteMatch] = useDeleteMatchMutation()

  const matches = data?.data.data || []
  const lastPage = data?.data.last_page || 1
  const total = data?.data.total || 0

  const handleSave = async (payload: CreateMatchPayload | UpdateMatchPayload) => {
    try {
      if (modal.mode === 'create') await createMatch(payload as CreateMatchPayload).unwrap()
      else if (modal.match) await updateMatch(payload as UpdateMatchPayload).unwrap()
      setModal({ open: false, mode: 'create', match: null })
    } catch (err) { console.error(err) }
  }

  const handleDelete = async (m: Match) => {
    if (!confirm(`Delete match?`)) return
    try { await deleteMatch(m.id).unwrap() } catch (err) { console.error(err) }
  }

  return (
    <div className="p-6 min-h-screen">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <Calendar className="w-8 h-8 text-[#00ff88]" />
          <h1 className="text-3xl font-bold text-white">Matches</h1>
        </div>
        <p className="text-gray-400">Manage football matches</p>
      </div>

      <div className="bg-[#111d2d] border border-[#1e3a52] rounded-lg p-4 mb-4 flex justify-end">
        <button onClick={() => setModal({ open: true, mode: 'create', match: null })}
          className="flex items-center gap-2 px-4 py-2 bg-[#00ff88] text-[#0a1929] font-semibold rounded-lg hover:bg-[#00dd77] text-sm transition-colors">
          <Plus className="w-4 h-4" /> Add Match
        </button>
      </div>

      <div className="bg-[#111d2d] border border-[#1e3a52] rounded-lg overflow-hidden">
        {isError && <div className="p-8 text-center text-red-400">Failed to load. <button onClick={() => refetch()} className="underline">Retry</button></div>}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#0a1929] border-b border-[#1e3a52]">
              <tr>{['Match', 'Tournament', 'Stadium', 'Date & Time', 'Status', 'Actions'].map(h => (
                <th key={h} className="px-4 py-3 text-left font-semibold text-gray-300">{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y divide-[#1e3a52]">
              {(isLoading || isFetching) && Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}><td colSpan={6} className="px-4 py-3"><div className="h-4 bg-[#1e3a52] rounded animate-pulse" /></td></tr>
              ))}
              {!isLoading && !isFetching && matches.map(m => (
                <tr key={m.id} className="hover:bg-[#0a1929]/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-medium text-white text-sm">
                      {m.first_team?.name_en || '—'} <span className="text-[#00ff88]">vs</span> {m.second_team?.name_en || '—'}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-300">{m.tournament?.name_en || '—'}</td>
                  <td className="px-4 py-3 text-gray-300">{m.stadium?.name_en || '—'}</td>
                  <td className="px-4 py-3 text-gray-400">{m.match_datetime?.replace('T', ' ').slice(0, 16)}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${m.status === 'active' || m.status === 'upcoming' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                      {m.status || 'Scheduled'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => setModal({ open: true, mode: 'edit', match: m })} className="p-1.5 text-[#00ff88] hover:bg-[#00ff88]/10 rounded transition-colors"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(m)} className="p-1.5 text-red-400 hover:bg-red-400/10 rounded transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {!isLoading && !isFetching && matches.length === 0 && !isError && (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-gray-400">No matches found</td></tr>
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
        <MatchForm match={modal.match} mode={modal.mode}
          onClose={() => setModal({ open: false, mode: 'create', match: null })}
          onSave={handleSave} saving={creating || updating} />
      )}
    </div>
  )
}
