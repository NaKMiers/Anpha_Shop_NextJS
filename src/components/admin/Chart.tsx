'use client'

import { formatPrice } from '@/utils/number'
import { memo, useState } from 'react'
import { LineChart, ResponsiveContainer, Line, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts'

export type CharDatum = {
  name: string
  value: string | number
}

interface ChartProps {
  data: CharDatum[]
  className?: string
}

// 100 days
const sampleData = [
  { name: 'Day 1', value: 4000 },
  { name: 'Day 2', value: 3000 },
  { name: 'Day 3', value: 2000 },
  { name: 'Day 4', value: 2780 },
  { name: 'Day 5', value: 1890 },
  { name: 'Day 6', value: 2390 },
  { name: 'Day 7', value: 3490 },
  { name: 'Day 8', value: 4000 },
  { name: 'Day 9', value: 3000 },
  { name: 'Day 10', value: 2000 },
  { name: 'Day 11', value: 2780 },
  { name: 'Day 12', value: 1890 },
  { name: 'Day 13', value: 2390 },
  { name: 'Day 14', value: 3490 },
  { name: 'Day 15', value: 4000 },
  { name: 'Day 16', value: 3000 },
  { name: 'Day 17', value: 2000 },
  { name: 'Day 18', value: 2780 },
  { name: 'Day 19', value: 1890 },
  { name: 'Day 20', value: 2390 },
  { name: 'Day 21', value: 3490 },
  { name: 'Day 22', value: 4000 },
  { name: 'Day 23', value: 3000 },
  { name: 'Day 24', value: 2000 },
  { name: 'Day 25', value: 2780 },
  { name: 'Day 26', value: 1890 },
  { name: 'Day 27', value: 2390 },
  { name: 'Day 28', value: 3490 },
  { name: 'Day 29', value: 4000 },
  { name: 'Day 30', value: 3000 },
  { name: 'Day 31', value: 2000 },
  { name: 'Day 32', value: 2780 },
  { name: 'Day 33', value: 1890 },
  { name: 'Day 34', value: 2390 },
  { name: 'Day 35', value: 4000 },
  { name: 'Day 36', value: 3000 },
  { name: 'Day 37', value: 2000 },
  { name: 'Day 38', value: 2780 },
  { name: 'Day 39', value: 1890 },
  { name: 'Day 40', value: 2390 },
  { name: 'Day 41', value: 3490 },
  { name: 'Day 42', value: 4000 },
  { name: 'Day 43', value: 3000 },
  { name: 'Day 44', value: 2000 },
  { name: 'Day 45', value: 2780 },
  { name: 'Day 46', value: 1890 },
  { name: 'Day 47', value: 2390 },
  { name: 'Day 48', value: 3490 },
  { name: 'Day 49', value: 4000 },
  { name: 'Day 50', value: 3000 },
  { name: 'Day 51', value: 2000 },
  { name: 'Day 52', value: 2780 },
  { name: 'Day 53', value: 1890 },
  { name: 'Day 54', value: 2390 },
  { name: 'Day 55', value: 3490 },
  { name: 'Day 56', value: 4000 },
  { name: 'Day 57', value: 3000 },
  { name: 'Day 58', value: 2000 },
  { name: 'Day 59', value: 2780 },
  { name: 'Day 60', value: 1890 },
  { name: 'Day 61', value: 2390 },
  { name: 'Day 62', value: 3490 },
  { name: 'Day 63', value: 4000 },
  { name: 'Day 64', value: 3000 },
  { name: 'Day 65', value: 2000 },
  { name: 'Day 66', value: 2780 },
  { name: 'Day 67', value: 1890 },
  { name: 'Day 68', value: 2390 },
  { name: 'Day 69', value: 4000 },
  { name: 'Day 70', value: 3000 },
  { name: 'Day 71', value: 2000 },
  { name: 'Day 72', value: 2780 },
  { name: 'Day 73', value: 1890 },
  { name: 'Day 74', value: 2390 },
  { name: 'Day 75', value: 3490 },
  { name: 'Day 76', value: 4000 },
  { name: 'Day 77', value: 3000 },
  { name: 'Day 78', value: 2000 },
  { name: 'Day 79', value: 2780 },
  { name: 'Day 80', value: 1890 },
  { name: 'Day 81', value: 2390 },
  { name: 'Day 82', value: 3490 },
  { name: 'Day 83', value: 4000 },
  { name: 'Day 84', value: 3000 },
  { name: 'Day 85', value: 2000 },
  { name: 'Day 86', value: 2780 },
  { name: 'Day 87', value: 1890 },
  { name: 'Day 88', value: 2390 },
  { name: 'Day 89', value: 3490 },
  { name: 'Day 90', value: 4000 },
  { name: 'Day 91', value: 3000 },
  { name: 'Day 92', value: 2000 },
  { name: 'Day 93', value: 2780 },
  { name: 'Day 94', value: 1890 },
  { name: 'Day 95', value: 2390 },
  { name: 'Day 96', value: 3490 },
  { name: 'Day 97', value: 4000 },
  { name: 'Day 98', value: 3000 },
  { name: 'Day 99', value: 2000 },
  { name: 'Day 100', value: 2780 },
  { name: 'Day 101', value: 1890 },
  { name: 'Day 102', value: 2390 },
  { name: 'Day 103', value: 4000 },
  { name: 'Day 104', value: 3000 },
  { name: 'Day 105', value: 2000 },
  { name: 'Day 106', value: 2780 },
  { name: 'Day 107', value: 1890 },
  { name: 'Day 108', value: 2390 },
  { name: 'Day 109', value: 3490 },
  { name: 'Day 110', value: 4000 },
  { name: 'Day 111', value: 3000 },
  { name: 'Day 112', value: 2000 },
  { name: 'Day 113', value: 2780 },
  { name: 'Day 114', value: 1890 },
  { name: 'Day 115', value: 2390 },
  { name: 'Day 116', value: 3490 },
  { name: 'Day 117', value: 4000 },
  { name: 'Day 118', value: 3000 },
  { name: 'Day 119', value: 2000 },
  { name: 'Day 120', value: 2780 },
  { name: 'Day 121', value: 1890 },
  { name: 'Day 122', value: 2390 },
  { name: 'Day 123', value: 3490 },
  { name: 'Day 124', value: 4000 },
  { name: 'Day 125', value: 3000 },
  { name: 'Day 126', value: 2000 },
  { name: 'Day 127', value: 2780 },
  { name: 'Day 128', value: 1890 },
  { name: 'Day 129', value: 2390 },
  { name: 'Day 130', value: 3490 },
  { name: 'Day 131', value: 4000 },
  { name: 'Day 132', value: 3000 },
  { name: 'Day 133', value: 2000 },
  { name: 'Day 134', value: 2780 },
  { name: 'Day 135', value: 1890 },
  { name: 'Day 136', value: 2390 },
  { name: 'Day 137', value: 4000 },
  { name: 'Day 138', value: 3000 },
  { name: 'Day 139', value: 2000 },
  { name: 'Day 140', value: 2780 },
  { name: 'Day 141', value: 1890 },
  { name: 'Day 142', value: 2390 },
  { name: 'Day 143', value: 3490 },
  { name: 'Day 144', value: 4000 },
  { name: 'Day 145', value: 3000 },
  { name: 'Day 146', value: 2000 },
  { name: 'Day 147', value: 2780 },
  { name: 'Day 148', value: 1890 },
  { name: 'Day 149', value: 2390 },
  { name: 'Day 150', value: 3490 },
  { name: 'Day 151', value: 4000 },
  { name: 'Day 152', value: 3000 },
  { name: 'Day 153', value: 2000 },
  { name: 'Day 154', value: 2780 },
  { name: 'Day 155', value: 1890 },
  { name: 'Day 156', value: 2390 },
  { name: 'Day 157', value: 3490 },
  { name: 'Day 158', value: 4000 },
  { name: 'Day 159', value: 3000 },
  { name: 'Day 160', value: 2000 },
  { name: 'Day 161', value: 2780 },
  { name: 'Day 162', value: 1890 },
  { name: 'Day 163', value: 2390 },
  { name: 'Day 164', value: 3490 },
  { name: 'Day 165', value: 4000 },
  { name: 'Day 166', value: 3000 },
  { name: 'Day 167', value: 2000 },
  { name: 'Day 168', value: 2780 },
  { name: 'Day 169', value: 1890 },
  { name: 'Day 170', value: 2390 },
]

function Chart({ data = sampleData, className = '' }: ChartProps) {
  console.log('Chart Rendered', data)

  return (
    <div className={`relative ${className}`}>
      <ResponsiveContainer
        width="100%"
        height={440}
      >
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis
            dataKey={'name'}
            tickLine={false}
            axisLine={false}
            fontSize={12}
          />
          <YAxis
            dataKey={'value'}
            tickLine={false}
            axisLine={false}
            fontSize={12}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#111"
            strokeWidth={2}
            dot={{ stroke: '#111', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Tooltip
            cursor={{
              stroke: '#333',
              strokeWidth: 2,
              fill: '#fff',
              radius: 4,
              className: 'transition-all duration-75',
            }}
            animationEasing="ease-in-out"
            animationDuration={200}
            formatter={value => {
              const formattedValue = formatPrice(+value)
              return [`Revenue: ${formattedValue}`]
            }}
            labelStyle={{ color: '#01dbe5' }}
            contentStyle={{
              background: '#fff',
              borderRadius: 8,
              border: 'none',
              boxShadow: '0px 14px 10px 5px rgba(0, 0, 0, 0.2)',
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default memo(Chart)
