import type { Application } from "../../../store/applicationsSlice"

interface ApplicationsTableProps {
  applications: Application[]
}

export function ApplicationsTable({ applications }: ApplicationsTableProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 darkx:bg-green-900 darkx:text-green-200"
      case "rejected":
        return "bg-red-100 text-red-800 darkx:bg-red-900 darkx:text-red-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 darkx:bg-yellow-900 darkx:text-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 darkx:bg-gray-900 darkx:text-gray-200"
    }
  }

  return (
    <div className="border border-border bg-card rounded-lg overflow-hidden">
      {/* Header */}
      <div className="border-b border-border px-6 py-4">
        <h2 className="text-lg font-semibold text-foreground">Recent Applications</h2>
        <p className="text-sm text-muted-foreground">Last 10 applications submitted</p>
      </div>
      {/* Table Content */}
      <div className="overflow-x-auto p-6">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Applicant</th>
              <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Department</th>
              <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Completion</th>
              <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Status</th>
              <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Date</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app.id} className="border-b border-border hover:bg-accent/50 transition-colors">
                <td className="py-3 px-4 text-sm text-foreground font-medium">{app.userName}</td>
                <td className="py-3 px-4 text-sm text-muted-foreground">{app.departmentName}</td>
                <td className="py-3 px-4">
                  <div className="w-24 bg-muted rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all"
                      style={{ width: `${app.completionPercentage}%` }}
                    ></div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded text-xs font-medium ${getStatusColor(app.status)}`}
                  >
                    {app.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-sm text-muted-foreground">
                  {new Date(app.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
