"use client"

import type React from "react"
import { useState } from "react"
import type { Department, Step } from "../../../store/departmentsSlice"
import StepForm from "./StepForm"
import { Plus, ChevronDown, Upload, X } from "lucide-react"
import { v4 as uuidv4 } from "uuid"

interface DepartmentFormProps {
  initialData?: Department
  onSubmit: (data: Partial<Department>) => void
  isSubmitting?: boolean
}

export default function DepartmentForm({ initialData, onSubmit, isSubmitting = false }: DepartmentFormProps) {
  const [name, setName] = useState(initialData?.name || "")
  const [nameAr, setNameAr] = useState(initialData?.name_ar || "")
  const [description, setDescription] = useState(initialData?.description || "")
  const [descriptionAr, setDescriptionAr] = useState(initialData?.description_ar || "")
  const [icon, setIcon] = useState<File | null>(null)
  const [iconPreview, setIconPreview] = useState<string | null>(initialData?.icon_url || null)
  const [steps, setSteps] = useState<Step[]>(initialData?.steps || [])
  const [expandedStep, setExpandedStep] = useState<string | null>(null)
  const [showStepForm, setShowStepForm] = useState(false)
  const [editingStepId, setEditingStepId] = useState<string | null>(null)

  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file')
        return
      }
      
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('Image size should be less than 2MB')
        return
      }

      setIcon(file)
      
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setIconPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveIcon = () => {
    setIcon(null)
    setIconPreview(null)
  }

  const handleAddStep = (stepData: Omit<Step, "id" | "order">) => {
    if (editingStepId) {
      setSteps(steps.map((s) => (s.id === editingStepId ? { ...stepData, id: s.id, order: s.order } : s)))
      setEditingStepId(null)
    } else {
      const newStep: Step = {
        ...stepData,
        id: uuidv4(),
        order: steps.length + 1,
      }
      setSteps([...steps, newStep])
    }
    setShowStepForm(false)
  }

  const handleDeleteStep = (stepId: string) => {
    setSteps(steps.filter((s) => s.id !== stepId))
  }

  const handleEditStep = (step: Step) => {
    setEditingStepId(step.id)
    setShowStepForm(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const formData = {
      name,
      name_ar: nameAr,
      description,
      description_ar: descriptionAr,
      steps,
      ...(icon && { icon })
    }
    
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Info */}
      <div className="bg-white darkx:bg-gray-800 border border-gray-200 darkx:border-gray-700 rounded-xl p-6 sm:p-8">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 darkx:text-white mb-6">
          Department Information
        </h2>

        <div className="space-y-4">
          {/* Icon Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 darkx:text-gray-300 mb-2">
              Department Icon
            </label>
            
            <div className="flex items-start gap-4">
              {/* Preview */}
              <div className="flex-shrink-0">
                {iconPreview ? (
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden border-2 border-gray-200 darkx:border-gray-700">
                    <img 
                      src={iconPreview} 
                      alt="Department icon" 
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveIcon}
                      className="absolute top-1 right-1 p-1 bg-error-500 text-white rounded-full hover:bg-error-600 transition-colors"
                      disabled={isSubmitting}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-lg border-2 border-dashed border-gray-300 darkx:border-gray-600 flex items-center justify-center bg-gray-50 darkx:bg-gray-900">
                    <Upload size={24} className="text-gray-400" />
                  </div>
                )}
              </div>

              {/* Upload Button */}
              <div className="flex-1">
                <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-gray-100 darkx:bg-gray-700 text-gray-700 darkx:text-gray-300 rounded-lg hover:bg-gray-200 darkx:hover:bg-gray-600 transition-colors font-medium text-sm">
                  <Upload size={16} />
                  {iconPreview ? 'Change Icon' : 'Upload Icon'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleIconChange}
                    className="hidden"
                    disabled={isSubmitting}
                  />
                </label>
                <p className="text-xs text-gray-500 darkx:text-gray-400 mt-2">
                  PNG, JPG or SVG (max 2MB)
                </p>
              </div>
            </div>
          </div>

          {/* Department Name - English */}
          <div>
            <label className="block text-sm font-medium text-gray-700 darkx:text-gray-300 mb-2">
              Department Name (English)
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Human Resources"
              className="w-full px-4 py-3 bg-white darkx:bg-gray-900 border border-gray-200 darkx:border-gray-700 rounded-lg text-gray-900 darkx:text-white placeholder-gray-500 darkx:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 darkx:focus:ring-brand-400"
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Department Name - Arabic */}
          <div>
            <label className="block text-sm font-medium text-gray-700 darkx:text-gray-300 mb-2">
              Department Name (Arabic)
            </label>
            <input
              type="text"
              value={nameAr}
              onChange={(e) => setNameAr(e.target.value)}
              placeholder="مثال: الموارد البشرية"
              dir="rtl"
              className="w-full px-4 py-3 bg-white darkx:bg-gray-900 border border-gray-200 darkx:border-gray-700 rounded-lg text-gray-900 darkx:text-white placeholder-gray-500 darkx:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 darkx:focus:ring-brand-400"
              disabled={isSubmitting}
            />
          </div>

          {/* Description - English */}
          <div>
            <label className="block text-sm font-medium text-gray-700 darkx:text-gray-300 mb-2">
              Description (English)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the department..."
              rows={3}
              className="w-full px-4 py-3 bg-white darkx:bg-gray-900 border border-gray-200 darkx:border-gray-700 rounded-lg text-gray-900 darkx:text-white placeholder-gray-500 darkx:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 darkx:focus:ring-brand-400 resize-none"
              disabled={isSubmitting}
            />
          </div>

          {/* Description - Arabic */}
          <div>
            <label className="block text-sm font-medium text-gray-700 darkx:text-gray-300 mb-2">
              Description (Arabic)
            </label>
            <textarea
              value={descriptionAr}
              onChange={(e) => setDescriptionAr(e.target.value)}
              placeholder="وصف موجز للقسم..."
              rows={3}
              dir="rtl"
              className="w-full px-4 py-3 bg-white darkx:bg-gray-900 border border-gray-200 darkx:border-gray-700 rounded-lg text-gray-900 darkx:text-white placeholder-gray-500 darkx:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 darkx:focus:ring-brand-400 resize-none"
              disabled={isSubmitting}
            />
          </div>
        </div>
      </div>

      {/* Steps Section */}
      <div className="bg-white darkx:bg-gray-800 border border-gray-200 darkx:border-gray-700 rounded-xl p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6 flex-col sm:flex-row gap-4">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 darkx:text-white">Workflow Steps</h2>
          {!showStepForm && (
            <button
              type="button"
              onClick={() => {
                setShowStepForm(true)
                setEditingStepId(null)
              }}
              className="flex items-center gap-2 px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 darkx:hover:bg-brand-400 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              <Plus size={18} />
              Add Step
            </button>
          )}
        </div>

        {showStepForm && (
          <div className="mb-6 p-6 bg-gray-50 darkx:bg-gray-900 border border-gray-200 darkx:border-gray-700 rounded-lg">
            <StepForm
              step={editingStepId ? steps.find((s) => s.id === editingStepId) : undefined}
              onSubmit={handleAddStep}
              onCancel={() => {
                setShowStepForm(false)
                setEditingStepId(null)
              }}
            />
          </div>
        )}

        {steps.length === 0 ? (
          <div className="py-12 text-center text-gray-500 darkx:text-gray-400">
            <p>No steps added yet. Add steps to define your workflow.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {steps.map((step) => (
              <div
                key={step.id}
                className="bg-white darkx:bg-gray-900 border border-gray-200 darkx:border-gray-700 rounded-lg overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setExpandedStep(expandedStep === step.id ? null : step.id)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 darkx:hover:bg-gray-800/50 transition-colors"
                  disabled={isSubmitting}
                >
                  <div className="flex-1 text-left">
                    <h3 className="font-semibold text-gray-900 darkx:text-white">
                      Step {step.order}: {step.title}
                    </h3>
                    {step.title_ar && (
                      <p className="text-sm text-gray-600 darkx:text-gray-400 mt-1" dir="rtl">
                        {step.title_ar}
                      </p>
                    )}
                    <p className="text-sm text-gray-500 darkx:text-gray-400 mt-1">
                      {step.formFields.length} fields
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <ChevronDown
                      size={20}
                      className={`text-gray-500 darkx:text-gray-400 transition-transform ${
                        expandedStep === step.id ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </button>

                {expandedStep === step.id && (
                  <div className="px-6 py-4 bg-gray-50 darkx:bg-gray-900/50 border-t border-gray-200 darkx:border-gray-700 space-y-4">
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs font-medium text-gray-500 darkx:text-gray-400 uppercase">Title (EN)</p>
                        <p className="text-sm font-medium text-gray-900 darkx:text-white">{step.title}</p>
                      </div>
                      
                      {step.title_ar && (
                        <div>
                          <p className="text-xs font-medium text-gray-500 darkx:text-gray-400 uppercase">Title (AR)</p>
                          <p className="text-sm font-medium text-gray-900 darkx:text-white" dir="rtl">{step.title_ar}</p>
                        </div>
                      )}
                      
                      {step.description && (
                        <div>
                          <p className="text-xs font-medium text-gray-500 darkx:text-gray-400 uppercase">Description (EN)</p>
                          <p className="text-sm text-gray-600 darkx:text-gray-400">{step.description}</p>
                        </div>
                      )}
                      
                      {step.description_ar && (
                        <div>
                          <p className="text-xs font-medium text-gray-500 darkx:text-gray-400 uppercase">Description (AR)</p>
                          <p className="text-sm text-gray-600 darkx:text-gray-400" dir="rtl">{step.description_ar}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 flex-col sm:flex-row">
                      <button
                        type="button"
                        onClick={() => handleEditStep(step)}
                        className="flex-1 px-4 py-2 text-success-600 darkx:text-success-400 hover:bg-success-50 darkx:hover:bg-success-500/10 rounded-lg transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isSubmitting}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteStep(step.id)}
                        className="flex-1 px-4 py-2 text-error-600 darkx:text-error-400 hover:bg-error-50 darkx:hover:bg-error-500/10 rounded-lg transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isSubmitting}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex gap-4 justify-end">
        <button
          type="submit"
          className="px-6 py-3 bg-brand-500 text-white rounded-lg hover:bg-brand-600 darkx:hover:bg-brand-400 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : (initialData ? "Update Department" : "Create Department")}
        </button>
      </div>
    </form>
  )
}