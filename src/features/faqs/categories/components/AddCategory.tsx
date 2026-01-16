"use client"

import { useNavigate } from "react-router"
import { useCreateFaqCategoryMutation } from "../../../../store/api/faqsApi"
import CategoryForm from "./category-form"

export default function AddCategoryPage() {
  const router = useNavigate()
  const [createCategory, { isLoading }] = useCreateFaqCategoryMutation()

  const handleSubmit = async (data: {
    name: string
    description?: string
    icon?: File
    display_order?: number
  }) => {
    try {
      await createCategory(data).unwrap()
      router("/faqs")
    } catch (error: any) {
      console.error('Failed to create category:', error)
      alert(error?.data?.message || 'Failed to create category. Please try again.')
    }
  }

  return (
    <main className="min-h-screen py-8 sm:py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-semibold text-gray-900 darkx:text-white mb-2">
            Create FAQ Category
          </h1>
          <p className="text-gray-600 darkx:text-gray-400 text-sm sm:text-base">
            Add a new FAQ category with icon and description
          </p>
        </div>

        {isLoading && (
          <div className="mb-4 p-4 bg-brand-50 darkx:bg-brand-500/10 border border-brand-200 darkx:border-brand-500/20 rounded-lg text-brand-700 darkx:text-brand-400">
            Creating category...
          </div>
        )}

        <CategoryForm onSubmit={handleSubmit} isSubmitting={isLoading} />
      </div>
    </main>
  )
}