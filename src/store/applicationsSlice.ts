import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface ApplicationStep {
  stepId: string
  stepTitle: string
  formData: Record<string, unknown>
  completed: boolean
}

export interface Application {
  id: string
  userId: string
  userName: string
  departmentId: string
  departmentName: string
  status: "pending" | "approved" | "rejected"
  rating?: number
  ratingComment?: string
  steps: ApplicationStep[]
  completionPercentage: number
  createdAt: string
  updatedAt: string
}

interface ApplicationsState {
  applications: Application[]
  selectedApplications: Set<string>
}

const dummyApplications: Application[] = [
  {
    id: "app-1",
    userId: "user-1",
    userName: "Sarah Anderson",
    departmentId: "scriptwriting",
    departmentName: "Scriptwriting",
    status: "approved",
    rating: 5,
    ratingComment:
      "Outstanding screenplay with compelling narrative structure and well-developed characters. Great potential for adaptation.",
    steps: [
      {
        stepId: "scriptwriting-step-1",
        stepTitle: "Contact Information",
        formData: {
          contactName: "Sarah Anderson",
          contactEmail: "sarah.anderson@email.com",
          phoneNumber: "+1 (555) 234-5678",
          location: "Los Angeles, USA",
          portfolioUrl: "https://sarahscripts.com",
        },
        completed: true,
      },
      {
        stepId: "scriptwriting-step-2",
        stepTitle: "Script Details",
        formData: {
          scriptTitle: "The Forgotten City",
          synopsis:
            "A young archaeologist discovers an ancient city that challenges everything we know about human history...",
          genre: "sci-fi",
          format: "Feature Film",
          runtime: "120 minutes",
        },
        completed: true,
      },
      {
        stepId: "scriptwriting-step-3",
        stepTitle: "Writer Experience",
        formData: {
          writingExperience: "10+ years as a professional screenwriter with multiple produced works",
          previousWorks: "Wrote scripts for Netflix, HBO, and independent productions",
          awards: "Best Screenplay at London Film Festival 2022",
        },
        completed: true,
      },
      {
        stepId: "scriptwriting-step-4",
        stepTitle: "Script Upload",
        formData: {
          scriptFile: "the-forgotten-city-v3.pdf",
          additionalNotes: "This is my passion project developed over 3 years of research.",
        },
        completed: true,
      },
    ],
    completionPercentage: 100,
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "app-2",
    userId: "user-2",
    userName: "Marcus Johnson",
    departmentId: "scriptwriting",
    departmentName: "Scriptwriting",
    status: "pending",
    steps: [
      {
        stepId: "scriptwriting-step-1",
        stepTitle: "Contact Information",
        formData: {
          contactName: "Marcus Johnson",
          contactEmail: "marcus.j@email.com",
          phoneNumber: "+1 (555) 345-6789",
          location: "New York, USA",
          portfolioUrl: "https://marcusscreens.com",
        },
        completed: true,
      },
      {
        stepId: "scriptwriting-step-2",
        stepTitle: "Script Details",
        formData: {
          scriptTitle: "Urban Dreams",
          synopsis:
            "A gritty drama following three generations of a family struggling with identity in modern society...",
          genre: "drama",
          format: "Web Series",
          runtime: "8 episodes",
        },
        completed: true,
      },
      {
        stepId: "scriptwriting-step-3",
        stepTitle: "Writer Experience",
        formData: {
          writingExperience: "5 years writing for independent productions and online platforms",
          previousWorks: "Several short films on Vimeo and YouTube",
          awards: "",
        },
        completed: false,
      },
      {
        stepId: "scriptwriting-step-4",
        stepTitle: "Script Upload",
        formData: {},
        completed: false,
      },
    ],
    completionPercentage: 50,
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "app-4",
    userId: "user-4",
    userName: "Emma Wilson",
    departmentId: "production",
    departmentName: "Production",
    status: "approved",
    rating: 5,
    ratingComment:
      "Excellent production team with state-of-the-art equipment and impressive portfolio. Highly recommended for major projects.",
    steps: [
      {
        stepId: "production-step-1",
        stepTitle: "Basic Information",
        formData: {
          contactName: "Emma Wilson",
          contactEmail: "emma@wilsonproductions.com",
          phoneNumber: "+1 (555) 567-8901",
          location: "Los Angeles, USA",
          portfolioUrl: "https://wilsonproductions.com",
        },
        completed: true,
      },
      {
        stepId: "production-step-2",
        stepTitle: "Project Details",
        formData: {
          projectTitle: "Full-Service Video Production",
          description: "Complete end-to-end production services from concept to delivery...",
          relevantExperience: "15+ years producing content for major streaming platforms and studios",
          productionType: "full-service",
          productionCapacity: "Team of 25+ professionals capable of handling simultaneous projects",
          equipmentFacilities: "State-of-the-art 4K/8K cameras, 5000 sq ft studio space, full post-production suite",
          yearsInBusiness: "10+",
          completedProjects: "100+",
          totalBudget: "100k+",
          projectTimeline: "immediate",
        },
        completed: true,
      },
      {
        stepId: "production-step-3",
        stepTitle: "Uploads & Portfolio",
        formData: {
          portfolioFiles: ["reel-2024.mp4", "case-studies.pdf"],
          additionalLinks: "https://vimeo.com/wilsonproductions\nhttps://youtube.com/@wilsonproductions",
          references: "Director David Fincher - david@productions.com\nProducer Jane Smith - jane@studiox.com",
        },
        completed: true,
      },
      {
        stepId: "production-step-4",
        stepTitle: "Review & Submit",
        formData: {
          termsAccepted: "true",
        },
        completed: true,
      },
    ],
    completionPercentage: 100,
    createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "app-5",
    userId: "user-5",
    userName: "David Rodriguez",
    departmentId: "production",
    departmentName: "Production",
    status: "pending",
    steps: [
      {
        stepId: "production-step-1",
        stepTitle: "Basic Information",
        formData: {
          contactName: "David Rodriguez",
          contactEmail: "david@rodrigezfilms.com",
          phoneNumber: "+1 (555) 678-9012",
          location: "Miami, USA",
          portfolioUrl: "https://rodrigezfilms.com",
        },
        completed: true,
      },
      {
        stepId: "production-step-2",
        stepTitle: "Project Details",
        formData: {
          projectTitle: "Cinematography & Videography",
          description: "Professional videography and cinematography services for commercials and documentaries...",
          relevantExperience: "8 years of professional video production experience",
          productionType: "videography",
          productionCapacity: "Team of 5-8 professionals",
          equipmentFacilities: "4K cameras, drones, lighting equipment, mobile editing suite",
          yearsInBusiness: "5-10",
          completedProjects: "50-100",
        },
        completed: true,
      },
      {
        stepId: "production-step-3",
        stepTitle: "Uploads & Portfolio",
        formData: {},
        completed: false,
      },
      {
        stepId: "production-step-4",
        stepTitle: "Review & Submit",
        formData: {},
        completed: false,
      },
    ],
    completionPercentage: 50,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "app-6",
    userId: "user-6",
    userName: "Lisa Park",
    departmentId: "production",
    departmentName: "Production",
    status: "pending",
    steps: [
      {
        stepId: "production-step-1",
        stepTitle: "Basic Information",
        formData: {},
        completed: false,
      },
      {
        stepId: "production-step-2",
        stepTitle: "Project Details",
        formData: {},
        completed: false,
      },
      {
        stepId: "production-step-3",
        stepTitle: "Uploads & Portfolio",
        formData: {},
        completed: false,
      },
      {
        stepId: "production-step-4",
        stepTitle: "Review & Submit",
        formData: {},
        completed: false,
      },
    ],
    completionPercentage: 0,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

const initialState: ApplicationsState = {
  applications: dummyApplications,
  selectedApplications: new Set(),
}

const applicationsSlice = createSlice({
  name: "applications",
  initialState,
  reducers: {
    addApplication: (state, action: PayloadAction<Application>) => {
      state.applications.push(action.payload)
    },

    updateApplication: (state, action: PayloadAction<Application>) => {
      const index = state.applications.findIndex((a) => a.id === action.payload.id)
      if (index !== -1) {
        state.applications[index] = action.payload
      }
    },

    deleteApplication: (state, action: PayloadAction<string>) => {
      state.applications = state.applications.filter((a) => a.id !== action.payload)
      state.selectedApplications.delete(action.payload)
    },

    deleteMultipleApplications: (state, action: PayloadAction<string[]>) => {
      state.applications = state.applications.filter((a) => !action.payload.includes(a.id))
      action.payload.forEach((id) => state.selectedApplications.delete(id))
    },

    updateApplicationStatus: (
      state,
      action: PayloadAction<{ id: string; status: "pending" | "approved" | "rejected" }>,
    ) => {
      const app = state.applications.find((a) => a.id === action.payload.id)
      if (app) {
        app.status = action.payload.status
        app.updatedAt = new Date().toISOString()
      }
    },

    addApplicationRating: (state, action: PayloadAction<{ id: string; rating: number; comment?: string }>) => {
      const app = state.applications.find((a) => a.id === action.payload.id)
      if (app) {
        app.rating = action.payload.rating
        app.ratingComment = action.payload.comment
        app.updatedAt = new Date().toISOString()
      }
    },

    toggleApplicationSelection: (state, action: PayloadAction<string>) => {
      if (state.selectedApplications.has(action.payload)) {
        state.selectedApplications.delete(action.payload)
      } else {
        state.selectedApplications.add(action.payload)
      }
    },

    selectAllApplications: (state) => {
      state.applications.forEach((app) => state.selectedApplications.add(app.id))
    },

    clearSelection: (state) => {
      state.selectedApplications.clear()
    },
  },
})

export const {
  addApplication,
  updateApplication,
  deleteApplication,
  deleteMultipleApplications,
  updateApplicationStatus,
  addApplicationRating,
  toggleApplicationSelection,
  selectAllApplications,
  clearSelection,
} = applicationsSlice.actions

export default applicationsSlice.reducer
