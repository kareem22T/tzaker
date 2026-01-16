import React, { useState, useMemo } from 'react';
import { Building, Plus, Search, Edit2, Trash2, X, Upload, Image } from 'lucide-react';

// Mock Redux-like state management
const useStadiumsStore = () => {
  const [stadiums, setStadiums] = useState([
    {
      id: "1",
      name: "Cairo International Stadium",
      city: "Cairo",
      country: "Egypt",
      levels: [
        {
          id: "l1",
          name: "Level A",
          image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23f0f0f0' width='400' height='300'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='18' fill='%23666'%3ELevel A Seating%3C/text%3E%3C/svg%3E"
        },
        {
          id: "l2",
          name: "Level B",
          image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23e8e8e8' width='400' height='300'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='18' fill='%23666'%3ELevel B Seating%3C/text%3E%3C/svg%3E"
        }
      ],
      createdAt: "2024-01-10T09:00:00Z",
    },
    {
      id: "2",
      name: "Wembley Stadium",
      city: "London",
      country: "United Kingdom",
      levels: [
        {
          id: "l3",
          name: "Lower Tier",
          image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23f0f0f0' width='400' height='300'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='18' fill='%23666'%3ELower Tier%3C/text%3E%3C/svg%3E"
        },
        {
          id: "l4",
          name: "Upper Tier",
          image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23e8e8e8' width='400' height='300'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='18' fill='%23666'%3EUpper Tier%3C/text%3E%3C/svg%3E"
        },
        {
          id: "l5",
          name: "VIP Section",
          image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23d8d8d8' width='400' height='300'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='18' fill='%23666'%3EVIP Section%3C/text%3E%3C/svg%3E"
        }
      ],
      createdAt: "2024-01-15T14:30:00Z",
    }
  ]);

  const [selectedStadiums, setSelectedStadiums] = useState([]);

  const addStadium = (stadium) => {
    const newStadium = {
      ...stadium,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setStadiums([newStadium, ...stadiums]);
  };

  const updateStadium = (updatedStadium) => {
    setStadiums(stadiums.map(s => s.id === updatedStadium.id ? { ...updatedStadium, updatedAt: new Date().toISOString() } : s));
  };

  const deleteStadium = (id) => {
    setStadiums(stadiums.filter(s => s.id !== id));
    setSelectedStadiums(selectedStadiums.filter(sid => sid !== id));
  };

  const deleteMultiple = (ids) => {
    setStadiums(stadiums.filter(s => !ids.includes(s.id)));
    setSelectedStadiums([]);
  };

  const toggleSelection = (id) => {
    setSelectedStadiums(prev => 
      prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
    );
  };

  return { stadiums, selectedStadiums, addStadium, updateStadium, deleteStadium, deleteMultiple, toggleSelection, setSelectedStadiums };
};

const StadiumForm = ({ stadium, onSave, onCancel, mode }) => {
  const [formData, setFormData] = useState(stadium || {
    name: '',
    city: '',
    country: '',
    levels: []
  });

  const handleImageUpload = (levelIndex, e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newLevels = [...formData.levels];
        newLevels[levelIndex].image = reader.result;
        setFormData({ ...formData, levels: newLevels });
      };
      reader.readAsDataURL(file);
    }
  };

  const addLevel = () => {
    setFormData({
      ...formData,
      levels: [...formData.levels, { id: Date.now().toString(), name: '', image: '' }]
    });
  };

  const removeLevel = (index) => {
    setFormData({
      ...formData,
      levels: formData.levels.filter((_, i) => i !== index)
    });
  };

  const updateLevel = (index, field, value) => {
    const newLevels = [...formData.levels];
    newLevels[index][field] = value;
    setFormData({ ...formData, levels: newLevels });
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.city || !formData.country) {
      alert('Please fill in all required stadium fields');
      return;
    }
    if (formData.levels.length === 0) {
      alert('Please add at least one level');
      return;
    }
    for (let level of formData.levels) {
      if (!level.name || !level.image) {
        alert('Please fill in all level fields and upload images');
        return;
      }
    }
    onSave(formData);
  };

  return (
    <div className="min-h-screen bg-[#0a1929] p-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Building className="w-10 h-10 text-[#00ff88]" />
            <h1 className="text-4xl font-bold text-white">
              {mode === 'create' ? 'Add New Stadium' : 'Edit Stadium'}
            </h1>
          </div>
          <p className="text-gray-400">Enter stadium details and configure levels</p>
        </div>

        <div className="space-y-6">
          <div className="bg-[#111d2d] border border-[#1e3a52] rounded-lg p-6">
            <h2 className="text-xl font-semibold text-[#00ff88] mb-4">Stadium Information</h2>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Stadium Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 bg-[#0a1929] border border-[#1e3a52] rounded-lg text-white focus:outline-none focus:border-[#00ff88] transition-colors"
                  placeholder="Enter stadium name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">City *</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-4 py-2 bg-[#0a1929] border border-[#1e3a52] rounded-lg text-white focus:outline-none focus:border-[#00ff88] transition-colors"
                  placeholder="Enter city"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Country *</label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="w-full px-4 py-2 bg-[#0a1929] border border-[#1e3a52] rounded-lg text-white focus:outline-none focus:border-[#00ff88] transition-colors"
                  placeholder="Enter country"
                />
              </div>
            </div>
          </div>

          <div className="bg-[#111d2d] border border-[#1e3a52] rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-[#00ff88]">Stadium Levels</h2>
              <button
                onClick={addLevel}
                className="px-4 py-2 bg-[#00ff88] text-[#0a1929] font-semibold rounded-lg hover:bg-[#00dd77] transition-colors inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Level
              </button>
            </div>

            {formData.levels.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No levels added yet. Click "Add Level" to get started.
              </div>
            ) : (
              <div className="space-y-4">
                {formData.levels.map((level, index) => (
                  <div key={level.id} className="bg-[#0a1929] border border-[#1e3a52] rounded-lg p-4">
                    <div className="flex items-start gap-4">
                      <div className="flex-1 space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Level Name *</label>
                          <input
                            type="text"
                            value={level.name}
                            onChange={(e) => updateLevel(index, 'name', e.target.value)}
                            className="w-full px-4 py-2 bg-[#111d2d] border border-[#1e3a52] rounded-lg text-white focus:outline-none focus:border-[#00ff88] transition-colors"
                            placeholder="e.g., Level A, VIP Section"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Seating Image *</label>
                          <div className="flex gap-3">
                            <label className="flex-1 cursor-pointer">
                              <div className="px-4 py-2 bg-[#111d2d] border border-[#1e3a52] rounded-lg text-gray-300 hover:border-[#00ff88] transition-colors inline-flex items-center gap-2">
                                <Upload className="w-4 h-4" />
                                {level.image ? 'Change Image' : 'Upload Image'}
                              </div>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageUpload(index, e)}
                                className="hidden"
                              />
                            </label>
                            {level.image && (
                              <button
                                onClick={() => updateLevel(index, 'image', '')}
                                className="px-4 py-2 border border-red-600/50 text-red-400 rounded-lg hover:bg-red-600/10 transition-colors"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                      {level.image && (
                        <div className="w-48 h-32 bg-[#111d2d] border border-[#1e3a52] rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={level.image}
                            alt={level.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <button
                        onClick={() => removeLevel(index)}
                        className="p-2 border border-red-600/50 text-red-400 rounded-lg hover:bg-red-600/10 transition-colors flex-shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3 justify-end">
            <button
              onClick={onCancel}
              className="px-6 py-2.5 border border-[#1e3a52] text-gray-300 rounded-lg hover:bg-[#111d2d] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-6 py-2.5 bg-[#00ff88] text-[#0a1929] font-semibold rounded-lg hover:bg-[#00dd77] transition-colors"
            >
              {mode === 'create' ? 'Create Stadium' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const StadiumsList = ({ stadiums, selectedStadiums, onEdit, onDelete, onBulkDelete, toggleSelection, setSelectedStadiums, onAdd, searchTerm, setSearchTerm }) => {
  return (
    <div className="min-h-screen bg-[#0a1929] p-6">
      <div>
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Building className="w-10 h-10 text-[#00ff88]" />
            <h1 className="text-4xl font-bold text-white">Stadiums Management</h1>
          </div>
          <p className="text-gray-400">Manage stadiums and their seating levels</p>
        </div>

        {selectedStadiums.length > 0 && (
          <div className="mb-4 bg-[#111d2d] border border-[#00ff88]/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-white font-medium">
                {selectedStadiums.length} stadium{selectedStadiums.length !== 1 ? 's' : ''} selected
              </span>
              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedStadiums([])}
                  className="px-4 py-2 border border-[#1e3a52] text-gray-300 rounded-lg hover:bg-[#0a1929] transition-colors inline-flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Clear
                </button>
                <button
                  onClick={onBulkDelete}
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
                placeholder="Search by name, city, or country..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#0a1929] border border-[#1e3a52] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#00ff88] transition-colors"
              />
            </div>
            <button
              onClick={onAdd}
              className="px-6 py-2.5 bg-[#00ff88] text-[#0a1929] font-semibold rounded-lg hover:bg-[#00dd77] transition-colors inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Stadium
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {stadiums.length === 0 ? (
            <div className="bg-[#111d2d] border border-[#1e3a52] rounded-lg p-12 text-center text-gray-500">
              No stadiums found
            </div>
          ) : (
            stadiums.map((stadium) => (
              <div key={stadium.id} className="bg-[#111d2d] border border-[#1e3a52] rounded-lg p-6 hover:border-[#00ff88]/30 transition-colors">
                <div className="flex items-start gap-4">
                  <input
                    type="checkbox"
                    checked={selectedStadiums.includes(stadium.id)}
                    onChange={() => toggleSelection(stadium.id)}
                    className="mt-1 w-5 h-5 bg-[#0a1929] border border-[#1e3a52] rounded checked:bg-[#00ff88] checked:border-[#00ff88]"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-1">{stadium.name}</h3>
                        <p className="text-gray-400">{stadium.city}, {stadium.country}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => onEdit(stadium)}
                          className="p-2 border border-[#1e3a52] text-gray-300 rounded-lg hover:bg-[#0a1929] hover:text-[#00ff88] transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDelete(stadium.id, stadium.name)}
                          className="p-2 border border-red-600/50 text-red-400 rounded-lg hover:bg-red-600/10 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-[#00ff88] mb-3">Seating Levels ({stadium.levels.length})</h4>
                      <div className="grid grid-cols-4 gap-3">
                        {stadium.levels.map((level) => (
                          <div key={level.id} className="bg-[#0a1929] border border-[#1e3a52] rounded-lg overflow-hidden">
                            <div className="aspect-video bg-gray-800 flex items-center justify-center">
                              {level.image ? (
                                <img src={level.image} alt={level.name} className="w-full h-full object-cover" />
                              ) : (
                                <Image className="w-8 h-8 text-gray-600" />
                              )}
                            </div>
                            <div className="p-2">
                              <p className="text-sm font-medium text-white text-center">{level.name}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-6 text-gray-400 text-sm">
          Showing {stadiums.length} stadium{stadiums.length !== 1 ? 's' : ''}
        </div>
      </div>
    </div>
  );
};

export default function StadiumsManagement() {
  const { stadiums, selectedStadiums, addStadium, updateStadium, deleteStadium, deleteMultiple, toggleSelection, setSelectedStadiums } = useStadiumsStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [view, setView] = useState('list');
  const [editingStadium, setEditingStadium] = useState(null);

  const filteredStadiums = useMemo(() => {
    return stadiums.filter(stadium =>
      stadium.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stadium.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stadium.country.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [stadiums, searchTerm]);

  const handleSave = (stadiumData) => {
    if (editingStadium) {
      updateStadium({ ...stadiumData, id: editingStadium.id });
    } else {
      addStadium(stadiumData);
    }
    setView('list');
    setEditingStadium(null);
  };

  const handleEdit = (stadium) => {
    setEditingStadium(stadium);
    setView('form');
  };

  const handleAdd = () => {
    setEditingStadium(null);
    setView('form');
  };

  const handleCancel = () => {
    setView('list');
    setEditingStadium(null);
  };

  const handleDelete = (id, name) => {
    if (confirm(`Are you sure you want to delete ${name}?`)) {
      deleteStadium(id);
    }
  };

  const handleBulkDelete = () => {
    if (confirm(`Are you sure you want to delete ${selectedStadiums.length} stadium(s)?`)) {
      deleteMultiple(selectedStadiums);
    }
  };

  if (view === 'form') {
    return (
      <StadiumForm
        stadium={editingStadium}
        onSave={handleSave}
        onCancel={handleCancel}
        mode={editingStadium ? 'edit' : 'create'}
      />
    );
  }

  return (
    <StadiumsList
      stadiums={filteredStadiums}
      selectedStadiums={selectedStadiums}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onBulkDelete={handleBulkDelete}
      toggleSelection={toggleSelection}
      setSelectedStadiums={setSelectedStadiums}
      onAdd={handleAdd}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
    />
  );
}