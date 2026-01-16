"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { month: "Jan", visits: 180 },
  { month: "Feb", visits: 190 },
  { month: "Mar", visits: 170 },
  { month: "Apr", visits: 160 },
  { month: "May", visits: 175 },
  { month: "Jun", visits: 165 },
  { month: "Jul", visits: 170 },
  { month: "Aug", visits: 205 },
  { month: "Sep", visits: 230 },
  { month: "Oct", visits: 210 },
  { month: "Nov", visits: 240 },
  { month: "Dec", visits: 235 },
]

export function LineChartOne() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} layout="vertical" margin={{ top: 20, right: 30, left: 60, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis type="number" stroke="#64748b" />
        <YAxis dataKey="month" type="category" stroke="#64748b" />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: "#ffffff", 
            border: "1px solid #e2e8f0",
            borderRadius: "8px"
          }} 
        />
        <Bar dataKey="visits" fill="#DBA21A" radius={[0, 8, 8, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}