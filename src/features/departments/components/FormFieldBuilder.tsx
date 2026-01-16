"use client"

import type React from "react"
import { useState, useEffect } from "react"
import type { FormField } from "../../../store/departmentsSlice"

interface FormFieldBuilderProps {
  field?: FormField  // Optional field for editing
  onAdd: (field: Omit<FormField, "id">) => void
  onUpdate?: (fieldId: string, field: Omit<FormField, "id">) => void  // New prop for updates
  onCancel: () => void
}

export default function FormFieldBuilder({ field, onAdd, onUpdate, onCancel }: FormFieldBuilderProps) {
  const [type, setType] = useState<FormField["type"]>(field?.type || "text")
  const [label, setLabel] = useState(field?.label || "")
  const [labelAr, setLabelAr] = useState(field?.label_ar || "")
  const [name, setName] = useState(field?.name || "")
  const [nameError, setNameError] = useState<string | null>(null)
  const [placeholder, setPlaceholder] = useState(field?.placeholder || "")
  const [placeholderAr, setPlaceholderAr] = useState(field?.placeholder_ar || "")
  const [required, setRequired] = useState(field?.required || false)
  const [options, setOptions] = useState<Array<{ value: string; label: string }>>(field?.options || [])
  const [optionInput, setOptionInput] = useState("")

  // Update form when field prop changes (for editing)
  useEffect(() => {
    if (field) {
      setType(field.type)
      setLabel(field.label)
      setLabelAr(field.label_ar || "")
      setName(field.name)
      setPlaceholder(field.placeholder || "")
      setPlaceholderAr(field.placeholder_ar || "")
      setRequired(field.required || false)
      setOptions(field.options || [])
    }
  }, [field])

  const handleAddOption = () => {
    if (optionInput.trim()) {
      setOptions([...options, { value: optionInput.toLowerCase().replace(/\s+/g, "-"), label: optionInput }])
      setOptionInput("")
    }
  }

  const handleRemoveOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const fieldData = {
        type,
        label,
        label_ar: labelAr,
        name,
        placeholder,
        placeholder_ar: placeholderAr,
        required,
        ...(type === "select" && { options }),
      }

      if (field && onUpdate) {
        // Update existing field
        onUpdate(field.id, fieldData)
      } else {
        // Add new field
        onAdd(fieldData)
      }

      // Reset form only if adding (not editing)
      if (!field) {
        setType("text")
        setLabel("")
        setLabelAr("")
        setName("")
        setPlaceholder("")
        setPlaceholderAr("")
        setRequired(false)
        setOptions([])
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error)
    }
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 darkx:text-gray-300 mb-1">Field Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as FormField["type"])}
            className="w-full px-2 py-2 bg-white darkx:bg-gray-800 border border-gray-200 darkx:border-gray-700 rounded text-sm text-gray-900 darkx:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 darkx:focus:ring-brand-400"
          >
            <option value="text">Text</option>
            <option value="email">Email</option>
            <option value="number">Number</option>
            <option value="textarea">Textarea</option>
            <option value="select">Select</option>
            <option value="radio">Radio</option>
            <option value="checkbox">Checkbox</option>
            <option value="file">File Upload</option>
            <option value="date">Date</option>
            <option value="tel">Telephone</option>
            <option value="url">URL</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 darkx:text-gray-300 mb-1">
            Field Label (English)
          </label>
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="e.g., Full Name"
            className="w-full px-2 py-2 bg-white darkx:bg-gray-800 border border-gray-200 darkx:border-gray-700 rounded text-sm text-gray-900 darkx:text-white placeholder-gray-500 darkx:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 darkx:focus:ring-brand-400"
            required
          />
        </div>
      </div>

      {/* Field Label - Arabic */}
      <div>
        <label className="block text-xs font-medium text-gray-700 darkx:text-gray-300 mb-1">
          Field Label (Arabic)
        </label>
        <input
          type="text"
          value={labelAr}
          onChange={(e) => setLabelAr(e.target.value)}
          placeholder="مثال: الاسم الكامل"
          dir="rtl"
          className="w-full px-2 py-2 bg-white darkx:bg-gray-800 border border-gray-200 darkx:border-gray-700 rounded text-sm text-gray-900 darkx:text-white placeholder-gray-500 darkx:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 darkx:focus:ring-brand-400"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 darkx:text-gray-300 mb-1">
          Field Name (for form submission)
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => {
            const value = e.target.value.replace(/\s+/g, "") // remove spaces live
            setName(value)

            if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(value)) {
              setNameError(
                "No spaces allowed. Use camelCase or snake_case (e.g. fullName or full_name)."
              )
            } else {
              setNameError(null)
            }
          }}
          placeholder="e.g., fullName or full_name"
          className="w-full px-2 py-2 bg-white darkx:bg-gray-800 border border-gray-200 darkx:border-gray-700 rounded text-sm text-gray-900 darkx:text-white placeholder-gray-500 darkx:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 darkx:focus:ring-brand-400"
          required
        />
        {nameError ? (
          <p className="mt-1 text-xs text-error-500">
            {nameError}
          </p>
        ) : (
          <p className="mt-1 text-xs text-gray-500">
            Use camelCase or snake_case. No spaces allowed.
          </p>
        )}
      </div>

      {type !== "file" && type !== "select" && (
        <>
          {/* Placeholder - English */}
          <div>
            <label className="block text-xs font-medium text-gray-700 darkx:text-gray-300 mb-1">
              Placeholder (English)
            </label>
            <input
              type="text"
              value={placeholder}
              onChange={(e) => setPlaceholder(e.target.value)}
              placeholder="Optional placeholder text"
              className="w-full px-2 py-2 bg-white darkx:bg-gray-800 border border-gray-200 darkx:border-gray-700 rounded text-sm text-gray-900 darkx:text-white placeholder-gray-500 darkx:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 darkx:focus:ring-brand-400"
            />
          </div>

          {/* Placeholder - Arabic */}
          <div>
            <label className="block text-xs font-medium text-gray-700 darkx:text-gray-300 mb-1">
              Placeholder (Arabic)
            </label>
            <input
              type="text"
              value={placeholderAr}
              onChange={(e) => setPlaceholderAr(e.target.value)}
              placeholder="نص بديل اختياري"
              dir="rtl"
              className="w-full px-2 py-2 bg-white darkx:bg-gray-800 border border-gray-200 darkx:border-gray-700 rounded text-sm text-gray-900 darkx:text-white placeholder-gray-500 darkx:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 darkx:focus:ring-brand-400"
            />
          </div>
        </>
      )}

      {type === "select" && (
        <div>
          <label className="block text-xs font-medium text-gray-700 darkx:text-gray-300 mb-1">Options</label>
          <div className="flex gap-2 mb-2 flex-col sm:flex-row">
            <input
              type="text"
              value={optionInput}
              onChange={(e) => setOptionInput(e.target.value)}
              placeholder="Add option..."
              className="flex-1 px-2 py-2 bg-white darkx:bg-gray-800 border border-gray-200 darkx:border-gray-700 rounded text-sm text-gray-900 darkx:text-white placeholder-gray-500 darkx:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 darkx:focus:ring-brand-400"
            />
            <button
              type="button"
              onClick={handleAddOption}
              className="px-3 py-2 bg-brand-500 text-white rounded text-sm hover:bg-brand-600 darkx:hover:bg-brand-400 transition-colors"
            >
              Add
            </button>
          </div>
          <div className="space-y-1">
            {options.map((opt, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between px-2 py-1 bg-white darkx:bg-gray-800 rounded border border-gray-200 darkx:border-gray-700"
              >
                <span className="text-sm text-gray-900 darkx:text-white">{opt.label}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveOption(idx)}
                  className="text-xs text-error-500 hover:text-error-600 darkx:text-error-400 darkx:hover:text-error-300"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={required}
          onChange={(e) => setRequired(e.target.checked)}
          className="w-4 h-4 rounded border-gray-300 darkx:border-gray-600 accent-brand-500"
        />
        <span className="text-sm text-gray-700 darkx:text-gray-300">Required field</span>
      </label>

      <div className="flex gap-2 pt-2 flex-col sm:flex-row">
        <button
          onClick={handleSubmit}
          className="flex-1 px-3 py-2 bg-brand-500 text-white rounded text-sm hover:bg-brand-600 darkx:hover:bg-brand-400 font-medium transition-colors"
        >
          {field ? "Update Field" : "Add Field"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-3 py-2 bg-gray-100 darkx:bg-gray-800 text-gray-700 darkx:text-gray-300 rounded text-sm hover:bg-gray-200 darkx:hover:bg-gray-700 font-medium transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}