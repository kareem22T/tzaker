import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface FormField {
  id: string
  type:
  | "text"
  | "email"
  | "number"
  | "textarea"
  | "select"
  | "radio"
  | "checkbox"
  | "file"
  | "date"
  | "tel"
  | "url"
  label: string
  label_ar?: string
  name: string
  placeholder?: string
  placeholder_ar?: string
  required?: boolean
  options?: Array<{ value: string; label: string }>
}

export interface Step {
  id: string
  title: string
  title_ar?: string
  description?: string
  description_ar?: string
  formFields: FormField[]
  order: number
}

export interface Department {
  id: string
  name: string
  name_ar?: string
  description?: string
  description_ar?: string
  icon?: File  // For uploading new icon
  icon_url?: string  // For displaying existing icon from server
  steps: Step[]
  steps_count?: number
  createdAt: string
  updatedAt: string
}

interface DepartmentsState {
  departments: Department[]
  selectedDepartments: string[]  // Changed from Set to array
  loading: boolean
  error: string | null
}

const initialState: DepartmentsState = {
  departments: [],
  selectedDepartments: [],  // Changed from Set to array
  loading: false,
  error: null,
}

const departmentsSlice = createSlice({
  name: "departments",
  initialState,
  reducers: {
    addDepartment: (state, action: PayloadAction<Department>) => {
      state.departments.push(action.payload)
    },
    updateDepartment: (state, action: PayloadAction<Department>) => {
      const index = state.departments.findIndex((d) => d.id === action.payload.id)
      if (index !== -1) {
        state.departments[index] = action.payload
      }
    },
    deleteDepartment: (state, action: PayloadAction<string>) => {
      state.departments = state.departments.filter((d) => d.id !== action.payload)
    },
    deleteMultipleDepartments: (state, action: PayloadAction<string[]>) => {
      state.departments = state.departments.filter((d) => !action.payload.includes(d.id))
    },
    toggleDepartmentSelection: (state, action: PayloadAction<string>) => {
      const index = state.selectedDepartments.indexOf(action.payload)
      if (index > -1) {
        state.selectedDepartments.splice(index, 1)
      } else {
        state.selectedDepartments.push(action.payload)
      }
    },
    selectAllDepartments: (state) => {
      state.selectedDepartments = state.departments.map((d) => d.id)
    },
    clearSelection: (state) => {
      state.selectedDepartments = []
    },
    addStep: (state, action: PayloadAction<{ departmentId: string; step: Step }>) => {
      const department = state.departments.find((d) => d.id === action.payload.departmentId)
      if (department) {
        department.steps.push(action.payload.step)
      }
    },
    updateStep: (
      state,
      action: PayloadAction<{
        departmentId: string
        stepId: string
        step: Step
      }>,
    ) => {
      const department = state.departments.find((d) => d.id === action.payload.departmentId)
      if (department) {
        const stepIndex = department.steps.findIndex((s) => s.id === action.payload.stepId)
        if (stepIndex !== -1) {
          department.steps[stepIndex] = action.payload.step
        }
      }
    },
    deleteStep: (state, action: PayloadAction<{ departmentId: string; stepId: string }>) => {
      const department = state.departments.find((d) => d.id === action.payload.departmentId)
      if (department) {
        department.steps = department.steps.filter((s) => s.id !== action.payload.stepId)
      }
    },
  },
})

export const {
  addDepartment,
  updateDepartment,
  deleteDepartment,
  deleteMultipleDepartments,
  toggleDepartmentSelection,
  selectAllDepartments,
  clearSelection,
  addStep,
  updateStep,
  deleteStep,
} = departmentsSlice.actions

export default departmentsSlice.reducer