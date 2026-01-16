"use client"

import type React from "react"
import { useState } from "react"
import type { FaqCategory } from "../../../../store/faqsSlice"

interface CategoryFormProps {
  initialData?: FaqCategory
  onSubmit: (data: {
    name: string
    name_ar?: string
    description?: string
    description_ar?: string
    icon?: File
    display_order?: number
  }) => void
  isSubmitting?: boolean
}

export default function CategoryForm({ initialData, onSubmit, isSubmitting = false }: CategoryFormProps) {
  const [title, setTitle] = useState(initialData?.title || "")
  const [titleAr, setTitleAr] = useState(initialData?.title_ar || "")
  const [description, setDescription] = useState(initialData?.description || "")
  const [descriptionAr, setDescriptionAr] = useState(initialData?.description_ar || "")
  const [iconFile, setIconFile] = useState<File | null>(null)
  const [iconPreview, setIconPreview] = useState(initialData?.icon_url || "")
  const [order, setOrder] = useState(initialData?.order || 1)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setIconFile(file)
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setIconPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      name: title,
      name_ar: titleAr,
      description,
      description_ar: descriptionAr,
      icon: iconFile || undefined,
      display_order: order,
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="bg-white darkx:bg-gray-800 border border-gray-200 darkx:border-gray-700 rounded-xl p-6 sm:p-8 space-y-6">
        {/* Category Title - English */}
        <div>
          <label className="block text-sm font-medium text-gray-700 darkx:text-gray-300 mb-2">
            Category Title (English)
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., General, Technical Support"
            className="w-full px-4 py-3 bg-white darkx:bg-gray-900 border border-gray-200 darkx:border-gray-700 rounded-lg text-gray-900 darkx:text-white placeholder-gray-500 darkx:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 darkx:focus:ring-brand-400"
            required
            disabled={isSubmitting}
          />
        </div>

        {/* Category Title - Arabic */}
        <div>
          <label className="block text-sm font-medium text-gray-700 darkx:text-gray-300 mb-2">
            Category Title (Arabic)
          </label>
          <input
            type="text"
            value={titleAr}
            onChange={(e) => setTitleAr(e.target.value)}
            placeholder="مثال: عام، الدعم الفني"
            dir="rtl"
            className="w-full px-4 py-3 bg-white darkx:bg-gray-900 border border-gray-200 darkx:border-gray-700 rounded-lg text-gray-900 darkx:text-white placeholder-gray-500 darkx:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 darkx:focus:ring-brand-400"
            disabled={isSubmitting}
          />
        </div>

        {/* Description - English */}
        <div>
          <label className="block text-sm font-medium text-gray-700 darkx:text-gray-300 mb-2">
            Description (English)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief description of this category..."
            rows={3}
            className="w-full px-4 py-3 bg-white darkx:bg-gray-900 border border-gray-200 darkx:border-gray-700 rounded-lg text-gray-900 darkx:text-white placeholder-gray-500 darkx:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 darkx:focus:ring-brand-400 resize-none"
            disabled={isSubmitting}
          />
        </div>

        {/* Description - Arabic */}
        <div>
          <label className="block text-sm font-medium text-gray-700 darkx:text-gray-300 mb-2">
            Description (Arabic)
          </label>
          <textarea
            value={descriptionAr}
            onChange={(e) => setDescriptionAr(e.target.value)}
            placeholder="وصف موجز لهذه الفئة..."
            rows={3}
            dir="rtl"
            className="w-full px-4 py-3 bg-white darkx:bg-gray-900 border border-gray-200 darkx:border-gray-700 rounded-lg text-gray-900 darkx:text-white placeholder-gray-500 darkx:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 darkx:focus:ring-brand-400 resize-none"
            disabled={isSubmitting}
          />
        </div>

        {/* Category Icon */}
        <div>
          <label className="block text-sm font-medium text-gray-700 darkx:text-gray-300 mb-2">
            Category Icon {!initialData && <span className="text-error-500">*</span>}
          </label>
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <input
                type="file"
                accept="image/png,image/jpeg,image/svg+xml,image/webp"
                onChange={handleImageChange}
                className="flex-1 px-4 py-3 bg-white darkx:bg-gray-900 border border-gray-200 darkx:border-gray-700 rounded-lg text-gray-900 darkx:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 darkx:focus:ring-brand-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100"
                disabled={isSubmitting}
              />
            </div>
            <p className="text-xs text-gray-500 darkx:text-gray-400">
              Supported formats: PNG, JPG, SVG, WebP. Max size: 2MB
            </p>
            {iconPreview && (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600 darkx:text-gray-400">Preview:</span>
                <img
                  src={iconPreview}
                  alt="Icon preview"
                  className="w-12 h-12 rounded-lg object-cover border border-gray-200 darkx:border-gray-700"
                />
              </div>
            )}
          </div>
        </div>

        {/* Display Order */}
        <div>
          <label className="block text-sm font-medium text-gray-700 darkx:text-gray-300 mb-2">Display Order</label>
          <input
            type="number"
            value={order}
            onChange={(e) => setOrder(Number(e.target.value))}
            min="1"
            className="w-full px-4 py-3 bg-white darkx:bg-gray-900 border border-gray-200 darkx:border-gray-700 rounded-lg text-gray-900 darkx:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 darkx:focus:ring-brand-400"
            disabled={isSubmitting}
          />
        </div>

        <div className="flex gap-4 justify-end pt-4">
          <button
            type="submit"
            className="px-6 py-3 bg-brand-500 text-white rounded-lg hover:bg-brand-600 darkx:hover:bg-brand-400 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : (initialData ? "Update Category" : "Create Category")}
          </button>
        </div>
      </div>
    </form>
  )
}