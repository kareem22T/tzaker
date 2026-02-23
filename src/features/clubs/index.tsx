import React, { useState } from 'react';
import { Shield, Plus, Search, Eye, Edit2, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  useGetClubsQuery,
  useCreateClubMutation,
  useUpdateClubMutation,
  useDeleteClubMutation,
  type Club,
  type CreateClubPayload,
  type UpdateClubPayload,
} from '../../store/api/clubsApi';


import ClubModal from './ClubModal';

// modal types
type ModalMode = 'view' | 'create' | 'edit';

// deprecated local modal removed — use `ClubModal` component


const PER_PAGE = 10;

export default function ClubsManagement() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [modalState, setModalState] = useState<{ open: boolean; mode: ModalMode; club: Club | null }>({
    open: false, mode: 'view', club: null,
  });

  const { data, isLoading, isError, refetch } = useGetClubsQuery({ page, per_page: PER_PAGE, search });
  const [createClub, { isLoading: creating }] = useCreateClubMutation();
  const [updateClub, { isLoading: updating }] = useUpdateClubMutation();
  const [deleteClub] = useDeleteClubMutation();

  const clubs = data?.data?.data ?? [];
  const meta = data?.data;
  const totalPages = meta?.last_page ?? 1;
  const total = meta?.total ?? 0;
  const from = meta?.from ?? 0;
  const to = meta?.to ?? 0;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const handleSave = async (payload: CreateClubPayload | UpdateClubPayload) => {
    try {
      if (modalState.mode === 'create') {
        await createClub(payload as CreateClubPayload).unwrap();
      } else if (modalState.mode === 'edit') {
        await updateClub(payload as UpdateClubPayload).unwrap();
      }
      setModalState({ open: false, mode: 'view', club: null });
    } catch {
      // baseQuery handles 401/403; other errors surface in UI if needed
    }
  };

  const handleDelete = async (club: Club) => {
    if (!confirm(`Are you sure you want to delete "${club.name_en}"?`)) return;
    await deleteClub(club.id);
  };

  return (
    <div className="min-h-screen bg-[#0a1929] p-6">
      <div>
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-10 h-10 text-[#00ff88]" />
            <h1 className="text-4xl font-bold text-white">Clubs Management</h1>
          </div>
          <p className="text-gray-400">Manage clubs and their information</p>
        </div>

        {/* Search + Add */}
        <div className="bg-[#111d2d] border border-[#1e3a52] rounded-lg p-6 mb-6">
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by club name..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#0a1929] border border-[#1e3a52] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#00ff88] transition-colors"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 border border-[#1e3a52] text-gray-300 rounded-lg hover:bg-[#0a1929] transition-colors"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => setModalState({ open: true, mode: 'create', club: null })}
              className="px-6 py-2.5 bg-[#00ff88] text-[#0a1929] font-semibold rounded-lg hover:bg-[#00dd77] transition-colors inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Club
            </button>
          </form>
        </div>

        {/* Table */}
        <div className="bg-[#111d2d] border border-[#1e3a52] rounded-lg overflow-hidden">
          {isError && (
            <div className="p-6 text-center text-red-400">
              Failed to load clubs.{' '}\n              <button onClick={() => refetch()} className="underline">Retry</button>
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#0a1929] border-b border-[#1e3a52]">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#00ff88]">Logo</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#00ff88]">Name (EN)</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#00ff88]">Name (AR)</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#00ff88]">Status</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-[#00ff88]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-b border-[#1e3a52]">
                      {Array.from({ length: 5 }).map((_v, j) => (
                        <td key={j} className="px-6 py-4">
                          <div className="h-4 bg-[#1e3a52] rounded animate-pulse" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : clubs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      No clubs found
                    </td>
                  </tr>
                ) : (
                  clubs.map((club) => (
                    <tr key={club.id} className="border-b border-[#1e3a52] hover:bg-[#0a1929] transition-colors">
                      <td className="px-6 py-4">
                        <div className="w-12 h-12 bg-white/5 border border-[#1e3a52] rounded-lg flex items-center justify-center overflow-hidden">
                          <img src={club.logo} alt={club.name_en} className="w-full h-full object-contain p-1" />
                        </div>
                      </td>
                      <td className="px-6 py-4 text-white font-medium">{club.name_en}</td>
                      <td className="px-6 py-4 text-gray-300" dir="rtl">{club.name_ar}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${club.status ? 'bg-green-600/20 text-green-400 border border-green-600/30' : 'bg-gray-600/20 text-gray-400 border border-gray-600/30'}`}>
                          {club.status ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setModalState({ open: true, mode: 'view', club })}
                            className="p-2 border border-[#1e3a52] text-gray-300 rounded-lg hover:bg-[#0a1929] hover:text-[#00ff88] transition-colors"
                            title="View"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setModalState({ open: true, mode: 'edit', club })}
                            className="p-2 border border-[#1e3a52] text-gray-300 rounded-lg hover:bg-[#0a1929] hover:text-[#00ff88] transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(club)}
                            className="p-2 border border-red-600/50 text-red-400 rounded-lg hover:bg-red-600/10 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-between">
          <p className="text-gray-400 text-sm">
            {total > 0 ? `Showing ${from}–${to} of ${total} clubs` : 'No clubs'}
          </p>
          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 border border-[#1e3a52] text-gray-300 rounded-lg hover:bg-[#0a1929] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }).map((_, i) => {
                const p = i + 1;
                return (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${p === page ? 'bg-[#00ff88] text-[#0a1929]' : 'border border-[#1e3a52] text-gray-300 hover:bg-[#0a1929]'}`}
                  >
                    {p}
                  </button>
                );
              })}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 border border-[#1e3a52] text-gray-300 rounded-lg hover:bg-[#0a1929] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {modalState.open && (
        <ClubModal
          club={modalState.club}
          mode={modalState.mode}
          onClose={() => setModalState({ open: false, mode: 'view', club: null })}
          onSave={handleSave}
          saving={creating || updating}
        />
      )}
    </div>
  );
}