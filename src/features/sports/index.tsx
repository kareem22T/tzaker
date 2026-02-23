import React, { useState } from 'react'
import { Trophy, Plus, Search, Edit2, Trash2, X, ChevronLeft, ChevronRight } from 'lucide-react'
import {
  useGetSportsQuery,
  useCreateSportMutation,
  useUpdateSportMutation,
  useDeleteSportMutation,
} from '../../store/api/sportsApi'
import type { Sport, CreateSportPayload, UpdateSportPayload } from '../../store/api/sportsApi'

//  Sport Form 

function SportForm({ sport, mode, onClose, onSave, saving }: {
  sport: Sport | null; mode: 'create' | 'edit' | 'view'; onClose: () => void
  onSave: (data: CreateSportPayload | UpdateSportPayload) => Promise<void>; saving: boolean
}) {
  const [name_en, setNameEn] = useState(sport?.name_en || '')
  const [name_ar, setNameAr] = useState(sport?.name_ar || '')
  const [desc_en, setDescEn] = useState(sport?.desc_en || '')
  const [desc_ar, setDescAr] = useState(sport?.desc_ar || '')
  const [image, setImage] = useState<File | null>(null)
  const [preview, setPreview] = useState(sport?.image || '')
  const readOnly = mode === 'view'

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) { setImage(f); setPreview(URL.createObjectURL(f)) }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (readOnly) return
    const base: CreateSportPayload = { name_en, name_ar, desc_en, desc_ar, ...(image ? { image } : {}) }
    if (mode === 'create') await onSave(base)
    else if (sport) await onSave({ ...base, id: sport.id } as UpdateSportPayload)
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[99999999] p-4">
      <div className="bg-[#111d2d] border border-[#1e3a52] rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-[#111d2d] border-b border-[#1e3a52] px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">
            {mode === 'create' ? 'Add Sport' : mode === 'edit' ? 'Edit Sport' : 'Sport Details'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {preview && <img src={preview} alt="preview" className="w-24 h-24 rounded-lg object-cover border border-[#1e3a52]" />}
          {!readOnly && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Image</label>
              <input type="file" accept="image/*" onChange={handleFile}
                className="w-full text-sm text-gray-300 file:mr-3 file:px-3 file:py-1.5 file:bg-[#1e3a52] file:text-white file:rounded file:border-0 file:text-sm" />
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[['Name (English)', name_en, setNameEn, true], ['Name (Arabic)', name_ar, setNameAr, true],
              ['Description (English)', desc_en, setDescEn, false], ['Description (Arabic)', desc_ar, setDescAr, false]].map(([label, val, setter, req]) => (
              <div key={label as string}>
                <label className="block text-sm font-medium text-gray-300 mb-1">{label as string}{req ? ' *' : ''}</label>
                <input value={val as string} onChange={e => (setter as React.Dispatch<React.SetStateAction<string>>)(e.target.value)}
                  readOnly={readOnly} required={req as boolean}
                  className="w-full px-3 py-2 bg-[#0a1929] border border-[#1e3a52] rounded-lg text-white focus:outline-none focus:border-[#00ff88] transition-colors" />
              </div>
            ))}
          </div>
          {!readOnly && (
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-[#1e3a52] text-gray-300 rounded-lg hover:bg-[#1e3a52] transition-colors">Cancel</button>
              <button type="submit" disabled={saving} className="flex-1 px-4 py-2 bg-[#00ff88] text-[#0a1929] font-semibold rounded-lg hover:bg-[#00dd77] disabled:opacity-60 transition-colors">
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

//  Main Component 

export default function SportsManagement() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [modal, setModal] = useState<{ open: boolean; mode: 'create' | 'edit' | 'view'; sport: Sport | null }>({ open: false, mode: 'create', sport: null })

  const { data, isLoading, isFetching, isError, refetch } = useGetSportsQuery({ page, per_page: 10, search })
  const [createSport, { isLoading: creating }] = useCreateSportMutation()
  const [updateSport, { isLoading: updating }] = useUpdateSportMutation()
  const [deleteSport] = useDeleteSportMutation()

  const sports = data?.data.data || []
  const lastPage = data?.data.last_page || 1
  const total = data?.data.total || 0

  const handleSave = async (payload: CreateSportPayload | UpdateSportPayload) => {
    try {
      if (modal.mode === 'create') await createSport(payload as CreateSportPayload).unwrap()
      else if (modal.sport) await updateSport(payload as UpdateSportPayload).unwrap()
      setModal({ open: false, mode: 'create', sport: null })
    } catch (err) { console.error(err) }
  }

  const handleDelete = async (s: Sport) => {
    if (!confirm(`Delete sport "${s.name_en}"?`)) return
    try { await deleteSport(s.id).unwrap() } catch (err) { console.error(err) }
  }

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); setSearch(searchInput); setPage(1) }

  return (
    <div className="p-6 min-h-screen">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <Trophy className="w-8 h-8 text-[#00ff88]" />
          <h1 className="text-3xl font-bold text-white">Sports</h1>
        </div>
        <p className="text-gray-400">Manage sport categories</p>
      </div>

      <div className="bg-[#111d2d] border border-[#1e3a52] rounded-lg p-4 mb-4 flex flex-col sm:flex-row gap-3">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input value={searchInput} onChange={e => setSearchInput(e.target.value)} placeholder="Search sports..."
              className="w-full pl-9 pr-3 py-2 bg-[#0a1929] border border-[#1e3a52] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#00ff88] text-sm transition-colors" />
          </div>
          <button type="submit" className="px-4 py-2 bg-[#1e3a52] text-white rounded-lg hover:bg-[#2a4a62] text-sm transition-colors">Search</button>
        </form>
        <button onClick={() => setModal({ open: true, mode: 'create', sport: null })}
          className="flex items-center gap-2 px-4 py-2 bg-[#00ff88] text-[#0a1929] font-semibold rounded-lg hover:bg-[#00dd77] text-sm transition-colors">
          <Plus className="w-4 h-4" /> Add Sport
        </button>
      </div>

      <div className="bg-[#111d2d] border border-[#1e3a52] rounded-lg overflow-hidden">
        {isError && <div className="p-8 text-center text-red-400">Failed to load. <button onClick={() => refetch()} className="underline">Retry</button></div>}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#0a1929] border-b border-[#1e3a52]">
              <tr>{['Image', 'Name (EN)', 'Name (AR)', 'Sort', 'Status', 'Actions'].map(h => (
                <th key={h} className="px-4 py-3 text-left font-semibold text-gray-300">{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y divide-[#1e3a52]">
              {(isLoading || isFetching) && Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}><td colSpan={6} className="px-4 py-3"><div className="h-4 bg-[#1e3a52] rounded animate-pulse" /></td></tr>
              ))}
              {!isLoading && !isFetching && sports.map(s => (
                <tr key={s.id} className="hover:bg-[#0a1929]/50 transition-colors">
                  <td className="px-4 py-3">
                    {s.image ? <img src={s.image} alt={s.name_en} className="w-10 h-10 rounded object-cover" /> : <div className="w-10 h-10 rounded bg-[#1e3a52]" />}
                  </td>
                  <td className="px-4 py-3 font-medium text-white">{s.name_en}</td>
                  <td className="px-4 py-3 text-gray-300">{s.name_ar}</td>
                  <td className="px-4 py-3 text-gray-300">{s.sort_order}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${s.status == 1 ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                      {s.status == 1 ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => setModal({ open: true, mode: 'edit', sport: s })} className="p-1.5 text-[#00ff88] hover:bg-[#00ff88]/10 rounded transition-colors"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(s)} className="p-1.5 text-red-400 hover:bg-red-400/10 rounded transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {!isLoading && !isFetching && sports.length === 0 && !isError && (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-gray-400">No sports found</td></tr>
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
        <SportForm sport={modal.sport} mode={modal.mode} onClose={() => setModal({ open: false, mode: 'create', sport: null })}
          onSave={handleSave} saving={creating || updating} />
      )}
    </div>
  )
}
