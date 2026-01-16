import React, { useState, useMemo } from 'react';
import { Ticket, Plus, Search, Eye, Edit2, Trash2, X } from 'lucide-react';

// Dummy data for matches
const matches = [
  {
    id: "1",
    firstOpponent: "Manchester United",
    secondOpponent: "Real Madrid",
    firstOpponentLogo: "https://upload.wikimedia.org/wikipedia/en/7/7a/Manchester_United_FC_crest.svg",
    secondOpponentLogo: "https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg",
    tournament: "Summer Championship 2024",
    stadium: "Old Trafford",
    matchDate: "2024-03-15T18:00:00Z",
  },
  {
    id: "2",
    firstOpponent: "FC Barcelona",
    secondOpponent: "Bayern Munich",
    firstOpponentLogo: "https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona_%28crest%29.svg",
    secondOpponentLogo: "https://upload.wikimedia.org/wikipedia/commons/1/1b/FC_Bayern_M%C3%BCnchen_logo_%282017%29.svg",
    tournament: "Spring League Finals",
    stadium: "Camp Nou",
    matchDate: "2024-03-20T20:00:00Z",
  },
  {
    id: "3",
    firstOpponent: "Liverpool FC",
    secondOpponent: "Manchester United",
    firstOpponentLogo: "https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg",
    secondOpponentLogo: "https://upload.wikimedia.org/wikipedia/en/7/7a/Manchester_United_FC_crest.svg",
    tournament: "Summer Championship 2024",
    stadium: "Anfield",
    matchDate: "2024-04-01T19:00:00Z",
  },
];

// Dummy data for stadiums with levels
const stadiums = [
  {
    id: "1",
    name: "Old Trafford",
    levels: [
      { id: "l1", name: "Level A" },
      { id: "l2", name: "Level B" },
      { id: "l3", name: "VIP Section" },
    ],
  },
  {
    id: "2",
    name: "Camp Nou",
    levels: [
      { id: "l4", name: "Lower Tier" },
      { id: "l5", name: "Upper Tier" },
      { id: "l6", name: "Premium Seats" },
    ],
  },
  {
    id: "3",
    name: "Anfield",
    levels: [
      { id: "l7", name: "The Kop" },
      { id: "l8", name: "Main Stand" },
      { id: "l9", name: "VIP Lounge" },
    ],
  },
  {
    id: "4",
    name: "Wembley Stadium",
    levels: [
      { id: "l10", name: "Lower Tier" },
      { id: "l11", name: "Upper Tier" },
      { id: "l12", name: "Club Wembley" },
    ],
  },
];

// Mock Redux-like state management
const useTicketsStore = () => {
  const [tickets, setTickets] = useState([
    {
      id: "1",
      matchId: "1",
      stadiumLevel: "l1",
      price: 150,
      availableQuantity: 500,
      totalQuantity: 500,
      createdAt: "2024-01-10T09:00:00Z",
    },
    {
      id: "2",
      matchId: "1",
      stadiumLevel: "l2",
      price: 100,
      availableQuantity: 350,
      totalQuantity: 800,
      createdAt: "2024-01-10T09:05:00Z",
    },
    {
      id: "3",
      matchId: "1",
      stadiumLevel: "l3",
      price: 300,
      availableQuantity: 80,
      totalQuantity: 100,
      createdAt: "2024-01-10T09:10:00Z",
    },
    {
      id: "4",
      matchId: "2",
      stadiumLevel: "l4",
      price: 120,
      availableQuantity: 600,
      totalQuantity: 1000,
      createdAt: "2024-01-15T14:30:00Z",
    },
    {
      id: "5",
      matchId: "2",
      stadiumLevel: "l5",
      price: 80,
      availableQuantity: 450,
      totalQuantity: 1200,
      createdAt: "2024-01-15T14:35:00Z",
    },
    {
      id: "6",
      matchId: "2",
      stadiumLevel: "l6",
      price: 250,
      availableQuantity: 40,
      totalQuantity: 50,
      createdAt: "2024-01-15T14:40:00Z",
    },
    {
      id: "7",
      matchId: "3",
      stadiumLevel: "l7",
      price: 140,
      availableQuantity: 0,
      totalQuantity: 700,
      createdAt: "2024-02-01T11:20:00Z",
    },
    {
      id: "8",
      matchId: "3",
      stadiumLevel: "l8",
      price: 180,
      availableQuantity: 250,
      totalQuantity: 600,
      createdAt: "2024-02-01T11:25:00Z",
    },
  ]);

  const [selectedTickets, setSelectedTickets] = useState([]);

  const addTicket = (ticket) => {
    const newTicket = {
      ...ticket,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setTickets([newTicket, ...tickets]);
  };

  const updateTicket = (updatedTicket) => {
    setTickets(tickets.map(t => t.id === updatedTicket.id ? { ...updatedTicket, updatedAt: new Date().toISOString() } : t));
  };

  const deleteTicket = (id) => {
    setTickets(tickets.filter(t => t.id !== id));
    setSelectedTickets(selectedTickets.filter(tid => tid !== id));
  };

  const deleteMultiple = (ids) => {
    setTickets(tickets.filter(t => !ids.includes(t.id)));
    setSelectedTickets([]);
  };

  const toggleSelection = (id) => {
    setSelectedTickets(prev => 
      prev.includes(id) ? prev.filter(tid => tid !== id) : [...prev, id]
    );
  };

  return { tickets, selectedTickets, addTicket, updateTicket, deleteTicket, deleteMultiple, toggleSelection, setSelectedTickets };
};

const TicketModal = ({ ticket, onClose, onSave, mode }) => {
  const [formData, setFormData] = useState(ticket || {
    matchId: '',
    stadiumLevel: '',
    price: '',
    availableQuantity: '',
    totalQuantity: '',
  });

  const [selectedMatch, setSelectedMatch] = useState(null);

  React.useEffect(() => {
    if (formData.matchId) {
      const match = matches.find(m => m.id === formData.matchId);
      setSelectedMatch(match);
    }
  }, [formData.matchId]);

  const getStadiumForMatch = () => {
    if (!selectedMatch) return null;
    return stadiums.find(s => s.name === selectedMatch.stadium);
  };

  const handleSubmit = () => {
    if (!formData.matchId || !formData.stadiumLevel || !formData.price || !formData.availableQuantity || !formData.totalQuantity) {
      alert('Please fill in all required fields');
      return;
    }
    
    const numericData = {
      ...formData,
      price: parseFloat(formData.price),
      availableQuantity: parseInt(formData.availableQuantity),
      totalQuantity: parseInt(formData.totalQuantity),
    };

    if (numericData.availableQuantity > numericData.totalQuantity) {
      alert('Available quantity cannot exceed total quantity');
      return;
    }

    onSave(numericData);
  };

  const match = matches.find(m => m.id === formData.matchId);
  const stadium = getStadiumForMatch();
  const level = stadium?.levels.find(l => l.id === formData.stadiumLevel);

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-9999999 p-4">
      <div className="bg-[#111d2d] border border-[#1e3a52] rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-[#111d2d] border-b border-[#1e3a52] p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">
            {mode === 'create' ? 'Add New Ticket' : mode === 'edit' ? 'Edit Ticket' : 'Ticket Details'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {mode === 'view' ? (
          <div className="p-6 space-y-4">
            <div className="bg-[#0a1929] border border-[#1e3a52] rounded-lg p-6">
              <h3 className="text-lg font-semibold text-[#00ff88] mb-4">Match Information</h3>
              {match && (
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-[#111d2d] rounded-lg">
                    <img src={match.firstOpponentLogo} alt={match.firstOpponent} className="w-12 h-12 object-contain" />
                    <span className="text-white font-bold text-xl">{match.firstOpponent}</span>
                    <span className="text-[#00ff88] font-bold text-2xl mx-4">VS</span>
                    <span className="text-white font-bold text-xl">{match.secondOpponent}</span>
                    <img src={match.secondOpponentLogo} alt={match.secondOpponent} className="w-12 h-12 object-contain" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Tournament</p>
                      <p className="text-white font-medium">{match.tournament}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Stadium</p>
                      <p className="text-white font-medium">{match.stadium}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Match Date</p>
                      <p className="text-white font-medium">
                        {new Date(match.matchDate).toLocaleDateString()} at {new Date(match.matchDate).toLocaleTimeString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Stadium Level</p>
                      <p className="text-white font-medium">{level?.name}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-[#0a1929] border border-[#1e3a52] rounded-lg p-6">
              <h3 className="text-lg font-semibold text-[#00ff88] mb-4">Ticket Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Price</p>
                  <p className="text-white font-medium text-2xl">${ticket.price}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Availability</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-white font-bold text-2xl">{ticket.availableQuantity}</p>
                    <p className="text-gray-400">/ {ticket.totalQuantity}</p>
                  </div>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-400 mb-2">Sold Percentage</p>
                  <div className="w-full h-4 bg-[#111d2d] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#00ff88] transition-all"
                      style={{ width: `${((ticket.totalQuantity - ticket.availableQuantity) / ticket.totalQuantity) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {Math.round(((ticket.totalQuantity - ticket.availableQuantity) / ticket.totalQuantity) * 100)}% sold ({ticket.totalQuantity - ticket.availableQuantity} tickets)
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 space-y-4">
            <div className="bg-[#0a1929] border border-[#1e3a52] rounded-lg p-6">
              <h3 className="text-lg font-semibold text-[#00ff88] mb-4">Match Selection</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Select Match *</label>
                  <select
                    value={formData.matchId}
                    onChange={(e) => setFormData({ ...formData, matchId: e.target.value, stadiumLevel: '' })}
                    className="w-full px-4 py-2 bg-[#0a1929] border border-[#1e3a52] rounded-lg text-white focus:outline-none focus:border-[#00ff88] transition-colors"
                  >
                    <option value="">Select a match</option>
                    {matches.map((match) => (
                      <option key={match.id} value={match.id}>
                        {match.firstOpponent} vs {match.secondOpponent} - {new Date(match.matchDate).toLocaleDateString()}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedMatch && (
                  <div className="p-4 bg-[#111d2d] rounded-lg border border-[#1e3a52]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-400">Stadium:</span>
                      <span className="text-white font-medium">{selectedMatch.stadium}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Tournament:</span>
                      <span className="text-white font-medium">{selectedMatch.tournament}</span>
                    </div>
                  </div>
                )}

                {stadium && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Stadium Level *</label>
                    <select
                      value={formData.stadiumLevel}
                      onChange={(e) => setFormData({ ...formData, stadiumLevel: e.target.value })}
                      className="w-full px-4 py-2 bg-[#0a1929] border border-[#1e3a52] rounded-lg text-white focus:outline-none focus:border-[#00ff88] transition-colors"
                    >
                      <option value="">Select stadium level</option>
                      {stadium.levels.map((level) => (
                        <option key={level.id} value={level.id}>
                          {level.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-[#0a1929] border border-[#1e3a52] rounded-lg p-6">
              <h3 className="text-lg font-semibold text-[#00ff88] mb-4">Pricing & Availability</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Price (USD) *</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-2 bg-[#0a1929] border border-[#1e3a52] rounded-lg text-white focus:outline-none focus:border-[#00ff88] transition-colors"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Total Quantity *</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.totalQuantity}
                    onChange={(e) => setFormData({ ...formData, totalQuantity: e.target.value })}
                    className="w-full px-4 py-2 bg-[#0a1929] border border-[#1e3a52] rounded-lg text-white focus:outline-none focus:border-[#00ff88] transition-colors"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Available Quantity *</label>
                  <input
                    type="number"
                    min="0"
                    max={formData.totalQuantity || undefined}
                    value={formData.availableQuantity}
                    onChange={(e) => setFormData({ ...formData, availableQuantity: e.target.value })}
                    className="w-full px-4 py-2 bg-[#0a1929] border border-[#1e3a52] rounded-lg text-white focus:outline-none focus:border-[#00ff88] transition-colors"
                    placeholder="0"
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
                {mode === 'create' ? 'Create Ticket' : 'Save Changes'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default function TicketsManagement() {
  const { tickets, selectedTickets, addTicket, updateTicket, deleteTicket, deleteMultiple, toggleSelection, setSelectedTickets } = useTicketsStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [modalState, setModalState] = useState({ open: false, mode: null, ticket: null });

  const getMatchById = (matchId) => matches.find(m => m.id === matchId);
  const getStadiumLevelName = (matchId, levelId) => {
    const match = getMatchById(matchId);
    if (!match) return 'Unknown';
    const stadium = stadiums.find(s => s.name === match.stadium);
    const level = stadium?.levels.find(l => l.id === levelId);
    return level?.name || 'Unknown';
  };

  const filteredTickets = useMemo(() => {
    return tickets.filter(ticket => {
      const match = getMatchById(ticket.matchId);
      const levelName = getStadiumLevelName(ticket.matchId, ticket.stadiumLevel);
      const searchLower = searchTerm.toLowerCase();
      
      return (
        match?.firstOpponent.toLowerCase().includes(searchLower) ||
        match?.secondOpponent.toLowerCase().includes(searchLower) ||
        match?.stadium.toLowerCase().includes(searchLower) ||
        levelName.toLowerCase().includes(searchLower) ||
        ticket.price.toString().includes(searchLower)
      );
    });
  }, [tickets, searchTerm]);

  const handleSave = (ticketData) => {
    if (modalState.mode === 'create') {
      addTicket(ticketData);
    } else if (modalState.mode === 'edit') {
      updateTicket({ ...ticketData, id: modalState.ticket.id });
    }
    setModalState({ open: false, mode: null, ticket: null });
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this ticket?')) {
      deleteTicket(id);
    }
  };

  const handleBulkDelete = () => {
    if (confirm(`Are you sure you want to delete ${selectedTickets.length} ticket(s)?`)) {
      deleteMultiple(selectedTickets);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a1929] p-6">
      <div>
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Ticket className="w-10 h-10 text-[#00ff88]" />
            <h1 className="text-4xl font-bold text-white">Tickets Management</h1>
          </div>
          <p className="text-gray-400">Manage match tickets, pricing, and availability</p>
        </div>

        {selectedTickets.length > 0 && (
          <div className="mb-4 bg-[#111d2d] border border-[#00ff88]/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-white font-medium">
                {selectedTickets.length} ticket{selectedTickets.length !== 1 ? 's' : ''} selected
              </span>
              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedTickets([])}
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
                placeholder="Search by match, stadium, level, or price..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#0a1929] border border-[#1e3a52] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#00ff88] transition-colors"
              />
            </div>
            <button
              onClick={() => setModalState({ open: true, mode: 'create', ticket: null })}
              className="px-6 py-2.5 bg-[#00ff88] text-[#0a1929] font-semibold rounded-lg hover:bg-[#00dd77] transition-colors inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Ticket
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
                      checked={selectedTickets.length === filteredTickets.length && filteredTickets.length > 0}
                      onChange={() => setSelectedTickets(selectedTickets.length === filteredTickets.length ? [] : filteredTickets.map(t => t.id))}
                      className="w-5 h-5 bg-[#0a1929] border border-[#1e3a52] rounded checked:bg-[#00ff88] checked:border-[#00ff88]"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#00ff88]">Match</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#00ff88]">Stadium Level</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#00ff88]">Price</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#00ff88]">Available</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#00ff88]">Status</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-[#00ff88]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTickets.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      No tickets found
                    </td>
                  </tr>
                ) : (
                  filteredTickets.map((ticket) => {
                    const match = getMatchById(ticket.matchId);
                    const levelName = getStadiumLevelName(ticket.matchId, ticket.stadiumLevel);
                    const soldPercentage = ((ticket.totalQuantity - ticket.availableQuantity) / ticket.totalQuantity) * 100;
                    
                    return (
                      <tr key={ticket.id} className="border-b border-[#1e3a52] hover:bg-[#0a1929] transition-colors">
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedTickets.includes(ticket.id)}
                            onChange={() => toggleSelection(ticket.id)}
                            className="w-5 h-5 bg-[#0a1929] border border-[#1e3a52] rounded checked:bg-[#00ff88] checked:border-[#00ff88]"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-white font-medium">
                              {match?.firstOpponent} vs {match?.secondOpponent}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {match && new Date(match.matchDate).toLocaleDateString()}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-white font-medium">{levelName}</p>
                            <p className="text-xs text-gray-400">{match?.stadium}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-[#00ff88] font-bold text-lg">${ticket.price}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-white font-medium">{ticket.availableQuantity}</p>
                            <p className="text-xs text-gray-400">of {ticket.totalQuantity}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {ticket.availableQuantity === 0 ? (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-600/20 text-red-400 border border-red-600/30">
                              Sold Out
                            </span>
                          ) : soldPercentage > 80 ? (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-600/20 text-orange-400 border border-orange-600/30">
                              Low Stock
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-600/20 text-green-400 border border-green-600/30">
                              Available
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setModalState({ open: true, mode: 'view', ticket })}
                              className="p-2 border border-[#1e3a52] text-gray-300 rounded-lg hover:bg-[#0a1929] hover:text-[#00ff88] transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setModalState({ open: true, mode: 'edit', ticket })}
                              className="p-2 border border-[#1e3a52] text-gray-300 rounded-lg hover:bg-[#0a1929] hover:text-[#00ff88] transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(ticket.id)}
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
          Showing {filteredTickets.length} of {tickets.length} tickets
        </div>
      </div>

      {modalState.open && (
        <TicketModal
          ticket={modalState.ticket}
          mode={modalState.mode}
          onClose={() => setModalState({ open: false, mode: null, ticket: null })}
          onSave={handleSave}
        />
      )}
    </div>
  );
}