import React, { useState, useMemo } from 'react';
import { HelpCircle, Plus, Search, Eye, Edit2, Trash2, X, Image as ImageIcon } from 'lucide-react';

// Mock Redux-like state management for FAQ Categories
const useFaqCategoriesStore = () => {
  const [categories, setCategories] = useState([
    {
      id: "1",
      title: "General Questions",
      title_ar: "أسئلة عامة",
      description: "Common questions about our services and platform",
      description_ar: "أسئلة شائعة حول خدماتنا ومنصتنا",
      icon_url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='40' fill='%2300ff88'/%3E%3Ctext x='50' y='50' text-anchor='middle' dy='.3em' font-size='40' fill='%230a1929' font-weight='bold'%3EG%3C/text%3E%3C/svg%3E",
      display_order: 1,
      createdAt: "2024-01-10T09:00:00Z",
    },
    {
      id: "2",
      title: "Account & Security",
      title_ar: "الحساب والأمان",
      description: "Questions about account management and security",
      description_ar: "أسئلة حول إدارة الحساب والأمان",
      icon_url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='40' fill='%2300ff88'/%3E%3Ctext x='50' y='50' text-anchor='middle' dy='.3em' font-size='40' fill='%230a1929' font-weight='bold'%3EA%3C/text%3E%3C/svg%3E",
      display_order: 2,
      createdAt: "2024-01-15T14:30:00Z",
    },
    {
      id: "3",
      title: "Tickets & Booking",
      title_ar: "التذاكر والحجز",
      description: "Information about ticket purchases and bookings",
      description_ar: "معلومات حول شراء التذاكر والحجوزات",
      icon_url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='40' fill='%2300ff88'/%3E%3Ctext x='50' y='50' text-anchor='middle' dy='.3em' font-size='40' fill='%230a1929' font-weight='bold'%3ET%3C/text%3E%3C/svg%3E",
      display_order: 3,
      createdAt: "2024-02-01T11:20:00Z",
    },
    {
      id: "4",
      title: "Payment & Refunds",
      title_ar: "الدفع والاسترداد",
      description: "Questions about payments, pricing, and refund policies",
      description_ar: "أسئلة حول المدفوعات والأسعار وسياسات الاسترداد",
      icon_url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='40' fill='%2300ff88'/%3E%3Ctext x='50' y='50' text-anchor='middle' dy='.3em' font-size='40' fill='%230a1929' font-weight='bold'%3EP%3C/text%3E%3C/svg%3E",
      display_order: 4,
      createdAt: "2024-02-10T16:45:00Z",
    },
    {
      id: "5",
      title: "Technical Support",
      title_ar: "الدعم الفني",
      description: "Help with technical issues and troubleshooting",
      description_ar: "المساعدة في المشاكل التقنية واستكشاف الأخطاء",
      icon_url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='40' fill='%2300ff88'/%3E%3Ctext x='50' y='50' text-anchor='middle' dy='.3em' font-size='40' fill='%230a1929' font-weight='bold'%3ES%3C/text%3E%3C/svg%3E",
      display_order: 5,
      createdAt: "2024-02-20T10:15:00Z",
    },
  ]);

  const [selectedCategories, setSelectedCategories] = useState([]);

  const addCategory = (category) => {
    const newCategory = {
      ...category,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setCategories([newCategory, ...categories]);
  };

  const updateCategory = (updatedCategory) => {
    setCategories(categories.map(c => c.id === updatedCategory.id ? { ...updatedCategory, updatedAt: new Date().toISOString() } : c));
  };

  const deleteCategory = (id) => {
    setCategories(categories.filter(c => c.id !== id));
    setSelectedCategories(selectedCategories.filter(cid => cid !== id));
  };

  const deleteMultiple = (ids) => {
    setCategories(categories.filter(c => !ids.includes(c.id)));
    setSelectedCategories([]);
  };

  const toggleSelection = (id) => {
    setSelectedCategories(prev => 
      prev.includes(id) ? prev.filter(cid => cid !== id) : [...prev, id]
    );
  };

  return { categories, selectedCategories, addCategory, updateCategory, deleteCategory, deleteMultiple, toggleSelection, setSelectedCategories };
};

const CategoryModal = ({ category, onClose, onSave, mode }) => {
  const [formData, setFormData] = useState(category || {
    title: '',
    title_ar: '',
    description: '',
    description_ar: '',
    icon_url: '',
    display_order: 1,
  });

  const [iconFile, setIconFile] = useState(null);
  const [iconPreview, setIconPreview] = useState(category?.icon_url || '');

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setIconFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setIconPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.description) {
      alert('Please fill in all required fields');
      return;
    }
    onSave({ ...formData, icon_url: iconPreview });
  };

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-9999999 p-4">
      <div className="bg-[#111d2d] border border-[#1e3a52] rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-[#111d2d] border-b border-[#1e3a52] p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">
            {mode === 'create' ? 'Add New Category' : mode === 'edit' ? 'Edit Category' : 'Category Details'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {mode === 'view' ? (
          <div className="p-6 space-y-4">
            <div className="bg-[#0a1929] border border-[#1e3a52] rounded-lg p-6">
              <div className="flex items-start gap-6 mb-6">
                {category.icon_url && (
                  <img
                    src={category.icon_url}
                    alt={category.title}
                    className="w-24 h-24 rounded-lg object-cover border-2 border-[#00ff88]"
                  />
                )}
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-2">{category.title}</h3>
                  {category.title_ar && (
                    <p className="text-xl text-gray-300 mb-4" dir="rtl">{category.title_ar}</p>
                  )}
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Description (English)</p>
                  <p className="text-white leading-relaxed">{category.description}</p>
                </div>
                {category.description_ar && (
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Description (Arabic)</p>
                    <p className="text-white leading-relaxed" dir="rtl">{category.description_ar}</p>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#1e3a52]">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Display Order</p>
                    <p className="text-white font-medium">{category.display_order}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Created At</p>
                    <p className="text-white font-medium">{new Date(category.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 space-y-4">
            <div className="bg-[#0a1929] border border-[#1e3a52] rounded-lg p-6">
              <h3 className="text-lg font-semibold text-[#00ff88] mb-4">Category Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Category Title (English) *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 bg-[#0a1929] border border-[#1e3a52] rounded-lg text-white focus:outline-none focus:border-[#00ff88] transition-colors"
                    placeholder="e.g., General Questions"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Category Title (Arabic)</label>
                  <input
                    type="text"
                    value={formData.title_ar}
                    onChange={(e) => setFormData({ ...formData, title_ar: e.target.value })}
                    className="w-full px-4 py-2 bg-[#0a1929] border border-[#1e3a52] rounded-lg text-white focus:outline-none focus:border-[#00ff88] transition-colors"
                    placeholder="مثال: أسئلة عامة"
                    dir="rtl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Description (English) *</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 bg-[#0a1929] border border-[#1e3a52] rounded-lg text-white focus:outline-none focus:border-[#00ff88] transition-colors resize-none"
                    placeholder="Brief description of this category..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Description (Arabic)</label>
                  <textarea
                    value={formData.description_ar}
                    onChange={(e) => setFormData({ ...formData, description_ar: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 bg-[#0a1929] border border-[#1e3a52] rounded-lg text-white focus:outline-none focus:border-[#00ff88] transition-colors resize-none"
                    placeholder="وصف موجز لهذه الفئة..."
                    dir="rtl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Category Icon</label>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/svg+xml,image/webp"
                    onChange={handleImageChange}
                    className="w-full px-4 py-2 bg-[#0a1929] border border-[#1e3a52] rounded-lg text-white focus:outline-none focus:border-[#00ff88] transition-colors file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-[#00ff88] file:text-[#0a1929] hover:file:bg-[#00dd77]"
                  />
                  {iconPreview && (
                    <div className="mt-3 flex items-center gap-3">
                      <span className="text-sm text-gray-400">Preview:</span>
                      <img src={iconPreview} alt="Icon preview" className="w-16 h-16 rounded-lg object-cover border border-[#1e3a52]" />
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Display Order</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
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
                {mode === 'create' ? 'Create Category' : 'Save Changes'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default function FaqCategoriesManagement() {
  const { categories, selectedCategories, addCategory, updateCategory, deleteCategory, deleteMultiple, toggleSelection, setSelectedCategories } = useFaqCategoriesStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [modalState, setModalState] = useState({ open: false, mode: null, category: null });

  const filteredCategories = useMemo(() => {
    return categories.filter(category =>
      category.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.title_ar?.includes(searchTerm) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [categories, searchTerm]);

  const handleSave = (categoryData) => {
    if (modalState.mode === 'create') {
      addCategory(categoryData);
    } else if (modalState.mode === 'edit') {
      updateCategory({ ...categoryData, id: modalState.category.id });
    }
    setModalState({ open: false, mode: null, category: null });
  };

  const handleDelete = (id, title) => {
    if (confirm(`Are you sure you want to delete "${title}"? This will also delete all FAQs in this category.`)) {
      deleteCategory(id);
    }
  };

  const handleBulkDelete = () => {
    if (confirm(`Are you sure you want to delete ${selectedCategories.length} categor${selectedCategories.length === 1 ? 'y' : 'ies'}?`)) {
      deleteMultiple(selectedCategories);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a1929] p-6">
      <div>
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <HelpCircle className="w-10 h-10 text-[#00ff88]" />
            <h1 className="text-4xl font-bold text-white">FAQ Categories</h1>
          </div>
          <p className="text-gray-400">Manage FAQ categories and organize your help content</p>
        </div>

        {selectedCategories.length > 0 && (
          <div className="mb-4 bg-[#111d2d] border border-[#00ff88]/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-white font-medium">
                {selectedCategories.length} categor{selectedCategories.length !== 1 ? 'ies' : 'y'} selected
              </span>
              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedCategories([])}
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
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#0a1929] border border-[#1e3a52] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#00ff88] transition-colors"
              />
            </div>
            <button
              onClick={() => setModalState({ open: true, mode: 'create', category: null })}
              className="px-6 py-2.5 bg-[#00ff88] text-[#0a1929] font-semibold rounded-lg hover:bg-[#00dd77] transition-colors inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Category
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
                      checked={selectedCategories.length === filteredCategories.length && filteredCategories.length > 0}
                      onChange={() => setSelectedCategories(selectedCategories.length === filteredCategories.length ? [] : filteredCategories.map(c => c.id))}
                      className="w-5 h-5 bg-[#0a1929] border border-[#1e3a52] rounded checked:bg-[#00ff88] checked:border-[#00ff88]"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#00ff88]">Category</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#00ff88]">Description</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#00ff88]">Icon</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#00ff88]">Order</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-[#00ff88]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      No categories found
                    </td>
                  </tr>
                ) : (
                  filteredCategories.map((category) => (
                    <tr key={category.id} className="border-b border-[#1e3a52] hover:bg-[#0a1929] transition-colors">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category.id)}
                          onChange={() => toggleSelection(category.id)}
                          className="w-5 h-5 bg-[#0a1929] border border-[#1e3a52] rounded checked:bg-[#00ff88] checked:border-[#00ff88]"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-white font-medium">{category.title}</p>
                          {category.title_ar && (
                            <p className="text-sm text-gray-400 mt-1" dir="rtl">{category.title_ar}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 max-w-md">
                        <div className="line-clamp-2 text-gray-300 text-sm">{category.description}</div>
                      </td>
                      <td className="px-6 py-4">
                        {category.icon_url ? (
                          <img
                            src={category.icon_url}
                            alt={category.title}
                            className="w-10 h-10 rounded-lg object-cover border border-[#1e3a52]"
                          />
                        ) : (
                          <ImageIcon className="w-10 h-10 text-gray-600" />
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-white font-medium">{category.display_order}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setModalState({ open: true, mode: 'view', category })}
                            className="p-2 border border-[#1e3a52] text-gray-300 rounded-lg hover:bg-[#0a1929] hover:text-[#00ff88] transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setModalState({ open: true, mode: 'edit', category })}
                            className="p-2 border border-[#1e3a52] text-gray-300 rounded-lg hover:bg-[#0a1929] hover:text-[#00ff88] transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(category.id, category.title)}
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
          Showing {filteredCategories.length} of {categories.length} categories
        </div>
      </div>

      {modalState.open && (
        <CategoryModal
          category={modalState.category}
          mode={modalState.mode}
          onClose={() => setModalState({ open: false, mode: null, category: null })}
          onSave={handleSave}
        />
      )}
    </div>
  );
}