import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface ContactMessage {
  id: string
  name: string
  firstName: string
  lastName: string
  email: string
  subject: string
  message: string
  isRead?: boolean
  createdAt: string
}

interface ContactMessagesState {
  selectedMessages: Set<string>
}

const initialState: ContactMessagesState = {
  selectedMessages: new Set(),
}

const contactMessagesSlice = createSlice({
  name: "contactMessages",
  initialState,
  reducers: {
    toggleMessageSelection: (state, action: PayloadAction<string>) => {
      const newSet = new Set(state.selectedMessages)
      if (newSet.has(action.payload)) {
        newSet.delete(action.payload)
      } else {
        newSet.add(action.payload)
      }
      state.selectedMessages = newSet
    },
    selectAllMessages: (state, action: PayloadAction<string[]>) => {
      state.selectedMessages = new Set(action.payload)
    },
    clearMessageSelection: (state) => {
      state.selectedMessages = new Set()
    },
  },
})

export const {
  toggleMessageSelection,
  selectAllMessages,
  clearMessageSelection,
} = contactMessagesSlice.actions

export default contactMessagesSlice.reducer