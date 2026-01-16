"use client"
import { useNavigate, useParams } from "react-router"
import { useGetDepartmentQuery, useUpdateDepartmentMutation } from "../../store/api/departmentsApi"
import DepartmentForm from "./components/DepartmentForm"
import type { Department } from "../../store/departmentsSlice"

export default function EditDepartmentPage() {
  const params = useParams()
  const router = useNavigate()
  const departmentId = params.id as string
  
  const { data: department, isLoading, isError } = useGetDepartmentQuery(departmentId)
  const [updateDepartment, { isLoading: isUpdating }] = useUpdateDepartmentMutation()
  
  const handleSubmit = async (data: Partial<Department>) => {
    try {
      // Create FormData to handle file upload
      const formData = new FormData()
      
      // Add basic fields
      formData.append('name', data.name || '')
      formData.append('name_ar', data.name_ar || '')
      formData.append('description', data.description || '')
      formData.append('description_ar', data.description_ar || '')
      
      // Add icon if new one is uploaded
      if (data.icon) {
        formData.append('icon', data.icon)
      }
      
      // Add workflow steps in Laravel's expected format
      if (data.steps && data.steps.length > 0) {
        data.steps.forEach((step, stepIndex) => {
          // Include step ID if it exists (for updates)
          if (step.id && !step.id.includes('-')) {
            formData.append(`workflow_steps[${stepIndex}][id]`, step.id)
          }
          
          formData.append(`workflow_steps[${stepIndex}][title]`, step.title)
          formData.append(`workflow_steps[${stepIndex}][title_ar]`, step.title_ar || '')
          formData.append(`workflow_steps[${stepIndex}][description]`, step.description || '')
          formData.append(`workflow_steps[${stepIndex}][description_ar]`, step.description_ar || '')
          formData.append(`workflow_steps[${stepIndex}][display_order]`, (step.order || stepIndex).toString())
          
          // Add form fields for each step
          step.formFields.forEach((field, fieldIndex) => {
            // Include field ID if it exists (for updates)
            if (field.id && !field.id.includes('-')) {
              formData.append(`workflow_steps[${stepIndex}][form_fields][${fieldIndex}][id]`, field.id)
            }
            
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
      
      await updateDepartment({ id: departmentId, data: formData }).unwrap()
      router("/departments")
    } catch (error: any) {
      console.error('Failed to update department:', error)
      alert(error?.data?.message || 'Failed to update department. Please try again.')
    }
  }
  
  if (isLoading) {
    return (
      <main className="min-h-screen py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
          </div>
          <p className="mt-4 text-gray-600 darkx:text-gray-400">Loading department...</p>
        </div>
      </main>
    )
  }
  
  if (isError || !department) {
    return (
      <main className="min-h-screen py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl font-semibold text-gray-900 darkx:text-white mb-2">
            Department not found
          </h1>
          <button
            onClick={() => router("/departments")}
            className="mt-4 px-6 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors"
          >
            Back to Departments
          </button>
        </div>
      </main>
    )
  }
  
  return (
    <main className="min-h-screen py-8 sm:py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-semibold text-gray-900 darkx:text-white mb-2">
            Edit Department
          </h1>
          <p className="text-gray-600 darkx:text-gray-400 text-sm sm:text-base">
            Update department details and manage workflow steps
          </p>
        </div>
        
        {isUpdating && (
          <div className="mb-4 p-4 bg-brand-50 darkx:bg-brand-500/10 border border-brand-200 darkx:border-brand-500/20 rounded-lg text-brand-700 darkx:text-brand-400">
            Updating department...
          </div>
        )}
        
        <DepartmentForm 
          initialData={department} 
          onSubmit={handleSubmit} 
          isSubmitting={isUpdating}
        />
      </div>
    </main>
  )
}