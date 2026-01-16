"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface TrendItem {
  date: string
  status: string
  count: number
}

interface BarChartOneProps {
  statusTrend?: Record<string, TrendItem[]>
}

function transformStatusTrend(statusTrend?: Record<string, TrendItem[]>) {
  if (!statusTrend) return null

  // Build sorted dates
  const dates = Object.keys(statusTrend).sort()

  return dates.map((date) => {
    const items = statusTrend[date] || []
    const entry: any = { date }
    // Map known statuses to numeric values
    items.forEach((it) => {
      entry[it.status] = it.count
    })
    // ensure default 0 values
    entry.pending = entry.pending ?? 0
    entry.approved = entry.approved ?? 0
    entry.rejected = entry.rejected ?? 0
    // Also include total submitted if needed
    entry.submitted = (entry.pending || 0) + (entry.approved || 0) + (entry.rejected || 0)
    return entry
  })
}

export function BarChartOne({ statusTrend }: BarChartOneProps) {
  const apiData = transformStatusTrend(statusTrend)

  const fallback = [
    { month: "Jan", submitted: 168, approved: 110, rejected: 58 },
    { month: "Feb", submitted: 185, approved: 130, rejected: 55 },
    { month: "Mar", submitted: 201, approved: 155, rejected: 46 },
    { month: "Apr", submitted: 198, approved: 145, rejected: 53 },
    { month: "May", submitted: 187, approved: 135, rejected: 52 },
    { month: "Jun", submitted: 195, approved: 142, rejected: 53 },
    { month: "Jul", submitted: 210, approved: 165, rejected: 45 },
    { month: "Aug", submitted: 215, approved: 172, rejected: 43 },
    { month: "Sep", submitted: 230, approved: 185, rejected: 45 },
    { month: "Oct", submitted: 220, approved: 175, rejected: 45 },
    { month: "Nov", submitted: 240, approved: 195, rejected: 45 },
    { month: "Dec", submitted: 235, approved: 190, rejected: 45 },
  ]

  const data = apiData ? apiData.map((d) => ({ month: d.date, ...d })) : fallback

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="month" stroke="#64748b" />
        <YAxis stroke="#64748b" />
        <Tooltip
          contentStyle={{
            backgroundColor: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
          }}
        />
        <Legend />
        <Bar dataKey="submitted" fill="#343434ff" radius={[8, 8, 0, 0]} />
        <Bar dataKey="approved" fill="#10b981" radius={[8, 8, 0, 0]} />
        <Bar dataKey="rejected" fill="#ef4444" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}