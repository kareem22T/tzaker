import React, { useState, useMemo } from 'react';
import { Trophy, Plus, Search, Eye, Edit2, Trash2, X } from 'lucide-react';

// Mock Redux-like state management
const useSportsStore = () => {
  const [sports, setSports] = useState([
    {
      id: "1",
      name: "Football",
      description: "A team sport played between two teams of eleven players with a spherical ball. It is the world's most popular sport.",
      createdAt: "2024-01-10T09:00:00Z",
    },
    {
      id: "2",
      name: "Basketball",
      description: "A team sport where two teams of five players try to score points by throwing a ball through a hoop elevated 10 feet above the ground.",
      createdAt: "2024-01-15T14:30:00Z",
    },
    {
      id: "3",
      name: "Tennis",
      description: "A racket sport that can be played individually against a single opponent or between two teams of two players each.",
      createdAt: "2024-02-01T11:20:00Z",
    },
    {
      id: "4",
      name: "Swimming",
      description: "An individual or team racing sport that requires the use of one's entire body to move through water.",
      createdAt: "2024-02-10T16:45:00Z",
    },
    {
      id: "5",
      name: "Volleyball",
      description: "A team sport in which two teams of six players are separated by a net and try to score points by grounding the ball on the other team's court.",
      createdAt: "2024-02-20T10:15:00Z",
    },
  ]);

  const [selectedSports, setSelectedSports] = useState([]);

  const addSport = (sport) => {
    const newSport = {
      ...sport,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setSports([newSport, ...sports]);
  };

  const updateSport = (updatedSport) => {
    setSports(sports.map(s => s.id === updatedSport.id ? { ...updatedSport, updatedAt: new Date().toISOString() } : s));
  };

  const deleteSport = (id) => {
    setSports(sports.filter(s => s.id !== id));
    setSelectedSports(selectedSports.filter(sid => sid !== id));
  };

  const deleteMultiple = (ids) => {
    setSports(sports.filter(s => !ids.includes(s.id)));
    setSelectedSports([]);
  };

  const toggleSelection = (id) => {
    setSelectedSports(prev => 
      prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
    );
  };

  return { sports, selectedSports, addSport, updateSport, deleteSport, deleteMultiple, toggleSelection, setSelectedSports };
};

const SportModal = ({ sport, onClose, onSave, mode }) => {
  const [formData, setFormData] = useState(sport || {
    name: '',
    description: '',
  });

  const handleSubmit = () => {
    if (!formData.name || !formData.description) {
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
            {mode === 'create' ? 'Add New Sport' : mode === 'edit' ? 'Edit Sport' : 'Sport Details'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {mode === 'view' ? (
          <div className="p-6 space-y-4">
            <div className="bg-[#0a1929] border border-[#1e3a52] rounded-lg p-6">
              <h3 className="text-lg font-semibold text-[#00ff88] mb-4">Sport Information</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Sport Name</p>
                  <p className="text-white font-medium text-xl">{sport.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Description</p>
                  <p className="text-white leading-relaxed">{sport.description}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Created At</p>
                  <p className="text-white font-medium">{new Date(sport.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 space-y-4">
            <div className="bg-[#0a1929] border border-[#1e3a52] rounded-lg p-6">
              <h3 className="text-lg font-semibold text-[#00ff88] mb-4">Sport Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Sport Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 bg-[#0a1929] border border-[#1e3a52] rounded-lg text-white focus:outline-none focus:border-[#00ff88] transition-colors"
                    placeholder="Enter sport name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Description *</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={5}
                    className="w-full px-4 py-2 bg-[#0a1929] border border-[#1e3a52] rounded-lg text-white focus:outline-none focus:border-[#00ff88] transition-colors resize-none"
                    placeholder="Enter sport description"
                  />
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
                {mode === 'create' ? 'Create Sport' : 'Save Changes'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default function SportsManagement() {
  const { sports, selectedSports, addSport, updateSport, deleteSport, deleteMultiple, toggleSelection, setSelectedSports } = useSportsStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [modalState, setModalState] = useState({ open: false, mode: null, sport: null });

  const filteredSports = useMemo(() => {
    return sports.filter(sport =>
      sport.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sport.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [sports, searchTerm]);

  const handleSave = (sportData) => {
    if (modalState.mode === 'create') {
      addSport(sportData);
    } else if (modalState.mode === 'edit') {
      updateSport({ ...sportData, id: modalState.sport.id });
    }
    setModalState({ open: false, mode: null, sport: null });
  };

  const handleDelete = (id, name) => {
    if (confirm(`Are you sure you want to delete ${name}?`)) {
      deleteSport(id);
    }
  };

  const handleBulkDelete = () => {
    if (confirm(`Are you sure you want to delete ${selectedSports.length} sport(s)?`)) {
      deleteMultiple(selectedSports);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a1929] p-6">
      <div>
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Trophy className="w-10 h-10 text-[#00ff88]" />
            <h1 className="text-4xl font-bold text-white">Sports Management</h1>
          </div>
          <p className="text-gray-400">Manage sports and their information</p>
        </div>

        {selectedSports.length > 0 && (
          <div className="mb-4 bg-[#111d2d] border border-[#00ff88]/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-white font-medium">
                {selectedSports.length} sport{selectedSports.length !== 1 ? 's' : ''} selected
              </span>
              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedSports([])}
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
                placeholder="Search by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#0a1929] border border-[#1e3a52] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#00ff88] transition-colors"
              />
            </div>
            <button
              onClick={() => setModalState({ open: true, mode: 'create', sport: null })}
              className="px-6 py-2.5 bg-[#00ff88] text-[#0a1929] font-semibold rounded-lg hover:bg-[#00dd77] transition-colors inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Sport
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
                      checked={selectedSports.length === filteredSports.length && filteredSports.length > 0}
                      onChange={() => setSelectedSports(selectedSports.length === filteredSports.length ? [] : filteredSports.map(s => s.id))}
                      className="w-5 h-5 bg-[#0a1929] border border-[#1e3a52] rounded checked:bg-[#00ff88] checked:border-[#00ff88]"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#00ff88]">Sport Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#00ff88]">Description</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-[#00ff88]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSports.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                      No sports found
                    </td>
                  </tr>
                ) : (
                  filteredSports.map((sport) => (
                    <tr key={sport.id} className="border-b border-[#1e3a52] hover:bg-[#0a1929] transition-colors">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedSports.includes(sport.id)}
                          onChange={() => toggleSelection(sport.id)}
                          className="w-5 h-5 bg-[#0a1929] border border-[#1e3a52] rounded checked:bg-[#00ff88] checked:border-[#00ff88]"
                        />
                      </td>
                      <td className="px-6 py-4 text-white font-medium">{sport.name}</td>
                      <td className="px-6 py-4 text-gray-300 max-w-md">
                        <div className="line-clamp-2">{sport.description}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setModalState({ open: true, mode: 'view', sport })}
                            className="p-2 border border-[#1e3a52] text-gray-300 rounded-lg hover:bg-[#0a1929] hover:text-[#00ff88] transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setModalState({ open: true, mode: 'edit', sport })}
                            className="p-2 border border-[#1e3a52] text-gray-300 rounded-lg hover:bg-[#0a1929] hover:text-[#00ff88] transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(sport.id, sport.name)}
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
          Showing {filteredSports.length} of {sports.length} sports
        </div>
      </div>

      {modalState.open && (
        <SportModal
          sport={modalState.sport}
          mode={modalState.mode}
          onClose={() => setModalState({ open: false, mode: null, sport: null })}
          onSave={handleSave}
        />
      )}
    </div>
  );
}