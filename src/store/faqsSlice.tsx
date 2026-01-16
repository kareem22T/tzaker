import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface FaqCategory {
  id: string
  title: string
  title_ar?: string
  description?: string
  description_ar?: string
  iconImage?: string
  icon_url?: string
  order: number
  createdAt: string
  updatedAt: string
}

export interface Faq {
  id: string
  categoryId: string
  question: string
  question_ar?: string
  answer: string
  answer_ar?: string
  order: number
  createdAt: string
  updatedAt: string
}

interface FaqsState {
  categories: FaqCategory[]
  faqs: Faq[]
  selectedCategories: Set<string>
  loading: boolean
  error: string | null
}

const initialState: FaqsState = {
  categories: [],
  faqs: [],
  selectedCategories: new Set(),
  loading: false,
  error: null,
}

const faqsSlice = createSlice({
  name: "faqs",
  initialState,
  reducers: {
    // Category actions
    addCategory: (state, action: PayloadAction<FaqCategory>) => {
      state.categories.push(action.payload)
    },
    updateCategory: (state, action: PayloadAction<FaqCategory>) => {
      const index = state.categories.findIndex((c) => c.id === action.payload.id)
      if (index !== -1) {
        state.categories[index] = action.payload
      }
    },
    deleteCategory: (state, action: PayloadAction<string>) => {
      state.categories = state.categories.filter((c) => c.id !== action.payload)
      // Also delete all FAQs in this category
      state.faqs = state.faqs.filter((f) => f.categoryId !== action.payload)
    },
    deleteMultipleCategories: (state, action: PayloadAction<string[]>) => {
      state.categories = state.categories.filter((c) => !action.payload.includes(c.id))
      // Also delete all FAQs in these categories
      state.faqs = state.faqs.filter((f) => !action.payload.includes(f.categoryId))
    },
    toggleCategorySelection: (state, action: PayloadAction<string>) => {
      const newSet = new Set(state.selectedCategories)
      if (newSet.has(action.payload)) {
        newSet.delete(action.payload)
      } else {
        newSet.add(action.payload)
      }
      state.selectedCategories = newSet
    },
    selectAllCategories: (state) => {
      state.selectedCategories = new Set(state.categories.map((c) => c.id))
    },
    clearCategorySelection: (state) => {
      state.selectedCategories = new Set()
    },

    // FAQ actions
    addFaq: (state, action: PayloadAction<Faq>) => {
      state.faqs.push(action.payload)
    },
    updateFaq: (state, action: PayloadAction<Faq>) => {
      const index = state.faqs.findIndex((f) => f.id === action.payload.id)
      if (index !== -1) {
        state.faqs[index] = action.payload
      }
    },
    deleteFaq: (state, action: PayloadAction<string>) => {
      state.faqs = state.faqs.filter((f) => f.id !== action.payload)
    },
    deleteMultipleFaqs: (state, action: PayloadAction<string[]>) => {
      state.faqs = state.faqs.filter((f) => !action.payload.includes(f.id))
    },
  },
})

export const {
  addCategory,
  updateCategory,
  deleteCategory,
  deleteMultipleCategories,
  toggleCategorySelection,
  selectAllCategories,
  clearCategorySelection,
  addFaq,
  updateFaq,
  deleteFaq,
  deleteMultipleFaqs,
} = faqsSlice.actions

export default faqsSlice.reducer