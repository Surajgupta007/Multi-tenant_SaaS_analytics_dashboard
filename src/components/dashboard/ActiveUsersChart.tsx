'use client'

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

interface ActiveUsersChartProps {
  labels: string[]
  data: number[]
}

export default function ActiveUsersChart({ labels, data }: ActiveUsersChartProps) {
  const chartData = labels.map((label, index) => ({
    name: label,
    total: data[index] || 0,
  }))

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={chartData}>
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
        />
        <Tooltip 
          cursor={{ fill: 'rgba(0,0,0,0.05)' }}
          contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
        />
        <Bar
          dataKey="total"
          fill="#6366f1"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
