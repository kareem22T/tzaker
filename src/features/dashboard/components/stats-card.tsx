import type { ReactNode } from "react"

interface StatsCardProps {
  title: string
  value: string | number
  description: string
  icon: ReactNode
  trend: string
  variant: "blue" | "green" | "purple" | "yellow"
}

const variantClasses = {
  blue: "bg-blue-50 darkx:bg-blue-950 text-blue-600 darkx:text-blue-400",
  green: "bg-green-50 darkx:bg-green-950 text-green-600 darkx:text-green-400",
  purple: "bg-purple-50 darkx:bg-purple-950 text-purple-600 darkx:text-purple-400",
  yellow: "bg-yellow-50 darkx:bg-yellow-950 text-yellow-600 darkx:text-yellow-400",
}

export function StatsCard({ title, value, description, icon, trend, variant }: StatsCardProps) {
  return (
    <div className="border border-border bg-card hover:shadow-md transition-shadow rounded-lg p-6">
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold text-foreground">{value}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
          <p className="text-xs font-medium text-foreground pt-1">{trend}</p>
        </div>
        <div className={`${variantClasses[variant]} p-3 rounded-lg`}>{icon}</div>
      </div>
    </div>
  )
}
