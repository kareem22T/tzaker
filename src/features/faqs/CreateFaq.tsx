"use client"

import { useNavigate } from "react-router"
import { useCreateFaqMutation } from "../../store/api/faqsApi"
import FaqForm from "./components/faq-form"

export default function CreateFaqPage() {
  const router = useNavigate()
  const [createFaq, { isLoading }] = useCreateFaqMutation()

  const handleSubmit = async (data: {
    categoryId: string
    question: string
    question_ar?: string
    answer: string
    answer_ar?: string
    order: number
  }) => {
    try {
      await createFaq({
        category_id: parseInt(data.categoryId),
        question: data.question,
        question_ar: data.question_ar,
        answer: data.answer,
        answer_ar: data.answer_ar,
        display_order: data.order,
        is_published: true,
      }).unwrap()
      router("/faqs/faqs-list")
    } catch (error: any) {
      console.error('Failed to create FAQ:', error)
      alert(error?.data?.message || 'Failed to create FAQ. Please try again.')
    }
  }

  return (
    <main className="min-h-screen py-8 sm:py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-semibold text-gray-900 darkx:text-white mb-2">Create FAQ</h1>
          <p className="text-gray-600 darkx:text-gray-400 text-sm sm:text-base">Add a new frequently asked question</p>
        </div>

        {isLoading && (
          <div className="mb-4 p-4 bg-brand-50 darkx:bg-brand-500/10 border border-brand-200 darkx:border-brand-500/20 rounded-lg text-brand-700 darkx:text-brand-400">
            Creating FAQ...
          </div>
        )}

        <FaqForm onSubmit={handleSubmit} isSubmitting={isLoading} />
      </div>
    </main>
  )
}