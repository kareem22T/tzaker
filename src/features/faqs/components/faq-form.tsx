"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useGetFaqCategoriesQuery } from "../../../store/api/faqsApi"
import type { Faq } from "../../../store/faqsSlice"
import RichTextEditor from "../../../components/html-editor"

interface FaqFormProps {
  initialData?: Faq
  onSubmit: (data: {
    categoryId: string
    question: string
    question_ar?: string
    answer: string
    answer_ar?: string
    order: number
  }) => void
  isSubmitting?: boolean
}

export default function FaqForm({ initialData, onSubmit, isSubmitting = false }: FaqFormProps) {
  const { data: categories = [], isLoading: categoriesLoading } = useGetFaqCategoriesQuery()
  
  const [categoryId, setCategoryId] = useState(initialData?.categoryId || categories[0]?.id || "")
  const [question, setQuestion] = useState(initialData?.question || "")
  const [questionAr, setQuestionAr] = useState(initialData?.question_ar || "")
  const [answer, setAnswer] = useState(initialData?.answer || "")
  const [answerAr, setAnswerAr] = useState(initialData?.answer_ar || "")
  const [order, setOrder] = useState(initialData?.order || 1)

  // Update categoryId when categories load if not set
  useEffect(() => {
    if (!categoryId && categories.length > 0) {
      setCategoryId(categories[0].id)
    }
  }, [categories, categoryId])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      categoryId,
      question,
      question_ar: questionAr,
      answer,
      answer_ar: answerAr,
      order,
    })
  }

  if (categoriesLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
      </div>
    )
  }

  if (categories.length === 0) {
    return (
      <div className="bg-yellow-50 darkx:bg-yellow-500/10 border border-yellow-200 darkx:border-yellow-500/20 rounded-lg p-6 text-center">
        <p className="text-yellow-800 darkx:text-yellow-400">
          No categories available. Please create a category first before adding FAQs.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="bg-white darkx:bg-gray-800 border border-gray-200 darkx:border-gray-700 rounded-xl p-6 sm:p-8 space-y-6">
        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 darkx:text-gray-300 mb-2">Category</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full px-4 py-3 bg-white darkx:bg-gray-900 border border-gray-200 darkx:border-gray-700 rounded-lg text-gray-900 darkx:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 darkx:focus:ring-brand-400"
            required
            disabled={isSubmitting}
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.title}
              </option>
            ))}
          </select>
        </div>

        {/* Question - English */}
        <div>
          <label className="block text-sm font-medium text-gray-700 darkx:text-gray-300 mb-2">
            Question (English)
          </label>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Enter the question..."
            className="w-full px-4 py-3 bg-white darkx:bg-gray-900 border border-gray-200 darkx:border-gray-700 rounded-lg text-gray-900 darkx:text-white placeholder-gray-500 darkx:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 darkx:focus:ring-brand-400"
            required
            disabled={isSubmitting}
          />
        </div>

        {/* Question - Arabic */}
        <div>
          <label className="block text-sm font-medium text-gray-700 darkx:text-gray-300 mb-2">
            Question (Arabic)
          </label>
          <input
            type="text"
            value={questionAr}
            onChange={(e) => setQuestionAr(e.target.value)}
            placeholder="أدخل السؤال..."
            dir="rtl"
            className="w-full px-4 py-3 bg-white darkx:bg-gray-900 border border-gray-200 darkx:border-gray-700 rounded-lg text-gray-900 darkx:text-white placeholder-gray-500 darkx:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 darkx:focus:ring-brand-400"
            disabled={isSubmitting}
          />
        </div>

        {/* Answer - English */}
        <div>
          <label className="block text-sm font-medium text-gray-700 darkx:text-gray-300 mb-2">
            Answer (English)
          </label>
          <RichTextEditor value={answer} onChange={setAnswer} />
        </div>

        {/* Answer - Arabic */}
        <div>
          <label className="block text-sm font-medium text-gray-700 darkx:text-gray-300 mb-2">
            Answer (Arabic)
          </label>
          <RichTextEditor value={answerAr} onChange={setAnswerAr} />
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
            {isSubmitting ? 'Saving...' : (initialData ? "Update FAQ" : "Create FAQ")}
          </button>
        </div>
      </div>
    </form>
  )
}