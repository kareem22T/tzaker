"use client"

import type { Step } from "../../../store/departmentsSlice"
import { ChevronDown, Trash2, Edit } from "lucide-react"

interface StepsListProps {
  steps: Step[]
  expandedStepId?: string
  onToggleExpand: (stepId: string) => void
  onEdit: (step: Step) => void
  onDelete: (stepId: string) => void
}

export default function StepsList({ steps, expandedStepId, onToggleExpand, onEdit, onDelete }: StepsListProps) {
  return (
    <div className="space-y-2">
      {steps.map((step) => (
        <div
          key={step.id}
          className="border border-gray-200 darkx:border-gray-700 rounded-lg overflow-hidden bg-white darkx:bg-gray-800"
        >
          <button
            onClick={() => onToggleExpand(step.id)}
            className="w-full px-4 sm:px-6 py-4 flex items-center justify-between hover:bg-gray-50 darkx:hover:bg-gray-700/50 transition-colors"
          >
            <div className="flex-1 text-left">
              <h3 className="font-semibold text-gray-900 darkx:text-white text-sm sm:text-base">{step.title}</h3>
              <p className="text-xs sm:text-sm text-gray-500 darkx:text-gray-400">
                {step.formFields.length} form fields
              </p>
            </div>
            <ChevronDown
              size={20}
              className={`text-gray-500 darkx:text-gray-400 transition-transform flex-shrink-0 ${expandedStepId === step.id ? "rotate-180" : ""}`}
            />
          </button>

          {expandedStepId === step.id && (
            <div className="px-4 sm:px-6 py-4 bg-gray-50 darkx:bg-gray-900/50 border-t border-gray-200 darkx:border-gray-700 space-y-3">
              {step.description && <p className="text-sm text-gray-600 darkx:text-gray-400">{step.description}</p>}

              <div className="space-y-2">
                <p className="text-xs font-medium text-gray-700 darkx:text-gray-300 uppercase tracking-wider">
                  Form Fields
                </p>
                {step.formFields.map((field) => (
                  <div
                    key={field.id}
                    className="text-sm text-gray-900 darkx:text-white bg-white darkx:bg-gray-800 rounded px-3 py-2"
                  >
                    <span className="font-medium">{field.label}</span>
                    <span className="text-gray-500 darkx:text-gray-400 ml-2">({field.type})</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 pt-4 flex-col sm:flex-row">
                <button
                  onClick={() => onEdit(step)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-brand-600 darkx:text-brand-400 hover:bg-brand-50 darkx:hover:bg-brand-500/10 rounded transition-colors text-sm font-medium"
                >
                  <Edit size={16} />
                  Edit
                </button>
                <button
                  onClick={() => onDelete(step.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-error-600 darkx:text-error-400 hover:bg-error-50 darkx:hover:bg-error-500/10 rounded transition-colors text-sm font-medium"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}