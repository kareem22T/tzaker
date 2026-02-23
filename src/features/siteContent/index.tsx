import React, { useState, useEffect } from 'react'
import { FileText, Save, Globe, Phone, Cookie, ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react'
import {
  useGetHeroSectionQuery,
  useUpdateHeroSectionMutation,
  useUpdateSettingMutation,
  useUpdateContactMutation,
} from '../../store/api/siteContentApi'
import type { UpdateHeroPayload, UpdateContactPayload } from '../../store/api/siteContentApi'
import { useGetCountriesQuery } from '../../store/api/countriesApi'

function Section({ title, icon: Icon, children, defaultOpen = false }: {
  title: string; icon: React.ComponentType<{ className?: string }>; children: React.ReactNode; defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="bg-[#111d2d] border border-[#1e3a52] rounded-lg overflow-hidden mb-4">
      <button onClick={() => setOpen(o => !o)} className="w-full px-6 py-4 flex items-center justify-between hover:bg-[#0a1929]/50 transition-colors">
        <div className="flex items-center gap-3">
          <Icon className="w-5 h-5 text-[#00ff88]" />
          <span className="text-white font-semibold">{title}</span>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>
      {open && <div className="px-6 pb-6 border-t border-[#1e3a52]">{children}</div>}
    </div>
  )
}

const inp = (label: string, value: string, onChange: (v: string) => void, type = 'text', disabled = false) => (
  <div>
    <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
    <input type={type} value={value} onChange={e => onChange(e.target.value)} disabled={disabled}
      className="w-full px-3 py-2 bg-[#0a1929] border border-[#1e3a52] rounded-lg text-white focus:outline-none focus:border-[#00ff88] disabled:opacity-60 transition-colors text-sm" />
  </div>
)

const ta = (label: string, value: string, onChange: (v: string) => void, disabled = false) => (
  <div>
    <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
    <textarea value={value} onChange={e => onChange(e.target.value)} disabled={disabled} rows={6}
      className="w-full px-3 py-2 bg-[#0a1929] border border-[#1e3a52] rounded-lg text-white focus:outline-none focus:border-[#00ff88] disabled:opacity-60 transition-colors text-sm resize-none" />
  </div>
)

export default function SiteContentManagement() {
  const { data: heroRes, isLoading } = useGetHeroSectionQuery()
  const hero = heroRes?.data
  const { data: countriesRes } = useGetCountriesQuery()
  const countries = countriesRes?.data || []

  const [updateHero, { isLoading: savingHero }] = useUpdateHeroSectionMutation()
  const [updateSetting, { isLoading: savingSetting }] = useUpdateSettingMutation()
  const [updateContact, { isLoading: savingContact }] = useUpdateContactMutation()

  // Hero form state
  const [heroForm, setHeroForm] = useState<UpdateHeroPayload>({ title_en: '', title_ar: '', description_en: '', description_ar: '', button_text_en: '', button_text_ar: '', button_url: '' })
  const setHero = (k: keyof UpdateHeroPayload, v: string) => setHeroForm(p => ({ ...p, [k]: v }))

  // Contact form state
  const [contactForm, setContactForm] = useState<UpdateContactPayload>({ email: '', phone: '', address_en: '', address_ar: '', country_id: 0, working_hours_en: '', working_hours_ar: '', response_time_en: '', response_time_ar: '' })
  const setContact = (k: keyof UpdateContactPayload, v: string | number) => setContactForm(p => ({ ...p, [k]: v }))

  // Static pages state
  const [cookieEn, setCookieEn] = useState('')
  const [cookieAr, setCookieAr] = useState('')
  const [termsEn, setTermsEn] = useState('')
  const [termsAr, setTermsAr] = useState('')
  const [privacyEn, setPrivacyEn] = useState('')
  const [privacyAr, setPrivacyAr] = useState('')

  useEffect(() => {
    if (!hero) return
    setHeroForm({ title_en: hero.title_en || '', title_ar: hero.title_ar || '', description_en: hero.description_en || '', description_ar: hero.description_ar || '', button_text_en: hero.button_text_en || '', button_text_ar: hero.button_text_ar || '', button_url: hero.button_url || '' })
    if (hero.contact) {
      const c = hero.contact
      setContactForm({ email: c.email || '', phone: c.phone || '', address_en: c.address_en || '', address_ar: c.address_ar || '', country_id: c.country_id || 0, working_hours_en: c.working_hours_en || '', working_hours_ar: c.working_hours_ar || '', response_time_en: c.response_time_en || '', response_time_ar: c.response_time_ar || '' })
    }
    if (hero.cookie_policy) { setCookieEn(hero.cookie_policy.content_en || ''); setCookieAr(hero.cookie_policy.content_ar || '') }
    if (hero.terms) { setTermsEn(hero.terms.content_en || ''); setTermsAr(hero.terms.content_ar || '') }
    if (hero.privacy_policy) { setPrivacyEn(hero.privacy_policy.content_en || ''); setPrivacyAr(hero.privacy_policy.content_ar || '') }
  }, [hero])

  const saveBtn = (label: string, onClick: () => void, saving: boolean) => (
    <button type="button" onClick={onClick} disabled={saving}
      className="flex items-center gap-2 px-4 py-2 bg-[#00ff88] text-[#0a1929] font-semibold rounded-lg hover:bg-[#00dd77] disabled:opacity-60 text-sm transition-colors mt-4">
      <Save className="w-4 h-4" /> {saving ? 'Saving...' : label}
    </button>
  )

  if (isLoading) return <div className="p-6 text-gray-400">Loading site content...</div>

  return (
    <div className="p-6 min-h-screen">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <FileText className="w-8 h-8 text-[#00ff88]" />
          <h1 className="text-3xl font-bold text-white">Site Content</h1>
        </div>
        <p className="text-gray-400">Manage website content and settings</p>
      </div>

      <Section title="Hero Section" icon={Globe} defaultOpen>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          {inp('Title (English)', heroForm.title_en, v => setHero('title_en', v))}
          {inp('Title (Arabic)', heroForm.title_ar, v => setHero('title_ar', v))}
          {inp('Description (English)', heroForm.description_en, v => setHero('description_en', v))}
          {inp('Description (Arabic)', heroForm.description_ar, v => setHero('description_ar', v))}
          {inp('Button Text (EN)', heroForm.button_text_en, v => setHero('button_text_en', v))}
          {inp('Button Text (AR)', heroForm.button_text_ar, v => setHero('button_text_ar', v))}
          <div className="sm:col-span-2">{inp('Button URL', heroForm.button_url, v => setHero('button_url', v))}</div>
        </div>
        {saveBtn('Save Hero', () => updateHero(heroForm).unwrap().catch(console.error), savingHero)}
      </Section>

      <Section title="Contact Information" icon={Phone}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          {inp('Email', contactForm.email, v => setContact('email', v), 'email')}
          {inp('Phone', contactForm.phone, v => setContact('phone', v))}
          {inp('Address (EN)', contactForm.address_en, v => setContact('address_en', v))}
          {inp('Address (AR)', contactForm.address_ar, v => setContact('address_ar', v))}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Country</label>
            <select value={contactForm.country_id} onChange={e => setContact('country_id', Number(e.target.value))}
              className="w-full px-3 py-2 bg-[#0a1929] border border-[#1e3a52] rounded-lg text-white focus:outline-none focus:border-[#00ff88] text-sm transition-colors">
              <option value={0}>Select country</option>
              {countries.map(c => <option key={c.id} value={c.id}>{c.name_en}</option>)}
            </select>
          </div>
          {inp('Working Hours (EN)', contactForm.working_hours_en, v => setContact('working_hours_en', v))}
          {inp('Working Hours (AR)', contactForm.working_hours_ar, v => setContact('working_hours_ar', v))}
          {inp('Response Time (EN)', contactForm.response_time_en, v => setContact('response_time_en', v))}
          {inp('Response Time (AR)', contactForm.response_time_ar, v => setContact('response_time_ar', v))}
        </div>
        {saveBtn('Save Contact', () => updateContact(contactForm).unwrap().catch(console.error), savingContact)}
      </Section>

      <Section title="Cookie Policy" icon={Cookie}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          {ta('Content (English)', cookieEn, setCookieEn)}
          {ta('Content (Arabic)', cookieAr, setCookieAr)}
        </div>
        {saveBtn('Save Cookie Policy', () => updateSetting({ id: hero?.cookie_policy?.id || 1, content_en: cookieEn, content_ar: cookieAr }).unwrap().catch(console.error), savingSetting)}
      </Section>

      <Section title="Terms & Conditions" icon={ShieldCheck}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          {ta('Content (English)', termsEn, setTermsEn)}
          {ta('Content (Arabic)', termsAr, setTermsAr)}
        </div>
        {saveBtn('Save Terms', () => updateSetting({ id: hero?.terms?.id || 2, content_en: termsEn, content_ar: termsAr }).unwrap().catch(console.error), savingSetting)}
      </Section>

      <Section title="Privacy Policy" icon={ShieldCheck}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          {ta('Content (English)', privacyEn, setPrivacyEn)}
          {ta('Content (Arabic)', privacyAr, setPrivacyAr)}
        </div>
        {saveBtn('Save Privacy Policy', () => updateSetting({ id: hero?.privacy_policy?.id || 3, content_en: privacyEn, content_ar: privacyAr }).unwrap().catch(console.error), savingSetting)}
      </Section>
    </div>
  )
}
