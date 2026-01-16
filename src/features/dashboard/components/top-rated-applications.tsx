import type { Application } from "../../../store/applicationsSlice"
import { Star } from "lucide-react"

interface TopRatedApplicationsProps {
  applications: Application[]
}

export function TopRatedApplications({ applications }: TopRatedApplicationsProps) {
  const topRated = applications
    .filter((a) => a.rating && a.rating >= 4)
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 5)

  return (
    <div className="border border-border bg-card rounded-lg overflow-hidden h-fit">
      {/* Header */}
      <div className="border-b border-border px-6 py-4">
        <h2 className="text-lg font-semibold text-foreground">Top Rated</h2>
        <p className="text-sm text-muted-foreground">Best performing applications</p>
      </div>
      {/* Content */}
      <div className="p-6 space-y-4">
        {topRated.length > 0 ? (
          topRated.map((app) => (
            <div
              key={app.id}
              className="flex items-start justify-between p-3 bg-accent/50 rounded-lg hover:bg-accent transition-colors border border-border/50"
            >
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground line-clamp-1">{app.userName}</p>
                <p className="text-xs text-muted-foreground">{app.departmentName}</p>
              </div>
              <div className="flex items-center gap-1 ml-2">
                {Array.from({ length: app.rating || 0 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">No rated applications yet</p>
        )}
      </div>
    </div>
  )
}
