import React, { useState, useMemo } from 'react';
import { Calendar, Plus, Search, Eye, Edit2, Trash2, X } from 'lucide-react';

// Dummy data for tournaments
const tournaments = [
  { id: "1", name: "Summer Championship 2024" },
  { id: "2", name: "Spring League Finals" },
  { id: "3", name: "Winter Cup" },
  { id: "4", name: "Regional Championship" },
  { id: "5", name: "Youth Development Cup" },
];

// Dummy data for clubs
const clubs = [
  { id: "1", name: "Manchester United", logo: "https://upload.wikimedia.org/wikipedia/en/7/7a/Manchester_United_FC_crest.svg" },
  { id: "2", name: "Real Madrid", logo: "https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg" },
  { id: "3", name: "FC Barcelona", logo: "https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona_%28crest%29.svg" },
  { id: "4", name: "Bayern Munich", logo: "https://upload.wikimedia.org/wikipedia/commons/1/1b/FC_Bayern_M%C3%BCnchen_logo_%282017%29.svg" },
  { id: "5", name: "Liverpool FC", logo: "https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg" },
];

// Dummy data for stadiums
const stadiums = [
  { id: "1", name: "Old Trafford" },
  { id: "2", name: "Santiago Bernabéu" },
  { id: "3", name: "Camp Nou" },
  { id: "4", name: "Allianz Arena" },
  { id: "5", name: "Anfield" },
  { id: "6", name: "Wembley Stadium" },
];

// Mock Redux-like state management
const useMatchesStore = () => {
  const [matches, setMatches] = useState([
    {
      id: "1",
      firstOpponent: "1",
      secondOpponent: "2",
      tournament: "1",
      stadium: "1",
      matchDate: "2024-03-15T18:00:00Z",
      createdAt: "2024-01-10T09:00:00Z",
    },
    {
      id: "2",
      firstOpponent: "3",
      secondOpponent: "4",
      tournament: "2",
      stadium: "3",
      matchDate: "2024-03-20T20:00:00Z",
      createdAt: "2024-01-15T14:30:00Z",
    },
    {
      id: "3",
      firstOpponent: "5",
      secondOpponent: "1",
      tournament: "1",
      stadium: "5",
      matchDate: "2024-04-01T19:00:00Z",
      createdAt: "2024-02-01T11:20:00Z",
    },
    {
      id: "4",
      firstOpponent: "2",
      secondOpponent: "3",
      tournament: "3",
      stadium: "2",
      matchDate: "2024-04-10T21:00:00Z",
      createdAt: "2024-02-10T16:45:00Z",
    },
    {
      id: "5",
      firstOpponent: "4",
      secondOpponent: "5",
      tournament: "4",
      stadium: "4",
      matchDate: "2024-04-22T17:30:00Z",
      createdAt: "2024-02-20T10:15:00Z",
    },
  ]);

  const [selectedMatches, setSelectedMatches] = useState([]);

  const addMatch = (match) => {
    const newMatch = {
      ...match,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setMatches([newMatch, ...matches]);
  };

  const updateMatch = (updatedMatch) => {
    setMatches(matches.map(m => m.id === updatedMatch.id ? { ...updatedMatch, updatedAt: new Date().toISOString() } : m));
  };

  const deleteMatch = (id) => {
    setMatches(matches.filter(m => m.id !== id));
    setSelectedMatches(selectedMatches.filter(mid => mid !== id));
  };

  const deleteMultiple = (ids) => {
    setMatches(matches.filter(m => !ids.includes(m.id)));
    setSelectedMatches([]);
  };

  const toggleSelection = (id) => {
    setSelectedMatches(prev => 
      prev.includes(id) ? prev.filter(mid => mid !== id) : [...prev, id]
    );
  };

  return { matches, selectedMatches, addMatch, updateMatch, deleteMatch, deleteMultiple, toggleSelection, setSelectedMatches };
};

const MatchModal = ({ match, onClose, onSave, mode }) => {
  const [formData, setFormData] = useState(match || {
    firstOpponent: '',
    secondOpponent: '',
    tournament: '',
    stadium: '',
    matchDate: '',
  });

  const handleSubmit = () => {
    if (!formData.firstOpponent || !formData.secondOpponent || !formData.tournament || !formData.stadium || !formData.matchDate) {
      alert('Please fill in all required fields');
      return;
    }
    if (formData.firstOpponent === formData.secondOpponent) {
      alert('First and second opponents must be different');
      return;
    }
    onSave(formData);
  };

  const getClubById = (id) => clubs.find(c => c.id === id);
  const getTournamentById = (id) => tournaments.find(t => t.id === id);
  const getStadiumById = (id) => stadiums.find(s => s.id === id);

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-9999999 p-4">
      <div className="bg-[#111d2d] border border-[#1e3a52] rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-[#111d2d] border-b border-[#1e3a52] p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">
            {mode === 'create' ? 'Add New Match' : mode === 'edit' ? 'Edit Match' : 'Match Details'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {mode === 'view' ? (
          <div className="p-6 space-y-4">
            <div className="bg-[#0a1929] border border-[#1e3a52] rounded-lg p-6">
              <h3 className="text-lg font-semibold text-[#00ff88] mb-4">Match Information</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400 mb-3">Match Teams</p>
                  <div className="flex items-center justify-center gap-8 bg-white/5 border border-[#1e3a52] rounded-lg p-6">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-20 h-20 bg-white/5 border border-[#1e3a52] rounded-lg flex items-center justify-center overflow-hidden">
                        <img 
                          src={getClubById(match.firstOpponent)?.logo} 
                          alt={getClubById(match.firstOpponent)?.name}
                          className="w-full h-full object-contain p-2"
                          onError={(e) => {
                            e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="80"%3E%3Crect fill="%23374151" width="80" height="80"/%3E%3C/svg%3E';
                          }}
                        />
                      </div>
                      <p className="text-white font-semibold text-center">{getClubById(match.firstOpponent)?.name}</p>
                    </div>
                    <div className="text-3xl font-bold text-[#00ff88]">VS</div>
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-20 h-20 bg-white/5 border border-[#1e3a52] rounded-lg flex items-center justify-center overflow-hidden">
                        <img 
                          src={getClubById(match.secondOpponent)?.logo} 
                          alt={getClubById(match.secondOpponent)?.name}
                          className="w-full h-full object-contain p-2"
                          onError={(e) => {
                            e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="80"%3E%3Crect fill="%23374151" width="80" height="80"/%3E%3C/svg%3E';
                          }}
                        />
                      </div>
                      <p className="text-white font-semibold text-center">{getClubById(match.secondOpponent)?.name}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Tournament</p>
                  <p className="text-white font-medium text-lg">{getTournamentById(match.tournament)?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Stadium</p>
                  <p className="text-white font-medium text-lg">{getStadiumById(match.stadium)?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Match Date & Time</p>
                  <p className="text-white font-medium">{new Date(match.matchDate).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Created At</p>
                  <p className="text-white font-medium">{new Date(match.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 space-y-4">
            <div className="bg-[#0a1929] border border-[#1e3a52] rounded-lg p-6">
              <h3 className="text-lg font-semibold text-[#00ff88] mb-4">Match Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">First Opponent *</label>
                  <select
                    value={formData.firstOpponent}
                    onChange={(e) => setFormData({ ...formData, firstOpponent: e.target.value })}
                    className="w-full px-4 py-2 bg-[#0a1929] border border-[#1e3a52] rounded-lg text-white focus:outline-none focus:border-[#00ff88] transition-colors"
                  >
                    <option value="">Select first opponent</option>
                    {clubs.map(club => (
                      <option key={club.id} value={club.id}>{club.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Second Opponent *</label>
                  <select
                    value={formData.secondOpponent}
                    onChange={(e) => setFormData({ ...formData, secondOpponent: e.target.value })}
                    className="w-full px-4 py-2 bg-[#0a1929] border border-[#1e3a52] rounded-lg text-white focus:outline-none focus:border-[#00ff88] transition-colors"
                  >
                    <option value="">Select second opponent</option>
                    {clubs.map(club => (
                      <option key={club.id} value={club.id}>{club.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Tournament *</label>
                  <select
                    value={formData.tournament}
                    onChange={(e) => setFormData({ ...formData, tournament: e.target.value })}
                    className="w-full px-4 py-2 bg-[#0a1929] border border-[#1e3a52] rounded-lg text-white focus:outline-none focus:border-[#00ff88] transition-colors"
                  >
                    <option value="">Select tournament</option>
                    {tournaments.map(tournament => (
                      <option key={tournament.id} value={tournament.id}>{tournament.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Stadium *</label>
                  <select
                    value={formData.stadium}
                    onChange={(e) => setFormData({ ...formData, stadium: e.target.value })}
                    className="w-full px-4 py-2 bg-[#0a1929] border border-[#1e3a52] rounded-lg text-white focus:outline-none focus:border-[#00ff88] transition-colors"
                  >
                    <option value="">Select stadium</option>
                    {stadiums.map(stadium => (
                      <option key={stadium.id} value={stadium.id}>{stadium.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Match Date & Time *</label>
                  <input
                    type="datetime-local"
                    value={formData.matchDate ? new Date(formData.matchDate).toISOString().slice(0, 16) : ''}
                    onChange={(e) => setFormData({ ...formData, matchDate: new Date(e.target.value).toISOString() })}
                    className="w-full px-4 py-2 bg-[#0a1929] border border-[#1e3a52] rounded-lg text-white focus:outline-none focus:border-[#00ff88] transition-colors"
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
                {mode === 'create' ? 'Create Match' : 'Save Changes'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default function MatchesManagement() {
  const { matches, selectedMatches, addMatch, updateMatch, deleteMatch, deleteMultiple, toggleSelection, setSelectedMatches } = useMatchesStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [modalState, setModalState] = useState({ open: false, mode: null, match: null });

  const getClubById = (id) => clubs.find(c => c.id === id);
  const getTournamentById = (id) => tournaments.find(t => t.id === id);
  const getStadiumById = (id) => stadiums.find(s => s.id === id);

  const filteredMatches = useMemo(() => {
    return matches.filter(match => {
      const firstClub = getClubById(match.firstOpponent);
      const secondClub = getClubById(match.secondOpponent);
      const tournament = getTournamentById(match.tournament);
      const stadium = getStadiumById(match.stadium);
      
      const searchLower = searchTerm.toLowerCase();
      return (
        firstClub?.name.toLowerCase().includes(searchLower) ||
        secondClub?.name.toLowerCase().includes(searchLower) ||
        tournament?.name.toLowerCase().includes(searchLower) ||
        stadium?.name.toLowerCase().includes(searchLower)
      );
    });
  }, [matches, searchTerm]);

  const handleSave = (matchData) => {
    if (modalState.mode === 'create') {
      addMatch(matchData);
    } else if (modalState.mode === 'edit') {
      updateMatch({ ...matchData, id: modalState.match.id });
    }
    setModalState({ open: false, mode: null, match: null });
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this match?')) {
      deleteMatch(id);
    }
  };

  const handleBulkDelete = () => {
    if (confirm(`Are you sure you want to delete ${selectedMatches.length} match(es)?`)) {
      deleteMultiple(selectedMatches);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a1929] p-6">
      <div>
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="w-10 h-10 text-[#00ff88]" />
            <h1 className="text-4xl font-bold text-white">Matches Management</h1>
          </div>
          <p className="text-gray-400">Manage matches and their information</p>
        </div>

        {selectedMatches.length > 0 && (
          <div className="mb-4 bg-[#111d2d] border border-[#00ff88]/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-white font-medium">
                {selectedMatches.length} match{selectedMatches.length !== 1 ? 'es' : ''} selected
              </span>
              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedMatches([])}
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
                placeholder="Search by team, tournament, or stadium..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#0a1929] border border-[#1e3a52] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#00ff88] transition-colors"
              />
            </div>
            <button
              onClick={() => setModalState({ open: true, mode: 'create', match: null })}
              className="px-6 py-2.5 bg-[#00ff88] text-[#0a1929] font-semibold rounded-lg hover:bg-[#00dd77] transition-colors inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Match
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
                      checked={selectedMatches.length === filteredMatches.length && filteredMatches.length > 0}
                      onChange={() => setSelectedMatches(selectedMatches.length === filteredMatches.length ? [] : filteredMatches.map(m => m.id))}
                      className="w-5 h-5 bg-[#0a1929] border border-[#1e3a52] rounded checked:bg-[#00ff88] checked:border-[#00ff88]"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#00ff88]">Match</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#00ff88]">Tournament</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#00ff88]">Stadium</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#00ff88]">Date & Time</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-[#00ff88]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMatches.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      No matches found
                    </td>
                  </tr>
                ) : (
                  filteredMatches.map((match) => {
                    const firstClub = getClubById(match.firstOpponent);
                    const secondClub = getClubById(match.secondOpponent);
                    const tournament = getTournamentById(match.tournament);
                    const stadium = getStadiumById(match.stadium);

                    return (
                      <tr key={match.id} className="border-b border-[#1e3a52] hover:bg-[#0a1929] transition-colors">
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedMatches.includes(match.id)}
                            onChange={() => toggleSelection(match.id)}
                            className="w-5 h-5 bg-[#0a1929] border border-[#1e3a52] rounded checked:bg-[#00ff88] checked:border-[#00ff88]"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-white/5 border border-[#1e3a52] rounded flex items-center justify-center overflow-hidden">
                              <img 
                                src={firstClub?.logo} 
                                alt={firstClub?.name}
                                className="w-full h-full object-contain p-0.5"
                                onError={(e) => {
                                  e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="32" height="32"%3E%3Crect fill="%23374151" width="32" height="32"/%3E%3C/svg%3E';
                                }}
                              />
                            </div>
                            <span className="text-white font-medium">{firstClub?.name}</span>
                            <span className="text-[#00ff88] font-bold">vs</span>
                            <div className="w-8 h-8 bg-white/5 border border-[#1e3a52] rounded flex items-center justify-center overflow-hidden">
                              <img 
                                src={secondClub?.logo} 
                                alt={secondClub?.name}
                                className="w-full h-full object-contain p-0.5"
                                onError={(e) => {
                                  e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="32" height="32"%3E%3Crect fill="%23374151" width="32" height="32"/%3E%3C/svg%3E';
                                }}
                              />
                            </div>
                            <span className="text-white font-medium">{secondClub?.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-300">{tournament?.name}</td>
                        <td className="px-6 py-4 text-gray-300">{stadium?.name}</td>
                        <td className="px-6 py-4 text-gray-300">
                          {new Date(match.matchDate).toLocaleDateString()} <br />
                          <span className="text-sm text-gray-500">{new Date(match.matchDate).toLocaleTimeString()}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setModalState({ open: true, mode: 'view', match })}
                              className="p-2 border border-[#1e3a52] text-gray-300 rounded-lg hover:bg-[#0a1929] hover:text-[#00ff88] transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setModalState({ open: true, mode: 'edit', match })}
                              className="p-2 border border-[#1e3a52] text-gray-300 rounded-lg hover:bg-[#0a1929] hover:text-[#00ff88] transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(match.id)}
                              className="p-2 border border-red-600/50 text-red-400 rounded-lg hover:bg-red-600/10 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 text-gray-400 text-sm">
          Showing {filteredMatches.length} of {matches.length} matches
        </div>
      </div>

      {modalState.open && (
        <MatchModal
          match={modalState.match}
          mode={modalState.mode}
          onClose={() => setModalState({ open: false, mode: null, match: null })}
          onSave={handleSave}
        />
      )}
    </div>
  );
}