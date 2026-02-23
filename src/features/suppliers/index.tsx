import React, { useState } from 'react';
import { Building2, Plus, Search, Eye, Edit2, Trash2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  useGetSuppliersQuery,
  useCreateSupplierMutation,
  useUpdateSupplierMutation,
  useDeleteSupplierMutation,
  type Supplier,
  type CreateSupplierPayload,
} from '../../store/api/suppliersApi';

// ── Modal ──────────────────────────────────────────────────────────────────────

type ModalMode = 'view' | 'create' | 'edit';

interface ModalProps {
  supplier: Supplier | null;
  mode: ModalMode;
  onClose: () => void;
  onSave: (data: CreateSupplierPayload & { id?: number }) => void;
  saving?: boolean;
}

const SupplierModal: React.FC<ModalProps> = ({ supplier, mode, onClose, onSave, saving }) => {
  const [formData, setFormData] = useState<CreateSupplierPayload & { id?: number }>({
    id: supplier?.id,
    name: supplier?.name ?? '',
    email: supplier?.email ?? '',
    phone: supplier?.phone ?? '',
    username: supplier?.username ?? '',
    password: '',
    // new multilingual/description fields
    name_en: supplier?.name_en ?? '',
    name_ar: supplier?.name_ar ?? '',
    desc_en: supplier?.desc_en ?? '',
    desc_ar: supplier?.desc_ar ?? '',
    image: undefined,
  });
  const [preview, setPreview] = useState<string>(supplier?.image ?? '');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!formData.name || !formData.email || !formData.phone || !formData.username) {
      setError('Please fill in all required fields');
      return;
    }
    if (mode === 'create' && !formData.password) {
      setError('Password is required');
      return;
    }
    setError(null);
    onSave(formData);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[99999999] p-4">
      <div className="bg-[#111d2d] border border-[#1e3a52] rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-[#111d2d] border-b border-[#1e3a52] p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">
            {mode === 'create' ? 'Add New Supplier' : mode === 'edit' ? 'Edit Supplier' : 'Supplier Details'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* View mode */}
        {mode === 'view' && supplier ? (
          <div className="p-6">
            <div className="bg-[#0a1929] border border-[#1e3a52] rounded-lg p-6">
              <h3 className="text-lg font-semibold text-[#00ff88] mb-4">Supplier Information</h3>
              {supplier.image && (
                <div className="mb-4">
                  <img src={supplier.image} alt={supplier.name} className="w-16 h-16 rounded-full object-cover border border-[#1e3a52]" />
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Name', value: supplier.name },
                  { label: 'Name (EN)', value: supplier.name_en || '-' },
                  { label: 'Name (AR)', value: supplier.name_ar || '-' },
                  { label: 'Email', value: supplier.email },
                  { label: 'Phone', value: supplier.phone },
                  { label: 'Username', value: supplier.username },
                  { label: 'Description (EN)', value: supplier.desc_en || '-' },
                  { label: 'Description (AR)', value: supplier.desc_ar || '-' },
                  { label: 'Status', value: supplier.status === 1 ? 'Active' : 'Inactive' },
                  { label: 'Created At', value: supplier.created_at },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-sm text-gray-400 mb-1">{label}</p>
                    <p className="text-white font-medium">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Create / Edit mode */
          <div className="p-6 space-y-4">
            <div className="bg-[#0a1929] border border-[#1e3a52] rounded-lg p-6">
              <h3 className="text-lg font-semibold text-[#00ff88] mb-4">Supplier Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Supplier Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 bg-[#0a1929] border border-[#1e3a52] rounded-lg text-white focus:outline-none focus:border-[#00ff88] transition-colors"
                    placeholder="Enter supplier name"
                  />
                </div>
                {/* multilingual name inputs */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Name (English)</label>
                    <input
                      type="text"
                      value={formData.name_en || ''}
                      onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                      className="w-full px-4 py-2 bg-[#0a1929] border border-[#1e3a52] rounded-lg text-white focus:outline-none focus:border-[#00ff88] transition-colors"
                      placeholder="English name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Name (Arabic)</label>
                    <input
                      type="text"
                      value={formData.name_ar || ''}
                      onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })}
                      className="w-full px-4 py-2 bg-[#0a1929] border border-[#1e3a52] rounded-lg text-white focus:outline-none focus:border-[#00ff88] transition-colors"
                      placeholder="Arabic name"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Email *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2 bg-[#0a1929] border border-[#1e3a52] rounded-lg text-white focus:outline-none focus:border-[#00ff88] transition-colors"
                      placeholder="email@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Phone *</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2 bg-[#0a1929] border border-[#1e3a52] rounded-lg text-white focus:outline-none focus:border-[#00ff88] transition-colors"
                      placeholder="+1-555-0000"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Username *</label>
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      className="w-full px-4 py-2 bg-[#0a1929] border border-[#1e3a52] rounded-lg text-white focus:outline-none focus:border-[#00ff88] transition-colors"
                      placeholder="username"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Password {mode === 'create' ? '*' : '(leave blank to keep current)'}
                    </label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-4 py-2 bg-[#0a1929] border border-[#1e3a52] rounded-lg text-white focus:outline-none focus:border-[#00ff88] transition-colors"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
                {/* descriptions */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Description (English)</label>
                    <textarea
                      rows={2}
                      value={formData.desc_en || ''}
                      onChange={(e) => setFormData({ ...formData, desc_en: e.target.value })}
                      className="w-full px-4 py-2 bg-[#0a1929] border border-[#1e3a52] rounded-lg text-white focus:outline-none focus:border-[#00ff88] transition-colors"
                      placeholder="English description"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Description (Arabic)</label>
                    <textarea
                      rows={2}
                      value={formData.desc_ar || ''}
                      onChange={(e) => setFormData({ ...formData, desc_ar: e.target.value })}
                      className="w-full px-4 py-2 bg-[#0a1929] border border-[#1e3a52] rounded-lg text-white focus:outline-none focus:border-[#00ff88] transition-colors"
                      placeholder="Arabic description"
                    />
                  </div>
                </div>
                {/* image upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Image</label>
                  {preview && (
                    <div className="mb-2">
                      <img src={preview} alt="preview" className="w-16 h-16 rounded-full object-cover border border-[#1e3a52]" />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full text-sm text-gray-300 file:mr-3 file:px-3 file:py-1.5 file:bg-[#1e3a52] file:text-white file:rounded file:border-0 file:text-sm"
                  />
                </div>
              </div>
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <div className="flex gap-3 justify-end pt-4 border-t border-[#1e3a52]">
              <button
                onClick={onClose}
                className="px-6 py-2.5 border border-[#1e3a52] text-gray-300 rounded-lg hover:bg-[#0a1929] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="px-6 py-2.5 bg-[#00ff88] text-[#0a1929] font-semibold rounded-lg hover:bg-[#00dd77] transition-colors disabled:opacity-50"
              >
                {saving ? 'Saving...' : mode === 'create' ? 'Create Supplier' : 'Save Changes'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ── Main page ──────────────────────────────────────────────────────────────────

const PER_PAGE = 10;

export default function SuppliersManagement() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [modalState, setModalState] = useState<{ open: boolean; mode: ModalMode; supplier: Supplier | null }>({
    open: false,
    mode: 'view',
    supplier: null,
  });

  const { data, isLoading, isError, refetch } = useGetSuppliersQuery({ page, per_page: PER_PAGE, search });
  const [createSupplier, { isLoading: creating }] = useCreateSupplierMutation();
  const [updateSupplier, { isLoading: updating }] = useUpdateSupplierMutation();
  const [deleteSupplier] = useDeleteSupplierMutation();

  const suppliers = data?.data?.data ?? [];
  const meta = data?.data;
  const totalPages = meta?.last_page ?? 1;
  const total = meta?.total ?? 0;
  const from = meta?.from ?? 0;
  const to = meta?.to ?? 0;

  // Search: reset to page 1 on submit
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const handleSave = async (formData: CreateSupplierPayload & { id?: number }) => {
    try {
      if (modalState.mode === 'create') {
        await createSupplier(formData as CreateSupplierPayload).unwrap();
      } else if (modalState.mode === 'edit' && formData.id) {
        const payload = { ...formData };
        if (!payload.password) delete payload.password;
        await updateSupplier(payload as { id: number } & Partial<CreateSupplierPayload>).unwrap();
      }
      setModalState({ open: false, mode: 'view', supplier: null });
    } catch {
      // errors will be shown via form inline if needed
    }
  };

  const handleDelete = async (supplier: Supplier) => {
    if (!confirm(`Are you sure you want to delete "${supplier.name}"?`)) return;
    await deleteSupplier(supplier.id);
  };

  return (
    <div className="min-h-screen bg-[#0a1929] p-6">
      <div>
        {/* Page header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Building2 className="w-10 h-10 text-[#00ff88]" />
            <h1 className="text-4xl font-bold text-white">Suppliers Management</h1>
          </div>
          <p className="text-gray-400">Manage supplier accounts and information</p>
        </div>

        {/* Search + Add */}
        <div className="bg-[#111d2d] border border-[#1e3a52] rounded-lg p-6 mb-6">
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, or username..."
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
              onClick={() => setModalState({ open: true, mode: 'create', supplier: null })}
              className="px-6 py-2.5 bg-[#00ff88] text-[#0a1929] font-semibold rounded-lg hover:bg-[#00dd77] transition-colors inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Supplier
            </button>
          </form>
        </div>

        {/* Table */}
        <div className="bg-[#111d2d] border border-[#1e3a52] rounded-lg overflow-hidden">
          {isError && (
            <div className="p-6 text-center text-red-400">
              Failed to load suppliers.{' '}\n              <button onClick={() => refetch()} className="underline">Retry</button>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#0a1929] border-b border-[#1e3a52]">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#00ff88]">Supplier Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#00ff88]">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#00ff88]">Phone</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#00ff88]">Username</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#00ff88]">Status</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-[#00ff88]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-b border-[#1e3a52]">
                      {Array.from({ length: 6 }).map((__, j) => (
                        <td key={j} className="px-6 py-4">
                          <div className="h-4 bg-[#1e3a52] rounded animate-pulse" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : suppliers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      No suppliers found
                    </td>
                  </tr>
                ) : (
                  suppliers.map((supplier) => (
                    <tr key={supplier.id} className="border-b border-[#1e3a52] hover:bg-[#0a1929] transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {supplier.image && (
                            <img src={supplier.image} alt={supplier.name} className="w-8 h-8 rounded-full object-cover border border-[#1e3a52]" />
                          )}
                          <span className="text-white font-medium">{supplier.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-300">{supplier.email}</td>
                      <td className="px-6 py-4 text-gray-300">{supplier.phone}</td>
                      <td className="px-6 py-4 text-gray-300">{supplier.username}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${supplier.status === 1 ? 'bg-green-600/20 text-green-400 border border-green-600/30' : 'bg-gray-600/20 text-gray-400 border border-gray-600/30'}`}>
                          {supplier.status === 1 ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setModalState({ open: true, mode: 'view', supplier })}
                            className="p-2 border border-[#1e3a52] text-gray-300 rounded-lg hover:bg-[#0a1929] hover:text-[#00ff88] transition-colors"
                            title="View"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setModalState({ open: true, mode: 'edit', supplier })}
                            className="p-2 border border-[#1e3a52] text-gray-300 rounded-lg hover:bg-[#0a1929] hover:text-[#00ff88] transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(supplier)}
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

        {/* Pagination + summary */}
        <div className="mt-6 flex items-center justify-between">
          <p className="text-gray-400 text-sm">
            {total > 0 ? `Showing ${from}–${to} of ${total} suppliers` : 'No suppliers'}
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
        <SupplierModal
          supplier={modalState.supplier}
          mode={modalState.mode}
          onClose={() => setModalState({ open: false, mode: 'view', supplier: null })}
          onSave={handleSave}
          saving={creating || updating}
        />
      )}
    </div>
  );
}
