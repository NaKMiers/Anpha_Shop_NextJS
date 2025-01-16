'use client'

import { ActiveBlockType } from '@/app/(admin)/admin/page'
import { formatPrice } from '@/utils/number'
import { capitalize } from '@/utils/string'
import { memo } from 'react'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

export type ChartDatum = {
  name: string
  value: string | number
}

interface ChartProps {
  activeBlock: ActiveBlockType
  data: ChartDatum[]
  className?: string
}

function Chart({ activeBlock, data = [], className = '' }: ChartProps) {
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
              const formattedValue = activeBlock === 'revenue' ? formatPrice(+value) : value
              return [`${capitalize(activeBlock)}: ${formattedValue}`]
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
