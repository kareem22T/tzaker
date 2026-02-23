import React, { useState, useMemo } from 'react'
import { Plus, Search, Edit2, Trash2, X, GripVertical, BarChart2 } from 'lucide-react'

import {
  useGetFaqsQuery,
  useCreateFaqMutation,
  useUpdateFaqMutation,
  useDeleteFaqMutation,
  useUpdateFaqOrderMutation,
  useGetFaqCategoriesQuery,
} from '../../store/api/faqsApi'
import type { Faq, FaqCategory } from '../../store/faqsSlice'

type FaqForm = {
  categoryId: string
  question: string
  question_ar?: string
  answer: string
  answer_ar?: string
  display_order?: number
  is_published?: boolean
}

const FaqModal = ({ faq, onClose, onSave, mode, categories }: {
  faq: Faq | null
  onClose: () => void
  onSave: (data: FaqForm) => Promise<void>
  mode: 'view' | 'create' | 'edit' | null
  categories: FaqCategory[]
}) => {
  const [formData, setFormData] = useState<FaqForm>(
    (faq
      ? {
          categoryId: faq.categoryId,
          question: faq.question,
          question_ar: faq.question_ar || '',
          answer: faq.answer,
          answer_ar: faq.answer_ar || '',
          display_order: faq.order || 1,
          is_published: faq.is_published ?? true,
        }
      : {
          categoryId: '',
          question: '',
          question_ar: '',
          answer: '',
          answer_ar: '',
          display_order: 1,
          is_published: true,
        }) as FaqForm,
  )

  const handleSubmit = async () => {
    if (!formData.categoryId || !formData.question || !formData.answer) {
      alert('Please fill in all required fields')
      return
    }
    await onSave(formData)
  }

  const category = categories.find((c) => c.id === formData.categoryId)

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-9999999 p-4">
      <div className="bg-[#111d2d] border border-[#1e3a52] rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-[#111d2d] border-b border-[#1e3a52] p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">{mode === 'create' ? 'Add New FAQ' : mode === 'edit' ? 'Edit FAQ' : 'FAQ Details'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors"><X className="w-6 h-6" /></button>
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
                  <p className="text-white text-xl font-semibold leading-relaxed">{formData.question}</p>
                </div>
                {formData.question_ar && (
                  <div>
                    <p className="text-sm text-gray-400 mb-2">Question (Arabic)</p>
                    <p className="text-white text-xl font-semibold leading-relaxed" dir="rtl">{formData.question_ar}</p>
                  </div>
                )}
                <div className="pt-4 border-t border-[#1e3a52]">
                  <p className="text-sm text-gray-400 mb-2">Answer (English)</p>
                  <p className="text-white leading-relaxed">{formData.answer}</p>
                </div>
                {formData.answer_ar && (
                  <div>
                    <p className="text-sm text-gray-400 mb-2">Answer (Arabic)</p>
                    <p className="text-white leading-relaxed" dir="rtl">{formData.answer_ar}</p>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#1e3a52]">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Display Order</p>
                    <p className="text-white font-medium">{formData.display_order}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Status</p>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${formData.is_published ? 'bg-green-600/20 text-green-400 border border-green-600/30' : 'bg-gray-600/20 text-gray-400 border border-gray-600/30'}`}>
                      {formData.is_published ? 'Published' : 'Draft'}
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
                  <select value={formData.categoryId} onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })} className="w-full px-4 py-2 bg-[#0a1929] border border-[#1e3a52] rounded-lg text-white focus:outline-none focus:border-[#00ff88] transition-colors">
                    <option value="">Select a category</option>
                    {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.title}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Question (English) *</label>
                  <input type="text" value={formData.question} onChange={(e) => setFormData({ ...formData, question: e.target.value })} className="w-full px-4 py-2 bg-[#0a1929] border border-[#1e3a52] rounded-lg text-white focus:outline-none focus:border-[#00ff88] transition-colors" placeholder="Enter the question..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Answer (English) *</label>
                  <textarea value={formData.answer} onChange={(e) => setFormData({ ...formData, answer: e.target.value })} rows={5} className="w-full px-4 py-2 bg-[#0a1929] border border-[#1e3a52] rounded-lg text-white focus:outline-none focus:border-[#00ff88] transition-colors resize-none" placeholder="Enter the answer..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Display Order</label>
                    <input type="number" min="1" value={formData.display_order} onChange={(e) => setFormData({ ...formData, display_order: Number(e.target.value) })} className="w-full px-4 py-2 bg-[#0a1929] border border-[#1e3a52] rounded-lg text-white focus:outline-none focus:border-[#00ff88] transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                    <select value={formData.is_published ? 'true' : 'false'} onChange={(e) => setFormData({ ...formData, is_published: e.target.value === 'true' })} className="w-full px-4 py-2 bg-[#0a1929] border border-[#1e3a52] rounded-lg text-white focus:outline-none focus:border-[#00ff88] transition-colors">
                      <option value="true">Published</option>
                      <option value="false">Draft</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-4 border-t border-[#1e3a52]">
              <button onClick={onClose} className="px-6 py-2.5 border border-[#1e3a52] text-gray-300 rounded-lg hover:bg-[#0a1929] transition-colors">Cancel</button>
              <button onClick={handleSubmit} className="px-6 py-2.5 bg-[#00ff88] text-[#0a1929] font-semibold rounded-lg hover:bg-[#00dd77] transition-colors">{mode === 'create' ? 'Create FAQ' : 'Save Changes'}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const DraggableFaqCard = ({ faq, categoryTitle, onEdit, onDelete, onDragStart, onDragEnd, onDragOver }) => {
  return (
    <div draggable onDragStart={(e) => onDragStart(e, faq)} onDragEnd={onDragEnd} onDragOver={onDragOver} onDrop={(e) => { e.preventDefault(); onDragEnd(e, faq) }} className="bg-[#111d2d] border border-[#1e3a52] rounded-lg p-6 hover:border-[#00ff88]/50 transition-all cursor-move">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 cursor-grab active:cursor-grabbing text-gray-400 hover:text-[#00ff88] mt-1"><GripVertical className="w-5 h-5" /></div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs px-2 py-1 bg-[#00ff88]/10 text-[#00ff88] rounded border border-[#00ff88]/30">{categoryTitle}</span>
            <span className={`text-xs px-2 py-1 rounded ${faq.is_published ? 'bg-green-600/20 text-green-400 border border-green-600/30' : 'bg-gray-600/20 text-gray-400 border border-gray-600/30'}`}>{faq.is_published ? 'Published' : 'Draft'}</span>
          </div>
          <h3 className="text-white font-semibold text-lg mb-2">{faq.question}</h3>
          <p className="text-gray-400 text-sm line-clamp-2">{faq.answer}</p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button onClick={() => onEdit(faq)} className="p-2 border border-[#1e3a52] text-gray-300 rounded-lg hover:bg-[#0a1929] hover:text-[#00ff88] transition-colors"><Edit2 className="w-4 h-4" /></button>
          <button onClick={() => onDelete(faq.id)} className="p-2 border border-red-600/50 text-red-400 rounded-lg hover:bg-red-600/10 transition-colors"><Trash2 className="w-4 h-4" /></button>
        </div>
      </div>
    </div>
  )
}

export default function FaqsManagement() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [modalState, setModalState] = useState<{ open: boolean; mode: 'view' | 'create' | 'edit' | null; faq: Faq | null }>({ open: false, mode: null, faq: null })
  const [draggedItem, setDraggedItem] = useState<Faq | null>(null)

  const { data: categories = [] } = useGetFaqCategoriesQuery()
  const { data: faqs = [] } = useGetFaqsQuery()
  const [createFaq] = useCreateFaqMutation()
  const [updateFaq] = useUpdateFaqMutation()
  const [deleteFaq] = useDeleteFaqMutation()
  const [updateFaqOrder] = useUpdateFaqOrderMutation()

  const handleSave = async (faqData: FaqForm) => {
    try {
      if (modalState.mode === 'create') {
        await createFaq({
          categoryId: faqData.categoryId,
          question: faqData.question,
          question_ar: faqData.question_ar,
          answer: faqData.answer,
          answer_ar: faqData.answer_ar,
          display_order: faqData.display_order || 1,
          is_published: faqData.is_published !== false,
        }).unwrap()
      } else if (modalState.mode === 'edit' && modalState.faq) {
        await updateFaq({
          id: modalState.faq.id,
          categoryId: faqData.categoryId,
          question: faqData.question,
          question_ar: faqData.question_ar,
          answer: faqData.answer,
          answer_ar: faqData.answer_ar,
          display_order: faqData.display_order,
          is_published: faqData.is_published !== false,
        }).unwrap()
      }
      setModalState({ open: false, mode: null, faq: null })
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this FAQ?')) return
    try {
      await deleteFaq(id).unwrap()
    } catch (err) {
      console.error(err)
    }
  }

  const handleDragStart = (e: React.DragEvent, faq: Faq) => {
    setDraggedItem(faq)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragEnd = async (_e: React.DragEvent, targetFaq: Faq) => {
    if (!draggedItem || !targetFaq || draggedItem.id === targetFaq.id) {
      setDraggedItem(null)
      return
    }

    if (draggedItem.categoryId !== targetFaq.categoryId) {
      alert('Cannot reorder FAQs across different categories')
      setDraggedItem(null)
      return
    }

    const categoryFaqs = faqs.filter((f) => f.categoryId === draggedItem.categoryId).sort((a, b) => a.order - b.order)
    const draggedIndex = categoryFaqs.findIndex((f) => f.id === draggedItem.id)
    const targetIndex = categoryFaqs.findIndex((f) => f.id === targetFaq.id)
    if (draggedIndex === -1 || targetIndex === -1) {
      setDraggedItem(null)
      return
    }

    const newOrder = [...categoryFaqs]
    const [removed] = newOrder.splice(draggedIndex, 1)
    newOrder.splice(targetIndex, 0, removed)

    try {
      await Promise.all(newOrder.map((f, idx) => updateFaqOrder({ id: f.id, order: idx + 1 }).unwrap()))
    } catch (err) {
      console.error(err)
    }

    setDraggedItem(null)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const categoryTitle = (id: string) => categories.find((c) => c.id === id)?.title || ''

  const sortedFaqs = useMemo(() => {
    return [...faqs].sort((a, b) => {
      if (a.categoryId !== b.categoryId) return a.categoryId.localeCompare(b.categoryId)
      return a.order - b.order
    })
  }, [faqs])

  return (
    <div className="min-h-screen bg-[#0a1929] p-6">
      <div>
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <BarChart2 className="w-10 h-10 text-[#00ff88]" />
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
                {categories.map((cat) => (
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
          {sortedFaqs.length === 0 ? (
            <div className="bg-[#111d2d] border border-[#1e3a52] rounded-lg p-12 text-center">
              <p className="text-gray-500">No FAQs found</p>
            </div>
          ) : (
            sortedFaqs.map((faq) => (
              <DraggableFaqCard
                key={faq.id}
                faq={faq}
                onEdit={(faq) => setModalState({ open: true, mode: 'edit', faq })}
                onDelete={handleDelete}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDragOver={handleDragOver}
                categoryTitle={categoryTitle(faq.categoryId)}
              />
            ))
          )}
        </div>

        <div className="mt-6 text-gray-400 text-sm">Showing {sortedFaqs.length} of {faqs.length} FAQs</div>
      </div>

      {modalState.open && (
        <FaqModal
          faq={modalState.faq}
          mode={modalState.mode}
          categories={categories}
          onClose={() => setModalState({ open: false, mode: null, faq: null })}
          onSave={handleSave}
        />
      )}
    </div>
  )
}