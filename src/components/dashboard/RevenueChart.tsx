'use client'

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

interface RevenueChartProps {
  labels: string[]
  data: number[]
}

export default function RevenueChart({ labels, data }: RevenueChartProps) {
  const chartData = labels.map((label, index) => ({
    name: label,
    total: data[index] || 0,
  }))

  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={chartData}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip 
          formatter={(value: number) => [`$${value}`, 'Revenue']}
          contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
        />
        <Line
          type="monotone"
          dataKey="total"
          stroke="currentColor"
          strokeWidth={2}
          activeDot={{ r: 6, fill: "currentColor" }}
          className="stroke-primary"
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
