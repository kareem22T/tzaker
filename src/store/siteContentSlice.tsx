import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface HeroSection {
  image: string
  title: string
  description: string
  buttonText: string
  buttonTarget: string
}

export interface ContactInfo {
  email: string
  phone: string
  location: string
}

export interface SiteContent {
  home: {
    hero: HeroSection
    faqIds: string[]
  }
  contact: {
    info: ContactInfo
    faqIds: string[]
  }
  cookiePolicy: string
  termsOfService: string
  privacyPolicy: string
}

interface SiteContentState {
  content: SiteContent
}

const initialState: SiteContentState = {
  content: {
    home: {
      hero: {
        image: "",
        title: "Welcome to Our Platform",
        description: "Discover amazing features and content management capabilities.",
        buttonText: "Get Started",
        buttonTarget: "#features",
      },
      faqIds: [],
    },
    contact: {
      info: {
        email: "contact@example.com",
        phone: "+1 (555) 000-0000",
        location: "123 Main Street, City, Country",
      },
      faqIds: [],
    },
    cookiePolicy: "<p>Welcome to our Cookie Policy page. Add your cookie policy content here.</p>",
    termsOfService: "<p>Welcome to our Terms of Service page. Add your terms content here.</p>",
    privacyPolicy: "<p>Welcome to our Privacy Policy page. Add your privacy content here.</p>",
  },
}

const siteContentSlice = createSlice({
  name: "siteContent",
  initialState,
  reducers: {
    updateHeroSection: (state, action: PayloadAction<Partial<HeroSection>>) => {
      state.content.home.hero = {
        ...state.content.home.hero,
        ...action.payload,
      }
    },
    updateContactInfo: (state, action: PayloadAction<Partial<ContactInfo>>) => {
      state.content.contact.info = {
        ...state.content.contact.info,
        ...action.payload,
      }
    },
    setHomeFaqIds: (state, action: PayloadAction<string[]>) => {
      state.content.home.faqIds = action.payload
    },
    setContactFaqIds: (state, action: PayloadAction<string[]>) => {
      state.content.contact.faqIds = action.payload
    },
    updateCookiePolicy: (state, action: PayloadAction<string>) => {
      state.content.cookiePolicy = action.payload
    },
    updateTermsOfService: (state, action: PayloadAction<string>) => {
      state.content.termsOfService = action.payload
    },
    updatePrivacyPolicy: (state, action: PayloadAction<string>) => {
      state.content.privacyPolicy = action.payload
    },
  },
})

export const {
  updateHeroSection,
  updateContactInfo,
  setHomeFaqIds,
  setContactFaqIds,
  updateCookiePolicy,
  updateTermsOfService,
  updatePrivacyPolicy,
} = siteContentSlice.actions

export default siteContentSlice.reducer
