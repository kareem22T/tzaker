"use client"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical } from "lucide-react"
import type { Faq } from "../../../store/faqsSlice"

interface DraggableFaqCardProps {
  faq: Faq
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  isDeleting?: boolean
}

export default function DraggableFaqCard({ faq, onEdit, onDelete, isDeleting = false }: DraggableFaqCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: faq.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white darkx:bg-gray-800 border border-gray-200 darkx:border-gray-700 rounded-lg p-6 transition-all ${
        isDragging ? "shadow-lg ring-2 ring-brand-500" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <button
            {...attributes}
            {...listeners}
            className="flex-shrink-0 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 darkx:hover:text-gray-300 mt-1"
            aria-label="Drag to reorder"
            disabled={isDeleting}
          >
            <GripVertical size={20} />
          </button>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 darkx:text-white mb-2 break-words">{faq.question}</h3>
            <div
              className="text-gray-600 darkx:text-gray-400 text-sm prose darkx:prose-invert max-w-none line-clamp-3"
              dangerouslySetInnerHTML={{ __html: faq.answer }}
            />
          </div>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={() => onEdit(faq.id)}
            disabled={isDeleting}
            className="px-4 py-2 text-green-600 darkx:text-green-400 hover:bg-green-50 darkx:hover:bg-green-500/10 rounded-lg transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(faq.id)}
            disabled={isDeleting}
            className="px-4 py-2 text-red-600 darkx:text-red-400 hover:bg-red-50 darkx:hover:bg-red-500/10 rounded-lg transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}