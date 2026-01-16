import { configureStore } from "@reduxjs/toolkit"
import departmentsReducer from "./departmentsSlice"
import applicationsReducer from "./applicationsSlice"
import faqsReducer from "./faqsSlice"
import usersReducer from "./usersSlice"
import siteContentReducer from "./siteContentSlice"
import contactMessagesReducer from "./contactMessagesSlice"
import { departmentsApi } from './api/departmentsApi'
import { usersApi } from './api/usersApi'
import { faqsApi } from './api/faqsApi'
import { contactMessagesApi } from './api/contactMessagesApi'
import { dashboardApi } from './api/dashboardApi'
import { applicationsApi } from './api/applicationsApi'
import { siteContentApi } from './api/siteContentApi'

export const store = configureStore({
  reducer: {
    departments: departmentsReducer,
    applications: applicationsReducer,
    faqs: faqsReducer,
    users: usersReducer,
    siteContent: siteContentReducer,
    contactMessages: contactMessagesReducer,
    [departmentsApi.reducerPath]: departmentsApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
    [faqsApi.reducerPath]: faqsApi.reducer,
    [contactMessagesApi.reducerPath]: contactMessagesApi.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
    [applicationsApi.reducerPath]: applicationsApi.reducer,
    [siteContentApi.reducerPath]: siteContentApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(departmentsApi.middleware)
      .concat(usersApi.middleware)
      .concat(faqsApi.middleware)
      .concat(contactMessagesApi.middleware)
      .concat(dashboardApi.middleware)
      .concat(applicationsApi.middleware)
      .concat(siteContentApi.middleware)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
