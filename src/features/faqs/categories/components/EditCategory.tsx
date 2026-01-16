"use client"

import { useNavigate, useParams } from "react-router"
import { useGetFaqCategoriesQuery, useUpdateFaqCategoryMutation } from "../../../../store/api/faqsApi"
import CategoryForm from "./category-form"

export default function EditCategoryPage() {
  const params = useParams()
  const router = useNavigate()
  const categoryId = params.id as string

  const { data: categories, isLoading: isFetching } = useGetFaqCategoriesQuery()
  const [updateCategory, { isLoading: isUpdating }] = useUpdateFaqCategoryMutation()

  const category = categories?.find((c) => c.id === categoryId)

  const handleSubmit = async (data: {
    name: string
    description?: string
    icon?: File
    display_order?: number
  }) => {
    try {
      await updateCategory({ id: categoryId, ...data }).unwrap()
      router("/faqs")
    } catch (error: any) {
      console.error('Failed to update category:', error)
      alert(error?.data?.message || 'Failed to update category. Please try again.')
    }
  }

  if (isFetching) {
    return (
      <main className="min-h-screen py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
          </div>
          <p className="mt-4 text-gray-600 darkx:text-gray-400">Loading category...</p>
        </div>
      </main>
    )
  }

  if (!category) {
    return (
      <main className="min-h-screen py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl font-semibold text-gray-900 darkx:text-white mb-2">Category not found</h1>
          <button
            onClick={() => router("/faqs")}
            className="mt-4 px-6 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors"
          >
            Back to Categories
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen py-8 sm:py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-semibold text-gray-900 darkx:text-white mb-2">Edit Category</h1>
          <p className="text-gray-600 darkx:text-gray-400 text-sm sm:text-base">Update category details and icon</p>
        </div>

        {isUpdating && (
          <div className="mb-4 p-4 bg-brand-50 darkx:bg-brand-500/10 border border-brand-200 darkx:border-brand-500/20 rounded-lg text-brand-700 darkx:text-brand-400">
            Updating category...
          </div>
        )}

        <CategoryForm initialData={category} onSubmit={handleSubmit} isSubmitting={isUpdating} />
      </div>
    </main>
  )
}