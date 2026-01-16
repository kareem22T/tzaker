import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface User {
  id: string
  // Personal Information
  fullName: string
  phone: string
  email: string
  gender: "male" | "female" | "other"
  age: number
  nationality: string
  country: string
  city: string
  // Passport and Visa Details
  passportNumber: string
  passportExpirationDate: string
  hasValidVisa: boolean
  visaType?: string
  // Metadata
  createdAt: string
  updatedAt?: string
}

interface UsersState {
  users: User[]
  selectedUsers: string[]
}

const initialState: UsersState = {
  users: [
    {
      id: "1",
      fullName: "Ahmed Hassan Mohamed",
      phone: "+20-100-1234567",
      email: "ahmed.hassan@example.com",
      gender: "male",
      age: 28,
      nationality: "Egyptian",
      country: "Egypt",
      city: "Cairo",
      passportNumber: "A12345678",
      passportExpirationDate: "2027-06-15",
      hasValidVisa: true,
      visaType: "Work Visa",
      createdAt: "2024-01-15T10:30:00Z",
    },
    {
      id: "2",
      fullName: "Sarah Johnson",
      phone: "+1-555-0102",
      email: "sarah.johnson@example.com",
      gender: "female",
      age: 32,
      nationality: "American",
      country: "United States",
      city: "Los Angeles",
      passportNumber: "B98765432",
      passportExpirationDate: "2026-03-20",
      hasValidVisa: false,
      createdAt: "2024-02-01T14:20:00Z",
    },
    {
      id: "3",
      fullName: "Mohammed Al-Rashid",
      phone: "+971-50-1234567",
      email: "mohammed.rashid@example.com",
      gender: "male",
      age: 35,
      nationality: "Emirati",
      country: "United Arab Emirates",
      city: "Dubai",
      passportNumber: "C45678901",
      passportExpirationDate: "2028-12-10",
      hasValidVisa: true,
      visaType: "Business Visa",
      createdAt: "2024-01-20T09:15:00Z",
    },
    {
      id: "4",
      fullName: "Elena Rodriguez",
      phone: "+34-612-345678",
      email: "elena.rodriguez@example.com",
      gender: "female",
      age: 27,
      nationality: "Spanish",
      country: "Spain",
      city: "Barcelona",
      passportNumber: "D23456789",
      passportExpirationDate: "2025-08-30",
      hasValidVisa: true,
      visaType: "Tourist Visa",
      createdAt: "2024-03-05T16:45:00Z",
    },
    {
      id: "5",
      fullName: "Yuki Tanaka",
      phone: "+81-90-1234-5678",
      email: "yuki.tanaka@example.com",
      gender: "other",
      age: 30,
      nationality: "Japanese",
      country: "Japan",
      city: "Tokyo",
      passportNumber: "E87654321",
      passportExpirationDate: "2029-01-25",
      hasValidVisa: false,
      createdAt: "2024-02-15T11:30:00Z",
    },
  ],
  selectedUsers: [],
}

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    addUser: (state, action: PayloadAction<Omit<User, "id" | "createdAt">>) => {
      const newUser: User = {
        ...action.payload,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      }
      state.users.unshift(newUser)
    },
    updateUser: (state, action: PayloadAction<User>) => {
      const index = state.users.findIndex((u) => u.id === action.payload.id)
      if (index !== -1) {
        state.users[index] = {
          ...action.payload,
          updatedAt: new Date().toISOString(),
        }
      }
    },
    deleteUser: (state, action: PayloadAction<string>) => {
      state.users = state.users.filter((u) => u.id !== action.payload)
      state.selectedUsers = state.selectedUsers.filter((id) => id !== action.payload)
    },
    deleteMultipleUsers: (state, action: PayloadAction<string[]>) => {
      state.users = state.users.filter((u) => !action.payload.includes(u.id))
      state.selectedUsers = []
    },
    toggleUserSelection: (state, action: PayloadAction<string>) => {
      const index = state.selectedUsers.indexOf(action.payload)
      if (index > -1) {
        state.selectedUsers.splice(index, 1)
      } else {
        state.selectedUsers.push(action.payload)
      }
    },
    selectAllUsers: (state) => {
      state.selectedUsers = state.users.map((u) => u.id)
    },
    clearUserSelection: (state) => {
      state.selectedUsers = []
    },
  },
})

export const {
  addUser,
  updateUser,
  deleteUser,
  deleteMultipleUsers,
  toggleUserSelection,
  selectAllUsers,
  clearUserSelection,
} = usersSlice.actions

export default usersSlice.reducer