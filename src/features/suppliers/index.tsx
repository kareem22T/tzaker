import React, { useState, useMemo } from 'react';
import { Building2, Plus, Search, Eye, Edit2, Trash2, X } from 'lucide-react';

// Mock Redux-like state management
const useSuppliersStore = () => {
  const [suppliers, setSuppliers] = useState([
    {
      id: "1",
      name: "Global Electronics Supply Co.",
      email: "contact@globalelectronics.com",
      phone: "+1-555-0101",
      username: "globalelec",
      password: "********",
      createdAt: "2024-01-10T09:00:00Z",
    },
    {
      id: "2",
      name: "Premium Parts International",
      email: "sales@premiumparts.com",
      phone: "+44-20-7123-4567",
      username: "premiumparts",
      password: "********",
      createdAt: "2024-01-15T14:30:00Z",
    },
    {
      id: "3",
      name: "Tech Components Ltd",
      email: "info@techcomponents.com",
      phone: "+971-4-123-4567",
      username: "techcomp",
      password: "********",
      createdAt: "2024-02-01T11:20:00Z",
    },
    {
      id: "4",
      name: "Industrial Materials Group",
      email: "orders@industrialmaterials.com",
      phone: "+49-30-1234-5678",
      username: "indmatgroup",
      password: "********",
      createdAt: "2024-02-10T16:45:00Z",
    },
    {
      id: "5",
      name: "Asian Trade Partners",
      email: "contact@asiantrade.com",
      phone: "+86-21-1234-5678",
      username: "asiantrade",
      password: "********",
      createdAt: "2024-02-20T10:15:00Z",
    },
  ]);

  const [selectedSuppliers, setSelectedSuppliers] = useState([]);

  const addSupplier = (supplier) => {
    const newSupplier = {
      ...supplier,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setSuppliers([newSupplier, ...suppliers]);
  };

  const updateSupplier = (updatedSupplier) => {
    setSuppliers(suppliers.map(s => s.id === updatedSupplier.id ? { ...updatedSupplier, updatedAt: new Date().toISOString() } : s));
  };

  const deleteSupplier = (id) => {
    setSuppliers(suppliers.filter(s => s.id !== id));
    setSelectedSuppliers(selectedSuppliers.filter(sid => sid !== id));
  };

  const deleteMultiple = (ids) => {
    setSuppliers(suppliers.filter(s => !ids.includes(s.id)));
    setSelectedSuppliers([]);
  };

  const toggleSelection = (id) => {
    setSelectedSuppliers(prev => 
      prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
    );
  };

  return { suppliers, selectedSuppliers, addSupplier, updateSupplier, deleteSupplier, deleteMultiple, toggleSelection, setSelectedSuppliers };
};

const SupplierModal = ({ supplier, onClose, onSave, mode }) => {
  const [formData, setFormData] = useState(supplier || {
    name: '',
    email: '',
    phone: '',
    username: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = () => {
    if (!formData.name || !formData.email || !formData.phone || !formData.username || !formData.password) {
      alert('Please fill in all required fields');
      return;
    }
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-9999999 p-4">
      <div className="bg-[#111d2d] border border-[#1e3a52] rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-[#111d2d] border-b border-[#1e3a52] p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">
            {mode === 'create' ? 'Add New Supplier' : mode === 'edit' ? 'Edit Supplier' : 'Supplier Details'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {mode === 'view' ? (
          <div className="p-6 space-y-4">
            <div className="bg-[#0a1929] border border-[#1e3a52] rounded-lg p-6">
              <h3 className="text-lg font-semibold text-[#00ff88] mb-4">Supplier Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Supplier Name</p>
                  <p className="text-white font-medium">{supplier.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Email</p>
                  <p className="text-white font-medium">{supplier.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Phone</p>
                  <p className="text-white font-medium">{supplier.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Username</p>
                  <p className="text-white font-medium">{supplier.username}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Created At</p>
                  <p className="text-white font-medium">{new Date(supplier.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
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
                    <label className="block text-sm font-medium text-gray-300 mb-2">Password *</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full px-4 py-2 bg-[#0a1929] border border-[#1e3a52] rounded-lg text-white focus:outline-none focus:border-[#00ff88] transition-colors"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                      >
                        {showPassword ? (
                          <Eye className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-4 border-t border-[#1e3a52]">
              <button
                onClick={onClose}
                className="px-6 py-2.5 border border-[#1e3a52] text-gray-300 rounded-lg hover:bg-[#0a1929] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-6 py-2.5 bg-[#00ff88] text-[#0a1929] font-semibold rounded-lg hover:bg-[#00dd77] transition-colors"
              >
                {mode === 'create' ? 'Create Supplier' : 'Save Changes'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default function SuppliersManagement() {
  const { suppliers, selectedSuppliers, addSupplier, updateSupplier, deleteSupplier, deleteMultiple, toggleSelection, setSelectedSuppliers } = useSuppliersStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [modalState, setModalState] = useState({ open: false, mode: null, supplier: null });

  const filteredSuppliers = useMemo(() => {
    return suppliers.filter(supplier =>
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [suppliers, searchTerm]);

  const handleSave = (supplierData) => {
    if (modalState.mode === 'create') {
      addSupplier(supplierData);
    } else if (modalState.mode === 'edit') {
      updateSupplier({ ...supplierData, id: modalState.supplier.id });
    }
    setModalState({ open: false, mode: null, supplier: null });
  };

  const handleDelete = (id, name) => {
    if (confirm(`Are you sure you want to delete ${name}?`)) {
      deleteSupplier(id);
    }
  };

  const handleBulkDelete = () => {
    if (confirm(`Are you sure you want to delete ${selectedSuppliers.length} supplier(s)?`)) {
      deleteMultiple(selectedSuppliers);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a1929] p-6">
      <div>
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Building2 className="w-10 h-10 text-[#00ff88]" />
            <h1 className="text-4xl font-bold text-white">Suppliers Management</h1>
          </div>
          <p className="text-gray-400">Manage supplier accounts and information</p>
        </div>

        {selectedSuppliers.length > 0 && (
          <div className="mb-4 bg-[#111d2d] border border-[#00ff88]/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-white font-medium">
                {selectedSuppliers.length} supplier{selectedSuppliers.length !== 1 ? 's' : ''} selected
              </span>
              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedSuppliers([])}
                  className="px-4 py-2 border border-[#1e3a52] text-gray-300 rounded-lg hover:bg-[#0a1929] transition-colors inline-flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Clear
                </button>
                <button
                  onClick={handleBulkDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors inline-flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Selected
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-[#111d2d] border border-[#1e3a52] rounded-lg p-6 mb-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, or username..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#0a1929] border border-[#1e3a52] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#00ff88] transition-colors"
              />
            </div>
            <button
              onClick={() => setModalState({ open: true, mode: 'create', supplier: null })}
              className="px-6 py-2.5 bg-[#00ff88] text-[#0a1929] font-semibold rounded-lg hover:bg-[#00dd77] transition-colors inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Supplier
            </button>
          </div>
        </div>

        <div className="bg-[#111d2d] border border-[#1e3a52] rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#0a1929] border-b border-[#1e3a52]">
                  <th className="px-6 py-4 text-left">
                    <input
                      type="checkbox"
                      checked={selectedSuppliers.length === filteredSuppliers.length && filteredSuppliers.length > 0}
                      onChange={() => setSelectedSuppliers(selectedSuppliers.length === filteredSuppliers.length ? [] : filteredSuppliers.map(s => s.id))}
                      className="w-5 h-5 bg-[#0a1929] border border-[#1e3a52] rounded checked:bg-[#00ff88] checked:border-[#00ff88]"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#00ff88]">Supplier Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#00ff88]">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#00ff88]">Phone</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#00ff88]">Username</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-[#00ff88]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSuppliers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      No suppliers found
                    </td>
                  </tr>
                ) : (
                  filteredSuppliers.map((supplier) => (
                    <tr key={supplier.id} className="border-b border-[#1e3a52] hover:bg-[#0a1929] transition-colors">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedSuppliers.includes(supplier.id)}
                          onChange={() => toggleSelection(supplier.id)}
                          className="w-5 h-5 bg-[#0a1929] border border-[#1e3a52] rounded checked:bg-[#00ff88] checked:border-[#00ff88]"
                        />
                      </td>
                      <td className="px-6 py-4 text-white font-medium">{supplier.name}</td>
                      <td className="px-6 py-4 text-gray-300">{supplier.email}</td>
                      <td className="px-6 py-4 text-gray-300">{supplier.phone}</td>
                      <td className="px-6 py-4 text-gray-300">{supplier.username}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setModalState({ open: true, mode: 'view', supplier })}
                            className="p-2 border border-[#1e3a52] text-gray-300 rounded-lg hover:bg-[#0a1929] hover:text-[#00ff88] transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setModalState({ open: true, mode: 'edit', supplier })}
                            className="p-2 border border-[#1e3a52] text-gray-300 rounded-lg hover:bg-[#0a1929] hover:text-[#00ff88] transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(supplier.id, supplier.name)}
                            className="p-2 border border-red-600/50 text-red-400 rounded-lg hover:bg-red-600/10 transition-colors"
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

        <div className="mt-6 text-gray-400 text-sm">
          Showing {filteredSuppliers.length} of {suppliers.length} suppliers
        </div>
      </div>

      {modalState.open && (
        <SupplierModal
          supplier={modalState.supplier}
          mode={modalState.mode}
          onClose={() => setModalState({ open: false, mode: null, supplier: null })}
          onSave={handleSave}
        />
      )}
    </div>
  );
}