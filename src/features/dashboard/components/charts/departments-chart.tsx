"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface DepartmentsChartProps {
  departmentCounts: Record<string, number>
}

export function DepartmentsChart({ departmentCounts }: DepartmentsChartProps) {
  const data = Object.entries(departmentCounts)
    .map(([name, count]) => ({
      name: name.length > 12 ? name.substring(0, 12) + "..." : name,
      value: count,
    }))
    .sort((a, b) => b.value - a.value)

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} stroke="#64748b" />
        <YAxis stroke="#64748b" />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: "#ffffff", 
            border: "1px solid #e2e8f0",
            borderRadius: "8px"
          }} 
        />
        <Line 
          type="monotone" 
          dataKey="value" 
          stroke="#DBA21A" 
          strokeWidth={3}
          dot={{ fill: "#DBA21A", r: 6 }}
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}