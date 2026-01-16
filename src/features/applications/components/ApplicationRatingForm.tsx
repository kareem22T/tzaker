"use client"

import type React from "react"

import { useState } from "react"
import { Star } from "lucide-react"

interface ApplicationRatingFormProps {
  currentRating?: number
  currentComment?: string
  onSubmit: (rating: number, comment: string) => void
  onCancel: () => void
}

export default function ApplicationRatingForm({
  currentRating = 0,
  currentComment = "",
  onSubmit,
  onCancel,
}: ApplicationRatingFormProps) {
  const [rating, setRating] = useState(currentRating)
  const [comment, setComment] = useState(currentComment)
  const [hoveredRating, setHoveredRating] = useState(0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (rating === 0) {
      alert("Please select a rating")
      return
    }
    onSubmit(rating, comment)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 darkx:text-gray-300 mb-3">Rate Application</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="transition-transform hover:scale-110"
            >
              <Star
                size={32}
                className={`${
                  star <= (hoveredRating || rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300 darkx:text-gray-600"
                } transition-colors`}
              />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 darkx:text-gray-300 mb-2">Comments (Optional)</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add your feedback..."
          rows={3}
          className="w-full px-3 py-2 bg-white darkx:bg-gray-800 border border-gray-200 darkx:border-gray-700 rounded-lg text-gray-900 darkx:text-white placeholder-gray-500 darkx:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 darkx:focus:ring-blue-400 resize-none"
        />
      </div>

      <div className="flex gap-3 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 darkx:text-gray-300 hover:bg-gray-100 darkx:hover:bg-gray-700 rounded-lg transition-colors font-medium text-sm"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 darkx:hover:bg-blue-400 transition-colors font-medium text-sm"
        >
          Submit Rating
        </button>
      </div>
    </form>
  )
}
