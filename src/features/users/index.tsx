import React, { useState, useMemo } from 'react';
import { Users, Plus, Search, Eye, Edit2, Trash2, X, Check } from 'lucide-react';

// Mock Redux-like state management
const useUsersStore = () => {
  const [users, setUsers] = useState([
    {
      id: "1",
      fullName: "Ahmed Hassan Mohamed",
      phone: "+20-100-1234567",
      email: "ahmed.hassan@example.com",
      gender: "male",
      age: 28,
      nationality: "Egyptian",
      country: "Egypt",
      city: "Cairo",
      passportNumber: "A12345678",
      passportExpirationDate: "2027-06-15",
      hasValidVisa: true,
      visaType: "Work Visa",
      createdAt: "2024-01-15T10:30:00Z",
    },
    {
      id: "2",
      fullName: "Sarah Johnson",
      phone: "+1-555-0102",
      email: "sarah.johnson@example.com",
      gender: "female",
      age: 32,
      nationality: "American",
      country: "United States",
      city: "Los Angeles",
      passportNumber: "B98765432",
      passportExpirationDate: "2026-03-20",
      hasValidVisa: false,
      createdAt: "2024-02-01T14:20:00Z",
    },
    {
      id: "3",
      fullName: "Mohammed Al-Rashid",
      phone: "+971-50-1234567",
      email: "mohammed.rashid@example.com",
      gender: "male",
      age: 35,
      nationality: "Emirati",
      country: "United Arab Emirates",
      city: "Dubai",
      passportNumber: "C45678901",
      passportExpirationDate: "2028-12-10",
      hasValidVisa: true,
      visaType: "Business Visa",
      createdAt: "2024-01-20T09:15:00Z",
    },
    {
      id: "4",
      fullName: "Elena Rodriguez",
      phone: "+34-612-345678",
      email: "elena.rodriguez@example.com",
      gender: "female",
      age: 27,
      nationality: "Spanish",
      country: "Spain",
      city: "Barcelona",
      passportNumber: "D23456789",
      passportExpirationDate: "2025-08-30",
      hasValidVisa: true,
      visaType: "Tourist Visa",
      createdAt: "2024-03-05T16:45:00Z",
    },
    {
      id: "5",
      fullName: "Yuki Tanaka",
      phone: "+81-90-1234-5678",
      email: "yuki.tanaka@example.com",
      gender: "other",
      age: 30,
      nationality: "Japanese",
      country: "Japan",
      city: "Tokyo",
      passportNumber: "E87654321",
      passportExpirationDate: "2029-01-25",
      hasValidVisa: false,
      createdAt: "2024-02-15T11:30:00Z",
    },
  ]);

  const [selectedUsers, setSelectedUsers] = useState([]);

  const addUser = (user) => {
    const newUser = {
      ...user,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setUsers([newUser, ...users]);
  };

  const updateUser = (updatedUser) => {
    setUsers(users.map(u => u.id === updatedUser.id ? { ...updatedUser, updatedAt: new Date().toISOString() } : u));
  };

  const deleteUser = (id) => {
    setUsers(users.filter(u => u.id !== id));
    setSelectedUsers(selectedUsers.filter(uid => uid !== id));
  };

  const deleteMultiple = (ids) => {
    setUsers(users.filter(u => !ids.includes(u.id)));
    setSelectedUsers([]);
  };

  const toggleSelection = (id) => {
    setSelectedUsers(prev => 
      prev.includes(id) ? prev.filter(uid => uid !== id) : [...prev, id]
    );
  };

  return { users, selectedUsers, addUser, updateUser, deleteUser, deleteMultiple, toggleSelection, setSelectedUsers };
};

const UserModal = ({ user, onClose, onSave, mode }) => {
  const [formData, setFormData] = useState(user || {
    fullName: '',
    phone: '',
    email: '',
    gender: 'male',
    age: '',
    nationality: '',
    country: '',
    city: '',
    passportNumber: '',
    passportExpirationDate: '',
    hasValidVisa: false,
    visaType: '',
  });

  const handleSubmit = () => {
    if (!formData.fullName || !formData.email || !formData.phone || !formData.age) {
      alert('Please fill in all required fields');
      return;
    }
    onSave({ ...formData, age: parseInt(formData.age) });
  };

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-9999999 p-4">
      <div className="bg-[#111d2d] border border-[#1e3a52] rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-[#111d2d] border-b border-[#1e3a52] p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">
            {mode === 'create' ? 'Add New User' : mode === 'edit' ? 'Edit User' : 'User Details'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {mode === 'view' ? (
          <div className="p-6 space-y-6">
            <div className="bg-[#0a1929] border border-[#1e3a52] rounded-lg p-6">
              <h3 className="text-lg font-semibold text-[#00ff88] mb-4">Personal Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Full Name</p>
                  <p className="text-white font-medium">{user.fullName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Email</p>
                  <p className="text-white font-medium">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Phone</p>
                  <p className="text-white font-medium">{user.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Gender</p>
                  <p className="text-white font-medium capitalize">{user.gender}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Age</p>
                  <p className="text-white font-medium">{user.age} years</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Nationality</p>
                  <p className="text-white font-medium">{user.nationality}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Country</p>
                  <p className="text-white font-medium">{user.country}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">City</p>
                  <p className="text-white font-medium">{user.city}</p>
                </div>
              </div>
            </div>

            <div className="bg-[#0a1929] border border-[#1e3a52] rounded-lg p-6">
              <h3 className="text-lg font-semibold text-[#00ff88] mb-4">Passport & Visa Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Passport Number</p>
                  <p className="text-white font-medium">{user.passportNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Expiration Date</p>
                  <p className="text-white font-medium">{new Date(user.passportExpirationDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Valid Visa</p>
                  <p className="text-white font-medium">{user.hasValidVisa ? 'Yes' : 'No'}</p>
                </div>
                {user.hasValidVisa && user.visaType && (
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Visa Type</p>
                    <p className="text-white font-medium">{user.visaType}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 space-y-6">
            <div className="bg-[#0a1929] border border-[#1e3a52] rounded-lg p-6">
              <h3 className="text-lg font-semibold text-[#00ff88] mb-4">Personal Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Full Name *</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-4 py-2 bg-[#0a1929] border border-[#1e3a52] rounded-lg text-white focus:outline-none focus:border-[#00ff88] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Phone *</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2 bg-[#0a1929] border border-[#1e3a52] rounded-lg text-white focus:outline-none focus:border-[#00ff88] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 bg-[#0a1929] border border-[#1e3a52] rounded-lg text-white focus:outline-none focus:border-[#00ff88] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Gender *</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-4 py-2 bg-[#0a1929] border border-[#1e3a52] rounded-lg text-white focus:outline-none focus:border-[#00ff88] transition-colors"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Age *</label>
                  <input
                    type="number"
                    min="18"
                    max="100"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    className="w-full px-4 py-2 bg-[#0a1929] border border-[#1e3a52] rounded-lg text-white focus:outline-none focus:border-[#00ff88] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Nationality *</label>
                  <input
                    type="text"
                    value={formData.nationality}
                    onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                    className="w-full px-4 py-2 bg-[#0a1929] border border-[#1e3a52] rounded-lg text-white focus:outline-none focus:border-[#00ff88] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Country *</label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full px-4 py-2 bg-[#0a1929] border border-[#1e3a52] rounded-lg text-white focus:outline-none focus:border-[#00ff88] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">City *</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-4 py-2 bg-[#0a1929] border border-[#1e3a52] rounded-lg text-white focus:outline-none focus:border-[#00ff88] transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="bg-[#0a1929] border border-[#1e3a52] rounded-lg p-6">
              <h3 className="text-lg font-semibold text-[#00ff88] mb-4">Passport & Visa Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Passport Number *</label>
                  <input
                    type="text"
                    value={formData.passportNumber}
                    onChange={(e) => setFormData({ ...formData, passportNumber: e.target.value })}
                    className="w-full px-4 py-2 bg-[#0a1929] border border-[#1e3a52] rounded-lg text-white focus:outline-none focus:border-[#00ff88] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Expiration Date *</label>
                  <input
                    type="date"
                    value={formData.passportExpirationDate}
                    onChange={(e) => setFormData({ ...formData, passportExpirationDate: e.target.value })}
                    className="w-full px-4 py-2 bg-[#0a1929] border border-[#1e3a52] rounded-lg text-white focus:outline-none focus:border-[#00ff88] transition-colors"
                  />
                </div>
                <div className="col-span-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.hasValidVisa}
                      onChange={(e) => setFormData({ ...formData, hasValidVisa: e.target.checked, visaType: e.target.checked ? formData.visaType : '' })}
                      className="w-5 h-5 bg-[#0a1929] border border-[#1e3a52] rounded checked:bg-[#00ff88] checked:border-[#00ff88] transition-colors"
                    />
                    <span className="text-sm font-medium text-gray-300">Has Valid Visa</span>
                  </label>
                </div>
                {formData.hasValidVisa && (
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Visa Type *</label>
                    <input
                      type="text"
                      value={formData.visaType}
                      onChange={(e) => setFormData({ ...formData, visaType: e.target.value })}
                      className="w-full px-4 py-2 bg-[#0a1929] border border-[#1e3a52] rounded-lg text-white focus:outline-none focus:border-[#00ff88] transition-colors"
                    />
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
                {mode === 'create' ? 'Create User' : 'Save Changes'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default function UsersManagement() {
  const { users, selectedUsers, addUser, updateUser, deleteUser, deleteMultiple, toggleSelection, setSelectedUsers } = useUsersStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [modalState, setModalState] = useState({ open: false, mode: null, user: null });

  const filteredUsers = useMemo(() => {
    return users.filter(user =>
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.nationality.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.city.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  const handleSave = (userData) => {
    if (modalState.mode === 'create') {
      addUser(userData);
    } else if (modalState.mode === 'edit') {
      updateUser({ ...userData, id: modalState.user.id });
    }
    setModalState({ open: false, mode: null, user: null });
  };

  const handleDelete = (id, name) => {
    if (confirm(`Are you sure you want to delete ${name}?`)) {
      deleteUser(id);
    }
  };

  const handleBulkDelete = () => {
    if (confirm(`Are you sure you want to delete ${selectedUsers.length} user(s)?`)) {
      deleteMultiple(selectedUsers);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a1929] p-6">
      <div>
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-10 h-10 text-[#00ff88]" />
            <h1 className="text-4xl font-bold text-white">Users Management</h1>
          </div>
          <p className="text-gray-400">Manage user accounts and information</p>
        </div>

        {selectedUsers.length > 0 && (
          <div className="mb-4 bg-[#111d2d] border border-[#00ff88]/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-white font-medium">
                {selectedUsers.length} user{selectedUsers.length !== 1 ? 's' : ''} selected
              </span>
              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedUsers([])}
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
                placeholder="Search by name, email, nationality, or city..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#0a1929] border border-[#1e3a52] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#00ff88] transition-colors"
              />
            </div>
            <button
              onClick={() => setModalState({ open: true, mode: 'create', user: null })}
              className="px-6 py-2.5 bg-[#00ff88] text-[#0a1929] font-semibold rounded-lg hover:bg-[#00dd77] transition-colors inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add User
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
                      checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                      onChange={() => setSelectedUsers(selectedUsers.length === filteredUsers.length ? [] : filteredUsers.map(u => u.id))}
                      className="w-5 h-5 bg-[#0a1929] border border-[#1e3a52] rounded checked:bg-[#00ff88] checked:border-[#00ff88]"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#00ff88]">Full Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#00ff88]">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#00ff88]">Nationality</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#00ff88]">City</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#00ff88]">Visa Status</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-[#00ff88]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      No users found
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b border-[#1e3a52] hover:bg-[#0a1929] transition-colors">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user.id)}
                          onChange={() => toggleSelection(user.id)}
                          className="w-5 h-5 bg-[#0a1929] border border-[#1e3a52] rounded checked:bg-[#00ff88] checked:border-[#00ff88]"
                        />
                      </td>
                      <td className="px-6 py-4 text-white font-medium">{user.fullName}</td>
                      <td className="px-6 py-4 text-gray-300">{user.email}</td>
                      <td className="px-6 py-4 text-gray-300">{user.nationality}</td>
                      <td className="px-6 py-4 text-gray-300">{user.city}</td>
                      <td className="px-6 py-4">
                        {user.hasValidVisa ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#00ff88]/20 text-[#00ff88] text-sm rounded-full">
                            <Check className="w-3 h-3" />
                            {user.visaType}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-600/20 text-gray-400 text-sm rounded-full">
                            <X className="w-3 h-3" />
                            No Visa
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setModalState({ open: true, mode: 'view', user })}
                            className="p-2 border border-[#1e3a52] text-gray-300 rounded-lg hover:bg-[#0a1929] hover:text-[#00ff88] transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setModalState({ open: true, mode: 'edit', user })}
                            className="p-2 border border-[#1e3a52] text-gray-300 rounded-lg hover:bg-[#0a1929] hover:text-[#00ff88] transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(user.id, user.fullName)}
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
          Showing {filteredUsers.length} of {users.length} users
        </div>
      </div>

      {modalState.open && (
        <UserModal
          user={modalState.user}
          mode={modalState.mode}
          onClose={() => setModalState({ open: false, mode: null, user: null })}
          onSave={handleSave}
        />
      )}
    </div>
  );
}