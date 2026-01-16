import React, { useState, useMemo } from 'react';
import { Plus, Search, Edit2, Trash2, X, GripVertical, ChartBarIcon } from 'lucide-react';

// Mock FAQ Categories
const faqCategories = [
  { id: "1", title: "General Questions", title_ar: "أسئلة عامة" },
  { id: "2", title: "Account & Security", title_ar: "الحساب والأمان" },
  { id: "3", title: "Tickets & Booking", title_ar: "التذاكر والحجز" },
  { id: "4", title: "Payment & Refunds", title_ar: "الدفع والاسترداد" },
  { id: "5", title: "Technical Support", title_ar: "الدعم الفني" },
];

// Mock Redux-like state management for FAQs
const useFaqsStore = () => {
  const [faqs, setFaqs] = useState([
    {
      id: "1",
      categoryId: "1",
      question: "What is this platform?",
      question_ar: "ما هي هذه المنصة؟",
      answer: "This is a comprehensive ticket booking platform for sports events and matches.",
      answer_ar: "هذه منصة شاملة لحجز تذاكر الأحداث الرياضية والمباريات.",
      display_order: 1,
      is_published: true,
      createdAt: "2024-01-10T09:00:00Z",
    },
    {
      id: "2",
      categoryId: "1",
      question: "How do I get started?",
      question_ar: "كيف أبدأ؟",
      answer: "Simply create an account, browse available matches, and book your tickets.",
      answer_ar: "ببساطة، قم بإنشاء حساب، تصفح المباريات المتاحة، واحجز تذاكرك.",
      display_order: 2,
      is_published: true,
      createdAt: "2024-01-10T09:05:00Z",
    },
    {
      id: "3",
      categoryId: "2",
      question: "How do I reset my password?",
      question_ar: "كيف يمكنني إعادة تعيين كلمة المرور الخاصة بي؟",
      answer: "Click on 'Forgot Password' on the login page and follow the instructions sent to your email.",
      answer_ar: "انقر على 'نسيت كلمة المرور' في صفحة تسجيل الدخول واتبع التعليمات المرسلة إلى بريدك الإلكتروني.",
      display_order: 1,
      is_published: true,
      createdAt: "2024-01-15T14:30:00Z",
    },
    {
      id: "4",
      categoryId: "2",
      question: "Is my payment information secure?",
      question_ar: "هل معلومات الدفع الخاصة بي آمنة؟",
      answer: "Yes, we use industry-standard encryption and secure payment gateways to protect your data.",
      answer_ar: "نعم، نستخدم التشفير القياسي في الصناعة وبوابات الدفع الآمنة لحماية بياناتك.",
      display_order: 2,
      is_published: true,
      createdAt: "2024-01-15T14:35:00Z",
    },
    {
      id: "5",
      categoryId: "3",
      question: "Can I book tickets for multiple matches at once?",
      question_ar: "هل يمكنني حجز تذاكر لعدة مباريات في وقت واحد؟",
      answer: "Yes, you can add multiple matches to your cart and complete the booking in one transaction.",
      answer_ar: "نعم، يمكنك إضافة عدة مباريات إلى سلة التسوق الخاصة بك وإكمال الحجز في معاملة واحدة.",
      display_order: 1,
      is_published: true,
      createdAt: "2024-02-01T11:20:00Z",
    },
    {
      id: "6",
      categoryId: "3",
      question: "How will I receive my tickets?",
      question_ar: "كيف سأستلم تذاكري؟",
      answer: "Tickets will be sent to your email as e-tickets. You can also access them in your account dashboard.",
      answer_ar: "سيتم إرسال التذاكر إلى بريدك الإلكتروني كتذاكر إلكترونية. يمكنك أيضًا الوصول إليها في لوحة التحكم الخاصة بحسابك.",
      display_order: 2,
      is_published: true,
      createdAt: "2024-02-01T11:25:00Z",
    },
    {
      id: "7",
      categoryId: "4",
      question: "What payment methods do you accept?",
      question_ar: "ما هي طرق الدفع التي تقبلونها؟",
      answer: "We accept credit cards, debit cards, and popular digital payment methods.",
      answer_ar: "نقبل بطاقات الائتمان وبطاقات الخصم وطرق الدفع الرقمية الشائعة.",
      display_order: 1,
      is_published: true,
      createdAt: "2024-02-10T16:45:00Z",
    },
    {
      id: "8",
      categoryId: "4",
      question: "What is your refund policy?",
      question_ar: "ما هي سياسة الاسترداد الخاصة بكم؟",
      answer: "Refunds are available up to 48 hours before the match, minus a small processing fee.",
      answer_ar: "تتوفر المبالغ المستردة حتى 48 ساعة قبل المباراة، مطروحًا منها رسوم معالجة صغيرة.",
      display_order: 2,
      is_published: true,
      createdAt: "2024-02-10T16:50:00Z",
    },
  ]);

  const addFaq = (faq) => {
    const newFaq = {
      ...faq,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setFaqs([newFaq, ...faqs]);
  };

  const updateFaq = (updatedFaq) => {
    setFaqs(faqs.map(f => f.id === updatedFaq.id ? { ...updatedFaq, updatedAt: new Date().toISOString() } : f));
  };

  const deleteFaq = (id) => {
    setFaqs(faqs.filter(f => f.id !== id));
  };

  const reorderFaqs = (categoryId, newOrder) => {
    setFaqs(faqs.map(faq => {
      if (faq.categoryId === categoryId) {
        const orderIndex = newOrder.findIndex(item => item.id === faq.id);
        if (orderIndex !== -1) {
          return { ...faq, display_order: orderIndex + 1 };
        }
      }
      return faq;
    }));
  };

  return { faqs, addFaq, updateFaq, deleteFaq, reorderFaqs };
};

const FaqModal = ({ faq, onClose, onSave, mode }) => {
  const [formData, setFormData] = useState(faq || {
    categoryId: '',
    question: '',
    question_ar: '',
    answer: '',
    answer_ar: '',
    display_order: 1,
    is_published: true,
  });

  const handleSubmit = () => {
    if (!formData.categoryId || !formData.question || !formData.answer) {
      alert('Please fill in all required fields');
      return;
    }
    onSave(formData);
  };

  const category = faqCategories.find(c => c.id === formData.categoryId);

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-9999999 p-4">
      <div className="bg-[#111d2d] border border-[#1e3a52] rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-[#111d2d] border-b border-[#1e3a52] p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">
            {mode === 'create' ? 'Add New FAQ' : mode === 'edit' ? 'Edit FAQ' : 'FAQ Details'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {mode === 'view' ? (
          <div className="p-6 space-y-4">
            <div className="bg-[#0a1929] border border-[#1e3a52] rounded-lg p-6">
              <div className="mb-4 pb-4 border-b border-[#1e3a52]">
                <span className="text-sm text-gray-400">Category</span>
                <p className="text-[#00ff88] font-semibold text-lg">{category?.title}</p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400 mb-2">Question (English)</p>
                  <p className="text-white text-xl font-semibold leading-relaxed">{faq.question}</p>
                </div>
                {faq.question_ar && (
                  <div>
                    <p className="text-sm text-gray-400 mb-2">Question (Arabic)</p>
                    <p className="text-white text-xl font-semibold leading-relaxed" dir="rtl">{faq.question_ar}</p>
                  </div>
                )}
                <div className="pt-4 border-t border-[#1e3a52]">
                  <p className="text-sm text-gray-400 mb-2">Answer (English)</p>
                  <p className="text-white leading-relaxed">{faq.answer}</p>
                </div>
                {faq.answer_ar && (
                  <div>
                    <p className="text-sm text-gray-400 mb-2">Answer (Arabic)</p>
                    <p className="text-white leading-relaxed" dir="rtl">{faq.answer_ar}</p>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#1e3a52]">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Display Order</p>
                    <p className="text-white font-medium">{faq.display_order}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Status</p>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      faq.is_published 
                        ? 'bg-green-600/20 text-green-400 border border-green-600/30' 
                        : 'bg-gray-600/20 text-gray-400 border border-gray-600/30'
                    }`}>
                      {faq.is_published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 space-y-4">
            <div className="bg-[#0a1929] border border-[#1e3a52] rounded-lg p-6">
              <h3 className="text-lg font-semibold text-[#00ff88] mb-4">FAQ Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Category *</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full px-4 py-2 bg-[#0a1929] border border-[#1e3a52] rounded-lg text-white focus:outline-none focus:border-[#00ff88] transition-colors"
                  >
                    <option value="">Select a category</option>
                    {faqCategories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Question (English) *</label>
                  <input
                    type="text"
                    value={formData.question}
                    onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                    className="w-full px-4 py-2 bg-[#0a1929] border border-[#1e3a52] rounded-lg text-white focus:outline-none focus:border-[#00ff88] transition-colors"
                    placeholder="Enter the question..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Question (Arabic)</label>
                  <input
                    type="text"
                    value={formData.question_ar}
                    onChange={(e) => setFormData({ ...formData, question_ar: e.target.value })}
                    className="w-full px-4 py-2 bg-[#0a1929] border border-[#1e3a52] rounded-lg text-white focus:outline-none focus:border-[#00ff88] transition-colors"
                    placeholder="أدخل السؤال..."
                    dir="rtl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Answer (English) *</label>
                  <textarea
                    value={formData.answer}
                    onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                    rows={5}
                    className="w-full px-4 py-2 bg-[#0a1929] border border-[#1e3a52] rounded-lg text-white focus:outline-none focus:border-[#00ff88] transition-colors resize-none"
                    placeholder="Enter the answer..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Answer (Arabic)</label>
                  <textarea
                    value={formData.answer_ar}
                    onChange={(e) => setFormData({ ...formData, answer_ar: e.target.value })}
                    rows={5}
                    className="w-full px-4 py-2 bg-[#0a1929] border border-[#1e3a52] rounded-lg text-white focus:outline-none focus:border-[#00ff88] transition-colors resize-none"
                    placeholder="أدخل الإجابة..."
                    dir="rtl"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
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
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                    <select
                      value={formData.is_published ? 'true' : 'false'}
                      onChange={(e) => setFormData({ ...formData, is_published: e.target.value === 'true' })}
                      className="w-full px-4 py-2 bg-[#0a1929] border border-[#1e3a52] rounded-lg text-white focus:outline-none focus:border-[#00ff88] transition-colors"
                    >
                      <option value="true">Published</option>
                      <option value="false">Draft</option>
                    </select>
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
                {mode === 'create' ? 'Create FAQ' : 'Save Changes'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Draggable FAQ Card Component
const DraggableFaqCard = ({ faq, onEdit, onDelete, onDragStart, onDragEnd, onDragOver }) => {
  const category = faqCategories.find(c => c.id === faq.categoryId);

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, faq)}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDrop={(e) => {
        e.preventDefault();
        onDragEnd(e, faq);
      }}
      className="bg-[#111d2d] border border-[#1e3a52] rounded-lg p-6 hover:border-[#00ff88]/50 transition-all cursor-move"
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 cursor-grab active:cursor-grabbing text-gray-400 hover:text-[#00ff88] mt-1">
          <GripVertical className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs px-2 py-1 bg-[#00ff88]/10 text-[#00ff88] rounded border border-[#00ff88]/30">
              {category?.title}
            </span>
            <span className={`text-xs px-2 py-1 rounded ${
              faq.is_published 
                ? 'bg-green-600/20 text-green-400 border border-green-600/30' 
                : 'bg-gray-600/20 text-gray-400 border border-gray-600/30'
            }`}>
              {faq.is_published ? 'Published' : 'Draft'}
            </span>
          </div>
          <h3 className="text-white font-semibold text-lg mb-2">{faq.question}</h3>
          <p className="text-gray-400 text-sm line-clamp-2">{faq.answer}</p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={() => onEdit(faq)}
            className="p-2 border border-[#1e3a52] text-gray-300 rounded-lg hover:bg-[#0a1929] hover:text-[#00ff88] transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(faq.id)}
            className="p-2 border border-red-600/50 text-red-400 rounded-lg hover:bg-red-600/10 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default function FaqsManagement() {
  const { faqs, addFaq, updateFaq, deleteFaq, reorderFaqs } = useFaqsStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [modalState, setModalState] = useState({ open: false, mode: null, faq: null });
  const [draggedItem, setDraggedItem] = useState(null);

  const filteredFaqs = useMemo(() => {
    return faqs
      .filter(faq => {
        const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            faq.question_ar?.includes(searchTerm) ||
                            faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = !selectedCategory || faq.categoryId === selectedCategory;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        if (a.categoryId !== b.categoryId) {
          return a.categoryId.localeCompare(b.categoryId);
        }
        return a.display_order - b.display_order;
      });
  }, [faqs, searchTerm, selectedCategory]);

  const handleSave = (faqData) => {
    if (modalState.mode === 'create') {
      addFaq(faqData);
    } else if (modalState.mode === 'edit') {
      updateFaq({ ...faqData, id: modalState.faq.id });
    }
    setModalState({ open: false, mode: null, faq: null });
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this FAQ?')) {
      deleteFaq(id);
    }
  };

  const handleDragStart = (e, faq) => {
    setDraggedItem(faq);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = (e, targetFaq) => {
    e.preventDefault();
    if (!draggedItem || !targetFaq || draggedItem.id === targetFaq.id) {
      setDraggedItem(null);
      return;
    }

    if (draggedItem.categoryId !== targetFaq.categoryId) {
      alert('Cannot reorder FAQs across different categories');
      setDraggedItem(null);
      return;
    }

    const categoryFaqs = filteredFaqs.filter(f => f.categoryId === draggedItem.categoryId);
    const draggedIndex = categoryFaqs.findIndex(f => f.id === draggedItem.id);
    const targetIndex = categoryFaqs.findIndex(f => f.id === targetFaq.id);

    if (draggedIndex === -1 || targetIndex === -1) {
      setDraggedItem(null);
      return;
    }

    const newOrder = [...categoryFaqs];
    const [removed] = newOrder.splice(draggedIndex, 1);
    newOrder.splice(targetIndex, 0, removed);

    reorderFaqs(draggedItem.categoryId, newOrder);
    setDraggedItem(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  return (
    <div className="min-h-screen bg-[#0a1929] p-6">
      <div>
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <ChartBarIcon className="w-10 h-10 text-[#00ff88]" />
            <h1 className="text-4xl font-bold text-white">FAQs Management</h1>
          </div>
          <p className="text-gray-400">Manage frequently asked questions and answers</p>
        </div>

        <div className="bg-[#111d2d] border border-[#1e3a52] rounded-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search FAQs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#0a1929] border border-[#1e3a52] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#00ff88] transition-colors"
              />
            </div>
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#0a1929] border border-[#1e3a52] rounded-lg text-white focus:outline-none focus:border-[#00ff88] transition-colors"
              >
                <option value="">All Categories</option>
                {faqCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button
            onClick={() => setModalState({ open: true, mode: 'create', faq: null })}
            className="mt-4 w-full md:w-auto px-6 py-2.5 bg-[#00ff88] text-[#0a1929] font-semibold rounded-lg hover:bg-[#00dd77] transition-colors inline-flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add New FAQ
          </button>
        </div>

        <div className="space-y-4">
          {filteredFaqs.length === 0 ? (
            <div className="bg-[#111d2d] border border-[#1e3a52] rounded-lg p-12 text-center">
              <p className="text-gray-500">No FAQs found</p>
            </div>
          ) : (
            filteredFaqs.map((faq) => (
              <DraggableFaqCard
                key={faq.id}
                faq={faq}
                onEdit={(faq) => setModalState({ open: true, mode: 'edit', faq })}
                onDelete={handleDelete}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDragOver={handleDragOver}
              />
            ))
          )}
        </div>

        <div className="mt-6 text-gray-400 text-sm">
          Showing {filteredFaqs.length} of {faqs.length} FAQs
        </div>
      </div>

      {modalState.open && (
        <FaqModal
          faq={modalState.faq}
          mode={modalState.mode}
          onClose={() => setModalState({ open: false, mode: null, faq: null })}
          onSave={handleSave}
        />
      )}
    </div>
  );
}