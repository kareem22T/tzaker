import React, { useState, useMemo } from 'react';
import { Shield, Plus, Search, Eye, Edit2, Trash2, X, Upload } from 'lucide-react';

// Mock Redux-like state management
const useClubsStore = () => {
  const [clubs, setClubs] = useState([
    {
      id: "1",
      name: "Manchester United",
      logo: "https://upload.wikimedia.org/wikipedia/en/7/7a/Manchester_United_FC_crest.svg",
      createdAt: "2024-01-10T09:00:00Z",
    },
    {
      id: "2",
      name: "Real Madrid",
      logo: "https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg",
      createdAt: "2024-01-15T14:30:00Z",
    },
    {
      id: "3",
      name: "FC Barcelona",
      logo: "https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona_%28crest%29.svg",
      createdAt: "2024-02-01T11:20:00Z",
    },
    {
      id: "4",
      name: "Bayern Munich",
      logo: "https://upload.wikimedia.org/wikipedia/commons/1/1b/FC_Bayern_M%C3%BCnchen_logo_%282017%29.svg",
      createdAt: "2024-02-10T16:45:00Z",
    },
    {
      id: "5",
      name: "Liverpool FC",
      logo: "https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg",
      createdAt: "2024-02-20T10:15:00Z",
    },
  ]);

  const [selectedClubs, setSelectedClubs] = useState([]);

  const addClub = (club) => {
    const newClub = {
      ...club,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setClubs([newClub, ...clubs]);
  };

  const updateClub = (updatedClub) => {
    setClubs(clubs.map(c => c.id === updatedClub.id ? { ...updatedClub, updatedAt: new Date().toISOString() } : c));
  };

  const deleteClub = (id) => {
    setClubs(clubs.filter(c => c.id !== id));
    setSelectedClubs(selectedClubs.filter(cid => cid !== id));
  };

  const deleteMultiple = (ids) => {
    setClubs(clubs.filter(c => !ids.includes(c.id)));
    setSelectedClubs([]);
  };

  const toggleSelection = (id) => {
    setSelectedClubs(prev => 
      prev.includes(id) ? prev.filter(cid => cid !== id) : [...prev, id]
    );
  };

  return { clubs, selectedClubs, addClub, updateClub, deleteClub, deleteMultiple, toggleSelection, setSelectedClubs };
};

const ClubModal = ({ club, onClose, onSave, mode }) => {
  const [formData, setFormData] = useState(club || {
    name: '',
    logo: '',
  });
  const [logoPreview, setLogoPreview] = useState(club?.logo || '');

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result;
        setLogoPreview(result);
        setFormData({ ...formData, logo: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoUrlChange = (url) => {
    setFormData({ ...formData, logo: url });
    setLogoPreview(url);
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.logo) {
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
            {mode === 'create' ? 'Add New Club' : mode === 'edit' ? 'Edit Club' : 'Club Details'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {mode === 'view' ? (
          <div className="p-6 space-y-4">
            <div className="bg-[#0a1929] border border-[#1e3a52] rounded-lg p-6">
              <h3 className="text-lg font-semibold text-[#00ff88] mb-4">Club Information</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Club Name</p>
                  <p className="text-white font-medium text-xl">{club.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-3">Club Logo</p>
                  <div className="flex items-center justify-center bg-white/5 border border-[#1e3a52] rounded-lg p-8">
                    <img 
                      src={club.logo} 
                      alt={club.name}
                      className="max-w-[200px] max-h-[200px] object-contain"
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23374151" width="200" height="200"/%3E%3Ctext fill="%239CA3AF" font-family="sans-serif" font-size="16" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3ENo Logo%3C/text%3E%3C/svg%3E';
                      }}
                    />
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Created At</p>
                  <p className="text-white font-medium">{new Date(club.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 space-y-4">
            <div className="bg-[#0a1929] border border-[#1e3a52] rounded-lg p-6">
              <h3 className="text-lg font-semibold text-[#00ff88] mb-4">Club Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Club Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 bg-[#0a1929] border border-[#1e3a52] rounded-lg text-white focus:outline-none focus:border-[#00ff88] transition-colors"
                    placeholder="Enter club name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Logo URL *</label>
                  <input
                    type="text"
                    value={formData.logo}
                    onChange={(e) => handleLogoUrlChange(e.target.value)}
                    className="w-full px-4 py-2 bg-[#0a1929] border border-[#1e3a52] rounded-lg text-white focus:outline-none focus:border-[#00ff88] transition-colors"
                    placeholder="Enter logo URL or upload below"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Or Upload Logo</label>
                  <div className="flex items-center gap-4">
                    <label className="flex-1 cursor-pointer">
                      <div className="w-full px-4 py-2 bg-[#0a1929] border border-[#1e3a52] rounded-lg text-gray-400 hover:border-[#00ff88] transition-colors flex items-center gap-2">
                        <Upload className="w-5 h-5" />
                        <span>Choose file...</span>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {logoPreview && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Logo Preview</label>
                    <div className="flex items-center justify-center bg-white/5 border border-[#1e3a52] rounded-lg p-8">
                      <img 
                        src={logoPreview} 
                        alt="Logo preview"
                        className="max-w-[200px] max-h-[200px] object-contain"
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23374151" width="200" height="200"/%3E%3Ctext fill="%239CA3AF" font-family="sans-serif" font-size="16" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3EInvalid Image%3C/text%3E%3C/svg%3E';
                        }}
                      />
                    </div>
                  </div>
                )}
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
                {mode === 'create' ? 'Create Club' : 'Save Changes'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default function ClubsManagement() {
  const { clubs, selectedClubs, addClub, updateClub, deleteClub, deleteMultiple, toggleSelection, setSelectedClubs } = useClubsStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [modalState, setModalState] = useState({ open: false, mode: null, club: null });

  const filteredClubs = useMemo(() => {
    return clubs.filter(club =>
      club.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [clubs, searchTerm]);

  const handleSave = (clubData) => {
    if (modalState.mode === 'create') {
      addClub(clubData);
    } else if (modalState.mode === 'edit') {
      updateClub({ ...clubData, id: modalState.club.id });
    }
    setModalState({ open: false, mode: null, club: null });
  };

  const handleDelete = (id, name) => {
    if (confirm(`Are you sure you want to delete ${name}?`)) {
      deleteClub(id);
    }
  };

  const handleBulkDelete = () => {
    if (confirm(`Are you sure you want to delete ${selectedClubs.length} club(s)?`)) {
      deleteMultiple(selectedClubs);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a1929] p-6">
      <div>
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-10 h-10 text-[#00ff88]" />
            <h1 className="text-4xl font-bold text-white">Clubs Management</h1>
          </div>
          <p className="text-gray-400">Manage clubs and their information</p>
        </div>

        {selectedClubs.length > 0 && (
          <div className="mb-4 bg-[#111d2d] border border-[#00ff88]/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-white font-medium">
                {selectedClubs.length} club{selectedClubs.length !== 1 ? 's' : ''} selected
              </span>
              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedClubs([])}
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
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#0a1929] border border-[#1e3a52] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#00ff88] transition-colors"
              />
            </div>
            <button
              onClick={() => setModalState({ open: true, mode: 'create', club: null })}
              className="px-6 py-2.5 bg-[#00ff88] text-[#0a1929] font-semibold rounded-lg hover:bg-[#00dd77] transition-colors inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Club
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
                      checked={selectedClubs.length === filteredClubs.length && filteredClubs.length > 0}
                      onChange={() => setSelectedClubs(selectedClubs.length === filteredClubs.length ? [] : filteredClubs.map(c => c.id))}
                      className="w-5 h-5 bg-[#0a1929] border border-[#1e3a52] rounded checked:bg-[#00ff88] checked:border-[#00ff88]"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#00ff88]">Logo</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#00ff88]">Club Name</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-[#00ff88]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredClubs.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                      No clubs found
                    </td>
                  </tr>
                ) : (
                  filteredClubs.map((club) => (
                    <tr key={club.id} className="border-b border-[#1e3a52] hover:bg-[#0a1929] transition-colors">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedClubs.includes(club.id)}
                          onChange={() => toggleSelection(club.id)}
                          className="w-5 h-5 bg-[#0a1929] border border-[#1e3a52] rounded checked:bg-[#00ff88] checked:border-[#00ff88]"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="w-12 h-12 bg-white/5 border border-[#1e3a52] rounded-lg flex items-center justify-center overflow-hidden">
                          <img 
                            src={club.logo} 
                            alt={club.name}
                            className="w-full h-full object-contain p-1"
                            onError={(e) => {
                              e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="48" height="48"%3E%3Crect fill="%23374151" width="48" height="48"/%3E%3Ctext fill="%239CA3AF" font-family="sans-serif" font-size="10" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3ENo Logo%3C/text%3E%3C/svg%3E';
                            }}
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 text-white font-medium">{club.name}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setModalState({ open: true, mode: 'view', club })}
                            className="p-2 border border-[#1e3a52] text-gray-300 rounded-lg hover:bg-[#0a1929] hover:text-[#00ff88] transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setModalState({ open: true, mode: 'edit', club })}
                            className="p-2 border border-[#1e3a52] text-gray-300 rounded-lg hover:bg-[#0a1929] hover:text-[#00ff88] transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(club.id, club.name)}
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
          Showing {filteredClubs.length} of {clubs.length} clubs
        </div>
      </div>

      {modalState.open && (
        <ClubModal
          club={modalState.club}
          mode={modalState.mode}
          onClose={() => setModalState({ open: false, mode: null, club: null })}
          onSave={handleSave}
        />
      )}
    </div>
  );
}