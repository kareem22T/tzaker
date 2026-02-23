import React, { useMemo, useState } from 'react'
import { HelpCircle, Plus, Search, X } from 'lucide-react'

import CategoriesTable from './components/categories-table'
import CategoryForm from './categories/components/category-form'
import {
  useGetFaqCategoriesQuery,
  useCreateFaqCategoryMutation,
  useUpdateFaqCategoryMutation,
  useDeleteFaqCategoryMutation,
} from '../../store/api/faqsApi'
import type { FaqCategory } from '../../store/faqsSlice'

type ModalMode = 'view' | 'create' | 'edit' | null

export default function FaqCategoriesManagement() {
  const [searchTerm, setSearchTerm] = useState('')
  const [modalState, setModalState] = useState<{ open: boolean; mode: ModalMode; category: FaqCategory | null }>({ open: false, mode: null, category: null })

  const { data: categories = [], isError, refetch } = useGetFaqCategoriesQuery()
  const [createCategory, { isLoading: creating }] = useCreateFaqCategoryMutation()
  const [updateCategory, { isLoading: updating }] = useUpdateFaqCategoryMutation()
  const [deleteCategory, { isLoading: deleting }] = useDeleteFaqCategoryMutation()

  const filteredCategories = useMemo(() => {
    return categories.filter((c) =>
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.title_ar?.includes(searchTerm) ||
      (c.description || '').toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }, [categories, searchTerm])

  const handleSave = async (payload: {
    name: string
    name_ar?: string
    description?: string
    description_ar?: string
    icon?: File
    display_order?: number
  }) => {
    try {
      if (modalState.mode === 'create') {
        await createCategory(payload).unwrap()
      } else if (modalState.mode === 'edit' && modalState.category) {
        await updateCategory({ id: modalState.category.id, ...payload }).unwrap()
      }
      setModalState({ open: false, mode: null, category: null })
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async (id: string, title?: string) => {
    if (!confirm(`Are you sure you want to delete "${title || id}"? This will also delete all FAQs in this category.`)) return
    try {
      await deleteCategory(id).unwrap()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    // ✅ Match: same root padding as MatchesManagement — no redundant nested div
    <div className="p-6 min-h-screen">

      {/* Header — matches style of Matches page */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <HelpCircle className="w-8 h-8 text-[#00ff88]" />
          <h1 className="text-3xl font-bold text-white">FAQ Categories</h1>
        </div>
        <p className="text-gray-400">Manage FAQ categories and organize your help content</p>
      </div>

      {/* Toolbar — matches Matches page: same bg, border, padding, right-aligned button */}
      <div className="bg-[#111d2d] border border-[#1e3a52] rounded-lg p-4 mb-4 flex items-center gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#0a1929] border border-[#1e3a52] rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#00ff88] transition-colors"
          />
        </div>
        <button
          onClick={() => setModalState({ open: true, mode: 'create', category: null })}
          className="flex items-center gap-2 px-4 py-2 bg-[#00ff88] text-[#0a1929] font-semibold rounded-lg hover:bg-[#00dd77] text-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      {/* Table card — matches Matches page exactly */}
      <div className="bg-[#111d2d] border border-[#1e3a52] rounded-lg overflow-hidden">
        {isError && (
          <div className="p-8 text-center text-red-400">
            Failed to load categories.{' '}
            <button onClick={() => refetch()} className="underline">Retry</button>
          </div>
        )}
        <div className="overflow-x-auto">
          <CategoriesTable
            categories={filteredCategories}
            selectedCategories={new Set()}
            onSelectAll={() => {}}
            onToggleSelect={() => {}}
            onDelete={(id) => handleDelete(id)}
            allSelected={false}
            isDeleting={deleting}
          />
        </div>
      </div>

      {/* Footer count */}
      <div className="mt-4 text-gray-400 text-sm">
        Showing {filteredCategories.length} of {categories.length} categories
      </div>

      {/* Modal */}
      {modalState.open && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[99999999] p-4">
          <div className="bg-[#111d2d] border border-[#1e3a52] rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-[#111d2d] border-b border-[#1e3a52] px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">
                {modalState.mode === 'create'
                  ? 'Add New Category'
                  : modalState.mode === 'edit'
                  ? 'Edit Category'
                  : 'Category Details'}
              </h2>
              <button
                onClick={() => setModalState({ open: false, mode: null, category: null })}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {modalState.mode === 'view' ? (
              <div className="p-6 space-y-4">
                <div className="bg-[#0a1929] border border-[#1e3a52] rounded-lg p-6">
                  <div className="flex items-start gap-6 mb-6">
                    {modalState.category?.icon_url && (
                      <img
                        src={modalState.category.icon_url}
                        alt={modalState.category.title}
                        className="w-24 h-24 rounded-lg object-cover border-2 border-[#00ff88]"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-white mb-2">{modalState.category?.title}</h3>
                      {modalState.category?.title_ar && (
                        <p className="text-xl text-gray-300 mb-4" dir="rtl">{modalState.category?.title_ar}</p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Description (English)</p>
                      <p className="text-white leading-relaxed">{modalState.category?.description}</p>
                    </div>
                    {modalState.category?.description_ar && (
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Description (Arabic)</p>
                        <p className="text-white leading-relaxed" dir="rtl">{modalState.category?.description_ar}</p>
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#1e3a52]">
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Display Order</p>
                        <p className="text-white font-medium">{modalState.category?.order}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Created At</p>
                        <p className="text-white font-medium">
                          {modalState.category?.createdAt
                            ? new Date(modalState.category.createdAt).toLocaleDateString()
                            : ''}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6">
                <CategoryForm
                  initialData={modalState.category ?? undefined}
                  onSubmit={handleSave}
                  isSubmitting={creating || updating}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}