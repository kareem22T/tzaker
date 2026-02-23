import React, { useState, useRef } from 'react'
import { Upload, X } from 'lucide-react'
import type { Club, CreateClubPayload, UpdateClubPayload } from '../../store/api/clubsApi'

type ModalMode = 'view' | 'create' | 'edit'

interface ModalProps {
  club: Club | null
  mode: ModalMode
  onClose: () => void
  onSave: (data: CreateClubPayload | UpdateClubPayload) => void
  saving?: boolean
}

export default function ClubModal({ club, mode, onClose, onSave, saving }: ModalProps) {
  const [nameEn, setNameEn] = useState(club?.name_en ?? '')
  const [nameAr, setNameAr] = useState(club?.name_ar ?? '')
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string>(club?.logo ?? '')
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setLogoFile(file)
    const reader = new FileReader()
    reader.onloadend = () => setLogoPreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  const handleSubmit = () => {
    if (!nameEn.trim() || !nameAr.trim()) {
      setError('Both English and Arabic names are required')
      return
    }
    if (mode === 'create' && !logoFile) {
      setError('Logo is required')
      return
    }
    setError(null)
    if (mode === 'create') {
      onSave({ name_en: nameEn, name_ar: nameAr, logo: logoFile! })
    } else {
      const payload: UpdateClubPayload = { id: club!.id, name_en: nameEn, name_ar: nameAr }
      if (logoFile) payload.logo = logoFile
      onSave(payload)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[99999999] p-4">
      <div className="bg-[#111d2d] border border-[#1e3a52] rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-[#111d2d] border-b border-[#1e3a52] p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">{mode === 'create' ? 'Add New Club' : mode === 'edit' ? 'Edit Club' : 'Club Details'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors"><X className="w-6 h-6" /></button>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-[#0a1929] border border-[#1e3a52] rounded-lg p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Club Name (English) *</label>
              <input type="text" value={nameEn} onChange={(e) => setNameEn(e.target.value)} className="w-full px-4 py-2 bg-[#0a1929] border border-[#1e3a52] rounded-lg text-white focus:outline-none focus:border-[#00ff88] transition-colors" placeholder="Enter club name in English" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Club Name (Arabic) *</label>
              <input type="text" value={nameAr} onChange={(e) => setNameAr(e.target.value)} dir="rtl" className="w-full px-4 py-2 bg-[#0a1929] border border-[#1e3a52] rounded-lg text-white focus:outline-none focus:border-[#00ff88] transition-colors" placeholder="أدخل اسم النادي بالعربية" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Club Logo {mode === 'create' ? '*' : '(leave empty to keep current)'} </label>
              <div className="w-full px-4 py-3 bg-[#0a1929] border border-dashed border-[#1e3a52] rounded-lg text-gray-400 hover:border-[#00ff88] transition-colors cursor-pointer flex items-center gap-3" onClick={() => fileInputRef.current?.click()}>
                <Upload className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm truncate">{logoFile ? logoFile.name : 'Click to upload logo image'}</span>
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </div>

            {logoPreview && (
              <div>
                <p className="text-sm text-gray-400 mb-2">Preview</p>
                <div className="flex items-center justify-center bg-white/5 border border-[#1e3a52] rounded-lg p-6">
                  <img src={logoPreview} alt="Logo preview" className="max-w-[160px] max-h-[160px] object-contain" />
                </div>
              </div>
            )}
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <div className="flex gap-3 justify-end pt-4 border-t border-[#1e3a52]">
            <button onClick={onClose} className="px-6 py-2.5 border border-[#1e3a52] text-gray-300 rounded-lg hover:bg-[#0a1929] transition-colors">Cancel</button>
            <button onClick={handleSubmit} disabled={saving} className="px-6 py-2.5 bg-[#00ff88] text-[#0a1929] font-semibold rounded-lg hover:bg-[#00dd77] transition-colors disabled:opacity-50">{saving ? 'Saving...' : mode === 'create' ? 'Create Club' : 'Save Changes'}</button>
          </div>
        </div>
      </div>
    </div>
  )
}
