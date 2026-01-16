"use client"

import { useNavigate, useParams } from "react-router"
import { useGetFaqQuery, useUpdateFaqMutation } from "../../store/api/faqsApi"
import FaqForm from "./components/faq-form"

export default function EditFaqPage() {
  const params = useParams()
  const router = useNavigate()
  const faqId = params.id as string

  const { data: faq, isLoading: isFetching } = useGetFaqQuery(faqId)
  const [updateFaq, { isLoading: isUpdating }] = useUpdateFaqMutation()

  const handleSubmit = async (data: {
    categoryId: string
    question: string
    question_ar?: string
    answer: string
    answer_ar?: string
    order: number
  }) => {
    try {
      await updateFaq({
        id: faqId,
        faq_category_id: parseInt(data.categoryId),
        question: data.question,
        question_ar: data.question_ar,
        answer: data.answer,
        answer_ar: data.answer_ar,
        display_order: data.order,
      }).unwrap()
      router("/faqs/faqs-list")
    } catch (error: any) {
      console.error('Failed to update FAQ:', error)
      alert(error?.data?.message || 'Failed to update FAQ. Please try again.')
    }
  }

  if (isFetching) {
    return (
      <main className="min-h-screen py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
          </div>
          <p className="mt-4 text-gray-600 darkx:text-gray-400">Loading FAQ...</p>
        </div>
      </main>
    )
  }

  if (!faq) {
    return (
      <main className="min-h-screen py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl font-semibold text-gray-900 darkx:text-white mb-2">FAQ not found</h1>
          <button
            onClick={() => router("/faqs/faqs-list")}
            className="mt-4 px-6 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors"
          >
            Back to FAQs
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen py-8 sm:py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-semibold text-gray-900 darkx:text-white mb-2">Edit FAQ</h1>
          <p className="text-gray-600 darkx:text-gray-400 text-sm sm:text-base">Update question and answer</p>
        </div>

        {isUpdating && (
          <div className="mb-4 p-4 bg-brand-50 darkx:bg-brand-500/10 border border-brand-200 darkx:border-brand-500/20 rounded-lg text-brand-700 darkx:text-brand-400">
            Updating FAQ...
          </div>
        )}

        <FaqForm initialData={faq} onSubmit={handleSubmit} isSubmitting={isUpdating} />
      </div>
    </main>
  )
}