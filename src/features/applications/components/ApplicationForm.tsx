"use client"

import type React from "react"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import type { Department } from "../../../store/departmentsSlice"
import type { Application } from "../../../store/applicationsSlice"

interface ApplicationFormProps {
  departments: Department[]
  initialData?: Application
  onSubmit: (data: Partial<Application>) => void
}

export default function ApplicationForm({ departments, initialData, onSubmit }: ApplicationFormProps) {
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(
    initialData ? departments.find((d) => d.id === initialData.departmentId) || null : null,
  )
  const [expandedStep, setExpandedStep] = useState<string | null>(null)
  const [formDataByStep, setFormDataByStep] = useState<Record<string, Record<string, unknown>>>(
    initialData?.steps.reduce(
      (acc, step) => {
        acc[step.stepId] = step.formData
        return acc
      },
      {} as Record<string, Record<string, unknown>>,
    ) || {},
  )

  const handleInputChange = (stepId: string, fieldName: string, value: unknown) => {
    setFormDataByStep((prev) => ({
      ...prev,
      [stepId]: {
        ...prev[stepId],
        [fieldName]: value,
      },
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedDepartment) {
      alert("Please select a department")
      return
    }

    const steps = selectedDepartment.steps.map((step) => ({
      stepId: step.id,
      stepTitle: step.title,
      formData: formDataByStep[step.id] || {},
      completed: true,
    }))

    const completionPercentage = Math.round(
      (steps.filter((s) => Object.keys(s.formData).length > 0).length / steps.length) * 100,
    )

    onSubmit({
      departmentId: selectedDepartment.id,
      departmentName: selectedDepartment.name,
      steps,
      completionPercentage,
    })
  }

  if (!selectedDepartment) {
    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white darkx:bg-gray-800 border border-gray-200 darkx:border-gray-700 rounded-xl p-6 sm:p-8">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 darkx:text-white mb-4">Select Department</h2>
          <select
            value=""
            onChange={(e) => {
              const dept = departments.find((d) => d.id === e.target.value)
              setSelectedDepartment(dept || null)
            }}
            className="w-full px-4 py-3 bg-white darkx:bg-gray-900 border border-gray-200 darkx:border-gray-700 rounded-lg text-gray-900 darkx:text-white placeholder-gray-500 darkx:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 darkx:focus:ring-blue-400"
            required
          >
            <option value="">Choose a department...</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>
      </form>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white darkx:bg-gray-800 border border-gray-200 darkx:border-gray-700 rounded-xl p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6 flex-col sm:flex-row gap-4">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 darkx:text-white">
              {selectedDepartment.name}
            </h2>
            <p className="text-sm text-gray-600 darkx:text-gray-400 mt-1">{selectedDepartment.description}</p>
          </div>
          <button
            type="button"
            onClick={() => {
              setSelectedDepartment(null)
              setFormDataByStep({})
            }}
            className="px-4 py-2 text-sm font-medium text-gray-700 darkx:text-gray-300 hover:bg-gray-100 darkx:hover:bg-gray-700 rounded-lg transition-colors"
          >
            Change Department
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {selectedDepartment.steps.map((step) => (
          <div
            key={step.id}
            className="bg-white darkx:bg-gray-800 border border-gray-200 darkx:border-gray-700 rounded-lg overflow-hidden"
          >
            <button
              type="button"
              onClick={() => setExpandedStep(expandedStep === step.id ? null : step.id)}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 darkx:hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex-1 text-left">
                <h3 className="font-semibold text-gray-900 darkx:text-white">
                  Step {step.order}: {step.title}
                </h3>
                <p className="text-sm text-gray-500 darkx:text-gray-400">{step.formFields.length} fields</p>
              </div>
              <ChevronDown
                size={20}
                className={`text-gray-500 darkx:text-gray-400 transition-transform ${expandedStep === step.id ? "rotate-180" : ""}`}
              />
            </button>

            {expandedStep === step.id && (
              <div className="px-6 py-4 bg-gray-50 darkx:bg-gray-900/50 border-t border-gray-200 darkx:border-gray-700 space-y-4">
                {step.description && <p className="text-sm text-gray-600 darkx:text-gray-400">{step.description}</p>}

                <div className="space-y-4">
                  {step.formFields.map((field) => (
                    <div key={field.id}>
                      <label className="block text-sm font-medium text-gray-700 darkx:text-gray-300 mb-2">
                        {field.label} {field.required && <span className="text-red-500">*</span>}
                      </label>

                      {field.type === "text" && (
                        <input
                          type="text"
                          placeholder={field.placeholder}
                          value={(formDataByStep[step.id]?.[field.name] as string) || ""}
                          onChange={(e) => handleInputChange(step.id, field.name, e.target.value)}
                          required={field.required}
                          className="w-full px-3 py-2 bg-white darkx:bg-gray-800 border border-gray-200 darkx:border-gray-700 rounded-lg text-gray-900 darkx:text-white placeholder-gray-500 darkx:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 darkx:focus:ring-blue-400"
                        />
                      )}

                      {field.type === "textarea" && (
                        <textarea
                          placeholder={field.placeholder}
                          value={(formDataByStep[step.id]?.[field.name] as string) || ""}
                          onChange={(e) => handleInputChange(step.id, field.name, e.target.value)}
                          required={field.required}
                          rows={3}
                          className="w-full px-3 py-2 bg-white darkx:bg-gray-800 border border-gray-200 darkx:border-gray-700 rounded-lg text-gray-900 darkx:text-white placeholder-gray-500 darkx:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 darkx:focus:ring-blue-400 resize-none"
                        />
                      )}

                      {field.type === "select" && (
                        <select
                          value={(formDataByStep[step.id]?.[field.name] as string) || ""}
                          onChange={(e) => handleInputChange(step.id, field.name, e.target.value)}
                          required={field.required}
                          className="w-full px-3 py-2 bg-white darkx:bg-gray-800 border border-gray-200 darkx:border-gray-700 rounded-lg text-gray-900 darkx:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 darkx:focus:ring-blue-400"
                        >
                          <option value="">Select an option...</option>
                          {field.options?.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      )}

                      {field.type === "file" && (
                        <input
                          type="file"
                          onChange={(e) => handleInputChange(step.id, field.name, e.target.files?.[0])}
                          required={field.required}
                          className="w-full px-3 py-2 bg-white darkx:bg-gray-800 border border-gray-200 darkx:border-gray-700 rounded-lg text-gray-900 darkx:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 darkx:focus:ring-blue-400"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-4 justify-end">
        <button
          type="submit"
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 darkx:hover:bg-blue-400 transition-colors font-medium"
        >
          {initialData ? "Update Application" : "Submit Application"}
        </button>
      </div>
    </form>
  )
}
