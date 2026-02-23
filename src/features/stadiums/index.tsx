import React, { useState } from 'react'
import { Building2, Plus, Search, Edit2, Trash2, X, ChevronLeft, ChevronRight } from 'lucide-react'
import {
  useGetStadiumsQuery,
  useCreateStadiumMutation,
  useUpdateStadiumMutation,
  useDeleteStadiumMutation,
} from '../../store/api/stadiumsApi'
import type { Stadium, StadiumLevelInput, CreateStadiumPayload, UpdateStadiumPayload } from '../../store/api/stadiumsApi'
import { useGetCountriesQuery, useLazyGetCitiesQuery } from '../../store/api/countriesApi'

const EMPTY_LEVEL = (): StadiumLevelInput => ({ name_en: '', name_ar: '', desc_en: '', desc_ar: '', seating_image: null })

function StadiumForm({ stadium, mode, onClose, onSave, saving }: {
  stadium: Stadium | null; mode: 'create' | 'edit' | 'view'; onClose: () => void
  onSave: (d: CreateStadiumPayload | UpdateStadiumPayload) => Promise<void>; saving: boolean
}) {
  const [name_en, setNameEn] = useState(stadium?.name_en || '')
  const [name_ar, setNameAr] = useState(stadium?.name_ar || '')
  const [capacity, setCapacity] = useState(String(stadium?.capacity || ''))
  const [country_id, setCountryId] = useState(String(stadium?.country_id || ''))
  const [city_id, setCityId] = useState(String(stadium?.city_id || ''))
  const [image, setImage] = useState<File | null>(null)
  const [preview, setPreview] = useState(stadium?.image || '')
  const [levels, setLevels] = useState<StadiumLevelInput[]>(
    stadium?.levels?.length ? stadium.levels.map(l => ({ id: l.id, name_en: l.name_en, name_ar: l.name_ar, desc_en: l.desc_en || '', desc_ar: l.desc_ar || '', seating_image: null })) : [EMPTY_LEVEL()]
  )
  const readOnly = mode === 'view'

  const { data: countriesRes } = useGetCountriesQuery()
  const [fetchCities, { data: citiesRes }] = useLazyGetCitiesQuery()
  React.useEffect(() => { if (country_id) fetchCities(Number(country_id)) }, [country_id])

  const countries = countriesRes?.data || []
  const cities = citiesRes?.data || []

  const setLevel = (i: number, k: keyof StadiumLevelInput, v: string | File | null) =>
    setLevels(prev => prev.map((l, idx) => idx === i ? { ...l, [k]: v } : l))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (readOnly) return
    const base: CreateStadiumPayload = { name_en, name_ar, capacity, country_id: Number(country_id), city_id: Number(city_id), image, levels }
    if (mode === 'create') await onSave(base)
    else if (stadium) await onSave({ ...base, id: stadium.id } as UpdateStadiumPayload)
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999] p-4">
      <div className="bg-[#111d2d] border border-[#1e3a52] rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-[#111d2d] border-b border-[#1e3a52] px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">{mode === 'create' ? 'Add Stadium' : mode === 'edit' ? 'Edit Stadium' : 'Stadium Details'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[['Name (EN)', name_en, setNameEn], ['Name (AR)', name_ar, setNameAr]].map(([l, v, s]) => (
              <div key={l as string}>
                <label className="block text-sm font-medium text-gray-300 mb-1">{l as string} *</label>
                <input value={v as string} onChange={e => (s as React.Dispatch<React.SetStateAction<string>>)(e.target.value)} readOnly={readOnly} required
                  className="w-full px-3 py-2 bg-[#0a1929] border border-[#1e3a52] rounded-lg text-white focus:outline-none focus:border-[#00ff88] transition-colors" />
              </div>
            ))}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Capacity</label>
              <input value={capacity} onChange={e => setCapacity(e.target.value)} readOnly={readOnly} type="number"
                className="w-full px-3 py-2 bg-[#0a1929] border border-[#1e3a52] rounded-lg text-white focus:outline-none focus:border-[#00ff88] transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Country</label>
              <select value={country_id} onChange={e => setCountryId(e.target.value)} disabled={readOnly}
                className="w-full px-3 py-2 bg-[#0a1929] border border-[#1e3a52] rounded-lg text-white focus:outline-none focus:border-[#00ff88] transition-colors">
                <option value="">Select country</option>
                {countries.map(c => <option key={c.id} value={c.id}>{c.name_en}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">City</label>
              <select value={city_id} onChange={e => setCityId(e.target.value)} disabled={readOnly}
                className="w-full px-3 py-2 bg-[#0a1929] border border-[#1e3a52] rounded-lg text-white focus:outline-none focus:border-[#00ff88] transition-colors">
                <option value="">Select city</option>
                {cities.map(c => <option key={c.id} value={c.id}>{c.name_en}</option>)}
              </select>
            </div>
          </div>
          {!readOnly && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Stadium Image</label>
              {preview && <img src={preview} alt="preview" className="w-20 h-20 rounded object-cover border border-[#1e3a52] mb-2" />}
              <input type="file" accept="image/*" onChange={e => { const f = e.target.files?.[0]; if (f) { setImage(f); setPreview(URL.createObjectURL(f)) } }}
                className="w-full text-sm text-gray-300 file:mr-3 file:px-3 file:py-1.5 file:bg-[#1e3a52] file:text-white file:rounded file:border-0 file:text-sm" />
            </div>
          )}

          {/* Levels */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-semibold text-[#00ff88]">Stadium Levels</h3>
              {!readOnly && <button type="button" onClick={() => setLevels(p => [...p, EMPTY_LEVEL()])}
                className="px-3 py-1 text-xs bg-[#1e3a52] text-white rounded hover:bg-[#2a4a62] transition-colors">+ Add Level</button>}
            </div>
            <div className="space-y-4">
              {levels.map((lvl, i) => (
                <div key={i} className="bg-[#0a1929] border border-[#1e3a52] rounded-lg p-4 relative">
                  {!readOnly && levels.length > 1 && (
                    <button type="button" onClick={() => setLevels(p => p.filter((_, idx) => idx !== i))}
                      className="absolute top-3 right-3 text-red-400 hover:text-red-300 transition-colors"><X className="w-4 h-4" /></button>
                  )}
                  <div className="grid grid-cols-2 gap-3">
                    {[['Name (EN)', 'name_en'], ['Name (AR)', 'name_ar'], ['Desc (EN)', 'desc_en'], ['Desc (AR)', 'desc_ar']].map(([l, k]) => (
                      <div key={k}>
                        <label className="block text-xs font-medium text-gray-400 mb-1">{l}</label>
                        <input value={(lvl[k as keyof StadiumLevelInput] as string) || ''} onChange={e => setLevel(i, k as keyof StadiumLevelInput, e.target.value)} readOnly={readOnly}
                          className="w-full px-2 py-1.5 bg-[#111d2d] border border-[#1e3a52] rounded text-white text-sm focus:outline-none focus:border-[#00ff88] transition-colors" />
                      </div>
                    ))}
                  </div>
                  {!readOnly && (
                    <div className="mt-3">
                      <label className="block text-xs font-medium text-gray-400 mb-1">Seating Image</label>
                      <input type="file" accept="image/*" onChange={e => { const f = e.target.files?.[0]; if (f) setLevel(i, 'seating_image', f) }}
                        className="w-full text-xs text-gray-300 file:mr-2 file:px-2 file:py-1 file:bg-[#1e3a52] file:text-white file:rounded file:border-0 file:text-xs" />
                    </div>
                  )}
                </div>
              ))}
            </div>
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

export default function StadiumsManagement() {
  const [page, setPage] = useState(1)
  const [modal, setModal] = useState<{ open: boolean; mode: 'create' | 'edit' | 'view'; stadium: Stadium | null }>({ open: false, mode: 'create', stadium: null })

  const { data, isLoading, isFetching, isError, refetch } = useGetStadiumsQuery({ page, per_page: 10 })
  const [createStadium, { isLoading: creating }] = useCreateStadiumMutation()
  const [updateStadium, { isLoading: updating }] = useUpdateStadiumMutation()
  const [deleteStadium] = useDeleteStadiumMutation()

  const stadiums = data?.data.data || []
  const lastPage = data?.data.last_page || 1
  const total = data?.data.total || 0

  const handleSave = async (payload: CreateStadiumPayload | UpdateStadiumPayload) => {
    try {
      if (modal.mode === 'create') await createStadium(payload as CreateStadiumPayload).unwrap()
      else if (modal.stadium) await updateStadium(payload as UpdateStadiumPayload).unwrap()
      setModal({ open: false, mode: 'create', stadium: null })
    } catch (err) { console.error(err) }
  }

  const handleDelete = async (s: Stadium) => {
    if (!confirm(`Delete stadium "${s.name_en}"?`)) return
    try { await deleteStadium(s.id).unwrap() } catch (err) { console.error(err) }
  }

  return (
    <div className="p-6 min-h-screen">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <Building2 className="w-8 h-8 text-[#00ff88]" />
          <h1 className="text-3xl font-bold text-white">Stadiums</h1>
        </div>
        <p className="text-gray-400">Manage stadiums and their seating levels</p>
      </div>

      <div className="bg-[#111d2d] border border-[#1e3a52] rounded-lg p-4 mb-4 flex justify-end">
        <button onClick={() => setModal({ open: true, mode: 'create', stadium: null })}
          className="flex items-center gap-2 px-4 py-2 bg-[#00ff88] text-[#0a1929] font-semibold rounded-lg hover:bg-[#00dd77] text-sm transition-colors">
          <Plus className="w-4 h-4" /> Add Stadium
        </button>
      </div>

      <div className="bg-[#111d2d] border border-[#1e3a52] rounded-lg overflow-hidden">
        {isError && <div className="p-8 text-center text-red-400">Failed to load. <button onClick={() => refetch()} className="underline">Retry</button></div>}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#0a1929] border-b border-[#1e3a52]">
              <tr>{['Image', 'Name (EN)', 'Name (AR)', 'Capacity', 'Country', 'City', 'Levels', 'Actions'].map(h => (
                <th key={h} className="px-4 py-3 text-left font-semibold text-gray-300">{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y divide-[#1e3a52]">
              {(isLoading || isFetching) && Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}><td colSpan={8} className="px-4 py-3"><div className="h-4 bg-[#1e3a52] rounded animate-pulse" /></td></tr>
              ))}
              {!isLoading && !isFetching && stadiums.map(s => (
                <tr key={s.id} className="hover:bg-[#0a1929]/50 transition-colors">
                  <td className="px-4 py-3">
                    {s.image ? <img src={s.image} alt={s.name_en} className="w-10 h-10 rounded object-cover" /> : <div className="w-10 h-10 rounded bg-[#1e3a52]" />}
                  </td>
                  <td className="px-4 py-3 font-medium text-white">{s.name_en}</td>
                  <td className="px-4 py-3 text-gray-300">{s.name_ar}</td>
                  <td className="px-4 py-3 text-gray-300">{s.capacity?.toLocaleString()}</td>
                  <td className="px-4 py-3 text-gray-300">{s.country?.name_en || '—'}</td>
                  <td className="px-4 py-3 text-gray-300">{s.city?.name_en || '—'}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded-full text-xs font-medium">{s.levels?.length || 0}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => setModal({ open: true, mode: 'edit', stadium: s })} className="p-1.5 text-[#00ff88] hover:bg-[#00ff88]/10 rounded transition-colors"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(s)} className="p-1.5 text-red-400 hover:bg-red-400/10 rounded transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {!isLoading && !isFetching && stadiums.length === 0 && !isError && (
                <tr><td colSpan={8} className="px-4 py-12 text-center text-gray-400">No stadiums found</td></tr>
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
        <StadiumForm stadium={modal.stadium} mode={modal.mode}
          onClose={() => setModal({ open: false, mode: 'create', stadium: null })}
          onSave={handleSave} saving={creating || updating} />
      )}
    </div>
  )
}
