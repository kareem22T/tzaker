import React, { useState, useMemo } from 'react';
import { Trophy, Plus, Search, Eye, Edit2, Trash2, X } from 'lucide-react';

// Mock Redux-like state management
const useTournamentsStore = () => {
  const [tournaments, setTournaments] = useState([
    {
      id: "1",
      name: "Summer Championship 2024",
      description: "Annual summer tournament featuring top teams from across the region competing for the championship title.",
      createdAt: "2024-01-10T09:00:00Z",
    },
    {
      id: "2",
      name: "Spring League Finals",
      description: "The culmination of the spring season where the best teams battle it out in a knockout format.",
      createdAt: "2024-01-15T14:30:00Z",
    },
    {
      id: "3",
      name: "Winter Cup",
      description: "A prestigious winter tournament bringing together elite athletes for an intense competition.",
      createdAt: "2024-02-01T11:20:00Z",
    },
    {
      id: "4",
      name: "Regional Championship",
      description: "Multi-sport regional championship showcasing talent from various disciplines and age groups.",
      createdAt: "2024-02-10T16:45:00Z",
    },
    {
      id: "5",
      name: "Youth Development Cup",
      description: "A tournament dedicated to nurturing young talent and providing competitive experience for junior athletes.",
      createdAt: "2024-02-20T10:15:00Z",
    },
  ]);

  const [selectedTournaments, setSelectedTournaments] = useState([]);

  const addTournament = (tournament) => {
    const newTournament = {
      ...tournament,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setTournaments([newTournament, ...tournaments]);
  };

  const updateTournament = (updatedTournament) => {
    setTournaments(tournaments.map(t => t.id === updatedTournament.id ? { ...updatedTournament, updatedAt: new Date().toISOString() } : t));
  };

  const deleteTournament = (id) => {
    setTournaments(tournaments.filter(t => t.id !== id));
    setSelectedTournaments(selectedTournaments.filter(tid => tid !== id));
  };

  const deleteMultiple = (ids) => {
    setTournaments(tournaments.filter(t => !ids.includes(t.id)));
    setSelectedTournaments([]);
  };

  const toggleSelection = (id) => {
    setSelectedTournaments(prev => 
      prev.includes(id) ? prev.filter(tid => tid !== id) : [...prev, id]
    );
  };

  return { tournaments, selectedTournaments, addTournament, updateTournament, deleteTournament, deleteMultiple, toggleSelection, setSelectedTournaments };
};

const TournamentModal = ({ tournament, onClose, onSave, mode }) => {
  const [formData, setFormData] = useState(tournament || {
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
            {mode === 'create' ? 'Add New Tournament' : mode === 'edit' ? 'Edit Tournament' : 'Tournament Details'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {mode === 'view' ? (
          <div className="p-6 space-y-4">
            <div className="bg-[#0a1929] border border-[#1e3a52] rounded-lg p-6">
              <h3 className="text-lg font-semibold text-[#00ff88] mb-4">Tournament Information</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Tournament Name</p>
                  <p className="text-white font-medium text-xl">{tournament.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Description</p>
                  <p className="text-white leading-relaxed">{tournament.description}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Created At</p>
                  <p className="text-white font-medium">{new Date(tournament.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 space-y-4">
            <div className="bg-[#0a1929] border border-[#1e3a52] rounded-lg p-6">
              <h3 className="text-lg font-semibold text-[#00ff88] mb-4">Tournament Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Tournament Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 bg-[#0a1929] border border-[#1e3a52] rounded-lg text-white focus:outline-none focus:border-[#00ff88] transition-colors"
                    placeholder="Enter tournament name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Description *</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={5}
                    className="w-full px-4 py-2 bg-[#0a1929] border border-[#1e3a52] rounded-lg text-white focus:outline-none focus:border-[#00ff88] transition-colors resize-none"
                    placeholder="Enter tournament description"
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
                {mode === 'create' ? 'Create Tournament' : 'Save Changes'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default function TournamentsManagement() {
  const { tournaments, selectedTournaments, addTournament, updateTournament, deleteTournament, deleteMultiple, toggleSelection, setSelectedTournaments } = useTournamentsStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [modalState, setModalState] = useState({ open: false, mode: null, tournament: null });

  const filteredTournaments = useMemo(() => {
    return tournaments.filter(tournament =>
      tournament.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tournament.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [tournaments, searchTerm]);

  const handleSave = (tournamentData) => {
    if (modalState.mode === 'create') {
      addTournament(tournamentData);
    } else if (modalState.mode === 'edit') {
      updateTournament({ ...tournamentData, id: modalState.tournament.id });
    }
    setModalState({ open: false, mode: null, tournament: null });
  };

  const handleDelete = (id, name) => {
    if (confirm(`Are you sure you want to delete ${name}?`)) {
      deleteTournament(id);
    }
  };

  const handleBulkDelete = () => {
    if (confirm(`Are you sure you want to delete ${selectedTournaments.length} tournament(s)?`)) {
      deleteMultiple(selectedTournaments);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a1929] p-6">
      <div>
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Trophy className="w-10 h-10 text-[#00ff88]" />
            <h1 className="text-4xl font-bold text-white">Tournaments Management</h1>
          </div>
          <p className="text-gray-400">Manage tournaments and their information</p>
        </div>

        {selectedTournaments.length > 0 && (
          <div className="mb-4 bg-[#111d2d] border border-[#00ff88]/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-white font-medium">
                {selectedTournaments.length} tournament{selectedTournaments.length !== 1 ? 's' : ''} selected
              </span>
              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedTournaments([])}
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
              onClick={() => setModalState({ open: true, mode: 'create', tournament: null })}
              className="px-6 py-2.5 bg-[#00ff88] text-[#0a1929] font-semibold rounded-lg hover:bg-[#00dd77] transition-colors inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Tournament
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
                      checked={selectedTournaments.length === filteredTournaments.length && filteredTournaments.length > 0}
                      onChange={() => setSelectedTournaments(selectedTournaments.length === filteredTournaments.length ? [] : filteredTournaments.map(t => t.id))}
                      className="w-5 h-5 bg-[#0a1929] border border-[#1e3a52] rounded checked:bg-[#00ff88] checked:border-[#00ff88]"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#00ff88]">Tournament Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#00ff88]">Description</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-[#00ff88]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTournaments.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                      No tournaments found
                    </td>
                  </tr>
                ) : (
                  filteredTournaments.map((tournament) => (
                    <tr key={tournament.id} className="border-b border-[#1e3a52] hover:bg-[#0a1929] transition-colors">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedTournaments.includes(tournament.id)}
                          onChange={() => toggleSelection(tournament.id)}
                          className="w-5 h-5 bg-[#0a1929] border border-[#1e3a52] rounded checked:bg-[#00ff88] checked:border-[#00ff88]"
                        />
                      </td>
                      <td className="px-6 py-4 text-white font-medium">{tournament.name}</td>
                      <td className="px-6 py-4 text-gray-300 max-w-md">
                        <div className="line-clamp-2">{tournament.description}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setModalState({ open: true, mode: 'view', tournament })}
                            className="p-2 border border-[#1e3a52] text-gray-300 rounded-lg hover:bg-[#0a1929] hover:text-[#00ff88] transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setModalState({ open: true, mode: 'edit', tournament })}
                            className="p-2 border border-[#1e3a52] text-gray-300 rounded-lg hover:bg-[#0a1929] hover:text-[#00ff88] transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(tournament.id, tournament.name)}
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
          Showing {filteredTournaments.length} of {tournaments.length} tournaments
        </div>
      </div>

      {modalState.open && (
        <TournamentModal
          tournament={modalState.tournament}
          mode={modalState.mode}
          onClose={() => setModalState({ open: false, mode: null, tournament: null })}
          onSave={handleSave}
        />
      )}
    </div>
  );
}