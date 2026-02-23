import { configureStore } from "@reduxjs/toolkit"
import departmentsReducer from "./departmentsSlice"
import contactMessagesReducer from "./contactMessagesSlice"
import { departmentsApi } from './api/departmentsApi'
import { faqsApi } from './api/faqsApi'
import { contactMessagesApi } from './api/contactMessagesApi'
import { dashboardApi } from './api/dashboardApi'
import { applicationsApi } from './api/applicationsApi'
import { siteContentApi } from './api/siteContentApi'
import { suppliersApi } from './api/suppliersApi'
import { clubsApi } from './api/clubsApi'
import { usersApi } from './api/usersApi'
import { sportsApi } from './api/sportsApi'
import { stadiumsApi } from './api/stadiumsApi'
import { tournamentsApi } from './api/tournamentsApi'
import { matchesApi } from './api/matchesApi'
import { ticketsApi } from './api/ticketsApi'
import { bookingApi } from './api/bookingApi'
import { countriesApi } from './api/countriesApi'

export const store = configureStore({
  reducer: {
    departments: departmentsReducer,
    contactMessages: contactMessagesReducer,
    [departmentsApi.reducerPath]: departmentsApi.reducer,
    [faqsApi.reducerPath]: faqsApi.reducer,
    [contactMessagesApi.reducerPath]: contactMessagesApi.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
    [applicationsApi.reducerPath]: applicationsApi.reducer,
    [siteContentApi.reducerPath]: siteContentApi.reducer,
    [suppliersApi.reducerPath]: suppliersApi.reducer,
    [clubsApi.reducerPath]: clubsApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
    [sportsApi.reducerPath]: sportsApi.reducer,
    [stadiumsApi.reducerPath]: stadiumsApi.reducer,
    [tournamentsApi.reducerPath]: tournamentsApi.reducer,
    [matchesApi.reducerPath]: matchesApi.reducer,
    [ticketsApi.reducerPath]: ticketsApi.reducer,
    [bookingApi.reducerPath]: bookingApi.reducer,
    [countriesApi.reducerPath]: countriesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(departmentsApi.middleware)
      .concat(faqsApi.middleware)
      .concat(contactMessagesApi.middleware)
      .concat(dashboardApi.middleware)
      .concat(applicationsApi.middleware)
      .concat(siteContentApi.middleware)
      .concat(suppliersApi.middleware)
      .concat(clubsApi.middleware)
      .concat(usersApi.middleware)
      .concat(sportsApi.middleware)
      .concat(stadiumsApi.middleware)
      .concat(tournamentsApi.middleware)
      .concat(matchesApi.middleware)
      .concat(ticketsApi.middleware)
      .concat(bookingApi.middleware)
      .concat(countriesApi.middleware)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
