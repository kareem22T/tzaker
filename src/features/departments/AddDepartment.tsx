"use client"
import { useNavigate } from "react-router"
import { useCreateDepartmentMutation } from "../../store/api/departmentsApi"
import DepartmentForm from "./components/DepartmentForm"
import type { Department } from "../../store/departmentsSlice"

export default function AddDepartmentPage() {
  const router = useNavigate()
  const [createDepartment, { isLoading }] = useCreateDepartmentMutation()

  const handleSubmit = async (data: Partial<Department>) => {
    try {
      // Create FormData to handle file upload
      const formData = new FormData()
      
      // Add basic fields
      formData.append('name', data.name || '')
      formData.append('name_ar', data.name_ar || '')
      formData.append('description', data.description || '')
      formData.append('description_ar', data.description_ar || '')
      
      // Add icon if present
      if (data.icon) {
        formData.append('icon', data.icon)
      }
      
      // Add workflow steps in Laravel's expected format
      if (data.steps && data.steps.length > 0) {
        data.steps.forEach((step, stepIndex) => {
          formData.append(`workflow_steps[${stepIndex}][title]`, step.title)
          formData.append(`workflow_steps[${stepIndex}][title_ar]`, step.title_ar || '')
          formData.append(`workflow_steps[${stepIndex}][description]`, step.description || '')
          formData.append(`workflow_steps[${stepIndex}][description_ar]`, step.description_ar || '')
          formData.append(`workflow_steps[${stepIndex}][display_order]`, stepIndex.toString())
          
          // Add form fields for each step
          step.formFields.forEach((field, fieldIndex) => {
            formData.append(`workflow_steps[${stepIndex}][form_fields][${fieldIndex}][field_type]`, field.type)
            formData.append(`workflow_steps[${stepIndex}][form_fields][${fieldIndex}][field_label]`, field.label)
            formData.append(`workflow_steps[${stepIndex}][form_fields][${fieldIndex}][field_label_ar]`, field.label_ar || '')
            formData.append(`workflow_steps[${stepIndex}][form_fields][${fieldIndex}][field_name]`, field.name)
            formData.append(`workflow_steps[${stepIndex}][form_fields][${fieldIndex}][placeholder]`, field.placeholder || '')
            formData.append(`workflow_steps[${stepIndex}][form_fields][${fieldIndex}][placeholder_ar]`, field.placeholder_ar || '')
            formData.append(`workflow_steps[${stepIndex}][form_fields][${fieldIndex}][is_required]`, field.required ? '1' : '0')
            formData.append(`workflow_steps[${stepIndex}][form_fields][${fieldIndex}][display_order]`, fieldIndex.toString())
            
            // Add options if present
            if (field.options && field.options.length > 0) {
              field.options.forEach((option, optionIndex) => {
                formData.append(`workflow_steps[${stepIndex}][form_fields][${fieldIndex}][field_options][${optionIndex}]`, option.label)
              })
            }
          })
        })
      }
      
      await createDepartment(formData).unwrap()
      router("/departments")
    } catch (error: any) {
      console.error('Failed to create department:', error)
      alert(error?.data?.message || 'Failed to create department. Please try again.')
    }
  }

  return (
    <main className="min-h-screen py-8 sm:py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-semibold text-gray-900 darkx:text-white mb-2">
            Create Department
          </h1>
          <p className="text-gray-600 darkx:text-gray-400 text-sm sm:text-base">
            Set up a new department with steps and workflow forms
          </p>
        </div>

        {isLoading && (
          <div className="mb-4 p-4 bg-brand-50 darkx:bg-brand-500/10 border border-brand-200 darkx:border-brand-500/20 rounded-lg text-brand-700 darkx:text-brand-400">
            Creating department...
          </div>
        )}

        <DepartmentForm onSubmit={handleSubmit} isSubmitting={isLoading} />
      </div>
    </main>
  )
}