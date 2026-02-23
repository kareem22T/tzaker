import React, { useState } from 'react'
import { Users, Plus, Search, Eye, Edit2, Trash2, X, ChevronLeft, ChevronRight } from 'lucide-react'
import {
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} from '../../store/api/usersApi'
import type { User, CreateUserPayload, UpdateUserPayload } from '../../store/api/usersApi'
import { useGetCountriesQuery, useLazyGetCitiesQuery } from '../../store/api/countriesApi'

// ── User Form ─────────────────────────────────────────────────────────────────

type UserFormState = {
  full_name: string; phone: string; email: string; password: string
  gender: string; dob: string; nationality_id: string; country_id: string; city_id: string
  passport_number: string; passport_expiration_date: string
  has_valid_visa: string; visa_type: string; visa_expiration_date: string
}

const EMPTY_FORM: UserFormState = {
  full_name: '', phone: '', email: '', password: '',
  gender: 'male', dob: '', nationality_id: '', country_id: '', city_id: '',
  passport_number: '', passport_expiration_date: '',
  has_valid_visa: '0', visa_type: '', visa_expiration_date: '',
}

function UserForm({ user, mode, onClose, onSave, saving }: {
  user: User | null; mode: 'create' | 'edit' | 'view'; onClose: () => void
  onSave: (data: CreateUserPayload | UpdateUserPayload) => Promise<void>; saving: boolean
}) {
  const [form, setForm] = useState<UserFormState>(
    user ? {
      full_name: user.full_name, phone: user.phone, email: user.email, password: '',
      gender: user.gender, dob: user.dob,
      nationality_id: String(user.nationality_id), country_id: String(user.country_id), city_id: String(user.city_id),
      passport_number: user.passport_number, passport_expiration_date: user.passport_expiration_date,
      has_valid_visa: String(user.has_valid_visa), visa_type: user.visa_type || '', visa_expiration_date: user.visa_expiration_date || '',
    } : EMPTY_FORM
  )

  const { data: countriesRes } = useGetCountriesQuery()
  const [fetchCities, { data: citiesRes }] = useLazyGetCitiesQuery()

  React.useEffect(() => {
    if (form.country_id) fetchCities(Number(form.country_id))
  }, [form.country_id])

  const set = (k: keyof UserFormState, v: string) => setForm(p => ({ ...p, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (mode === 'view') return
    const base = {
      full_name: form.full_name, phone: form.phone, email: form.email,
      gender: form.gender, dob: form.dob,
      nationality_id: Number(form.nationality_id), country_id: Number(form.country_id), city_id: Number(form.city_id),
      passport_number: form.passport_number, passport_expiration_date: form.passport_expiration_date,
      has_valid_visa: Number(form.has_valid_visa),
      ...(form.has_valid_visa === '1' ? { visa_type: form.visa_type, visa_expiration_date: form.visa_expiration_date } : {}),
    }
    if (mode === 'create') await onSave({ ...base, password: form.password } as CreateUserPayload)
    else if (user) await onSave({ ...base, id: user.id } as UpdateUserPayload)
  }

  const countries = countriesRes?.data || []
  const cities = citiesRes?.data || []
  const readOnly = mode === 'view'

  const inp = (label: string, key: keyof UserFormState, type = 'text', required = false) => (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-1">{label}{required && ' *'}</label>
      <input type={type} value={form[key] as string} onChange={e => set(key, e.target.value)}
        readOnly={readOnly} required={required}
        className="w-full px-3 py-2 bg-[#0a1929] border border-[#1e3a52] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#00ff88] disabled:opacity-60 transition-colors"
      />
    </div>
  )

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[999999999] p-4">
      <div className="bg-[#111d2d] border border-[#1e3a52] rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-[#111d2d] border-b border-[#1e3a52] px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">
            {mode === 'create' ? 'Add User' : mode === 'edit' ? 'Edit User' : 'User Details'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {inp('Full Name', 'full_name', 'text', true)}
            {inp('Email', 'email', 'email', true)}
            {inp('Phone', 'phone')}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Gender</label>
              <select value={form.gender} onChange={e => set('gender', e.target.value)} disabled={readOnly}
                className="w-full px-3 py-2 bg-[#0a1929] border border-[#1e3a52] rounded-lg text-white focus:outline-none focus:border-[#00ff88] transition-colors">
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            {inp('Date of Birth', 'dob', 'date')}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Nationality</label>
              <select value={form.nationality_id} onChange={e => set('nationality_id', e.target.value)} disabled={readOnly}
                className="w-full px-3 py-2 bg-[#0a1929] border border-[#1e3a52] rounded-lg text-white focus:outline-none focus:border-[#00ff88] transition-colors">
                <option value="">Select nationality</option>
                {countries.map(c => <option key={c.id} value={c.id}>{c.name_en}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Country</label>
              <select value={form.country_id} onChange={e => set('country_id', e.target.value)} disabled={readOnly}
                className="w-full px-3 py-2 bg-[#0a1929] border border-[#1e3a52] rounded-lg text-white focus:outline-none focus:border-[#00ff88] transition-colors">
                <option value="">Select country</option>
                {countries.map(c => <option key={c.id} value={c.id}>{c.name_en}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">City</label>
              <select value={form.city_id} onChange={e => set('city_id', e.target.value)} disabled={readOnly}
                className="w-full px-3 py-2 bg-[#0a1929] border border-[#1e3a52] rounded-lg text-white focus:outline-none focus:border-[#00ff88] transition-colors">
                <option value="">Select city</option>
                {cities.map(c => <option key={c.id} value={c.id}>{c.name_en}</option>)}
              </select>
            </div>
            {inp('Passport Number', 'passport_number')}
            {inp('Passport Expiry', 'passport_expiration_date', 'date')}
            {mode === 'create' && inp('Password', 'password', 'password', true)}
          </div>
          <div className="flex items-center gap-3 pt-1">
            <label className="text-sm font-medium text-gray-300">Has Valid Visa</label>
            <button type="button" onClick={() => !readOnly && set('has_valid_visa', form.has_valid_visa === '1' ? '0' : '1')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.has_valid_visa === '1' ? 'bg-[#00ff88]' : 'bg-gray-600'}`}>
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${form.has_valid_visa === '1' ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
          {form.has_valid_visa === '1' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {inp('Visa Type', 'visa_type')}
              {inp('Visa Expiry', 'visa_expiration_date', 'date')}
            </div>
          )}
          {!readOnly && (
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose}
                className="flex-1 px-4 py-2 border border-[#1e3a52] text-gray-300 rounded-lg hover:bg-[#1e3a52] transition-colors">
                Cancel
              </button>
              <button type="submit" disabled={saving}
                className="flex-1 px-4 py-2 bg-[#00ff88] text-[#0a1929] font-semibold rounded-lg hover:bg-[#00dd77] disabled:opacity-60 transition-colors">
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function UsersManagement() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [modal, setModal] = useState<{ open: boolean; mode: 'create' | 'edit' | 'view'; user: User | null }>({ open: false, mode: 'create', user: null })

  const { data, isLoading, isFetching, isError, refetch } = useGetUsersQuery({ page, per_page: 10, search })
  const [createUser, { isLoading: creating }] = useCreateUserMutation()
  const [updateUser, { isLoading: updating }] = useUpdateUserMutation()
  const [deleteUser] = useDeleteUserMutation()

  const users = data?.data.data || []
  const lastPage = data?.data.last_page || 1
  const total = data?.data.total || 0

  const openCreate = () => setModal({ open: true, mode: 'create', user: null })
  const openEdit = (u: User) => setModal({ open: true, mode: 'edit', user: u })
  const openView = (u: User) => setModal({ open: true, mode: 'view', user: u })
  const closeModal = () => setModal({ open: false, mode: 'create', user: null })

  const handleSave = async (payload: CreateUserPayload | UpdateUserPayload) => {
    try {
      if (modal.mode === 'create') await createUser(payload as CreateUserPayload).unwrap()
      else if (modal.user) await updateUser(payload as UpdateUserPayload).unwrap()
      closeModal()
    } catch (err) { console.error(err) }
  }

  const handleDelete = async (u: User) => {
    if (!confirm(`Delete user "${u.full_name}"?`)) return
    try { await deleteUser(u.id).unwrap() } catch (err) { console.error(err) }
  }

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); setSearch(searchInput); setPage(1) }

  return (
    <div className="p-6 min-h-screen">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <Users className="w-8 h-8 text-[#00ff88]" />
          <h1 className="text-3xl font-bold text-white">Users</h1>
        </div>
        <p className="text-gray-400">Manage registered users</p>
      </div>

      <div className="bg-[#111d2d] border border-[#1e3a52] rounded-lg p-4 mb-4 flex flex-col sm:flex-row gap-3">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input value={searchInput} onChange={e => setSearchInput(e.target.value)}
              placeholder="Search users..." className="w-full pl-9 pr-3 py-2 bg-[#0a1929] border border-[#1e3a52] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#00ff88] text-sm transition-colors" />
          </div>
          <button type="submit" className="px-4 py-2 bg-[#1e3a52] text-white rounded-lg hover:bg-[#2a4a62] text-sm transition-colors">Search</button>
        </form>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-[#00ff88] text-[#0a1929] font-semibold rounded-lg hover:bg-[#00dd77] text-sm transition-colors">
          <Plus className="w-4 h-4" /> Add User
        </button>
      </div>

      <div className="bg-[#111d2d] border border-[#1e3a52] rounded-lg overflow-hidden">
        {isError && (
          <div className="p-8 text-center text-red-400">Failed to load users. <button onClick={() => refetch()} className="underline">Retry</button></div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#0a1929] border-b border-[#1e3a52]">
              <tr>
                {['Name', 'Email', 'Phone', 'Gender', 'Country', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-semibold text-gray-300">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e3a52]">
              {(isLoading || isFetching) && Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}><td colSpan={7} className="px-4 py-3"><div className="h-4 bg-[#1e3a52] rounded animate-pulse" /></td></tr>
              ))}
              {!isLoading && !isFetching && users.map(u => (
                <tr key={u.id} className="hover:bg-[#0a1929]/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-white">{u.full_name}</td>
                  <td className="px-4 py-3 text-gray-300">{u.email}</td>
                  <td className="px-4 py-3 text-gray-300">{u.phone}</td>
                  <td className="px-4 py-3 text-gray-300 capitalize">{u.gender}</td>
                  <td className="px-4 py-3 text-gray-300">{u.country?.name_en || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${u.status == 1 || u.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                      {u.status == 1 || u.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openView(u)} className="p-1.5 text-blue-400 hover:bg-blue-400/10 rounded transition-colors"><Eye className="w-4 h-4" /></button>
                      <button onClick={() => openEdit(u)} className="p-1.5 text-[#00ff88] hover:bg-[#00ff88]/10 rounded transition-colors"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(u)} className="p-1.5 text-red-400 hover:bg-red-400/10 rounded transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {!isLoading && !isFetching && users.length === 0 && !isError && (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-gray-400">No users found</td></tr>
              )}
            </tbody>
          </table>
        </div>
        {lastPage > 1 && (
          <div className="px-4 py-3 border-t border-[#1e3a52] flex items-center justify-between">
            <span className="text-sm text-gray-400">{total} total users</span>
            <div className="flex items-center gap-2">
              <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}
                className="p-1.5 text-gray-400 hover:text-white disabled:opacity-30 transition-colors"><ChevronLeft className="w-4 h-4" /></button>
              <span className="text-sm text-gray-300">Page {page} of {lastPage}</span>
              <button disabled={page >= lastPage} onClick={() => setPage(p => p + 1)}
                className="p-1.5 text-gray-400 hover:text-white disabled:opacity-30 transition-colors"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
        )}
      </div>

      {modal.open && (
        <UserForm user={modal.user} mode={modal.mode} onClose={closeModal}
          onSave={handleSave} saving={creating || updating} />
      )}
    </div>
  )
}
