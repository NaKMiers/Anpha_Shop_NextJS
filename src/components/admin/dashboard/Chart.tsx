'use client'

import { formatPrice } from '@/utils/number'
import { capitalize } from '@/utils/string'
import { memo, useState } from 'react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { ActiveBlockType } from './Blocks'
import { AnimatePresence, motion } from 'framer-motion'

export type ChartDatum = {
  name: string
  value: string | number
}

interface ChartProps {
  activeBlock: ActiveBlockType
  data: ChartDatum[]
  className?: string
}

export type ChartType = 'Line' | 'Bar' | 'Area' | 'Pie' | 'Radar'

const COLORS = ['#111', '#01dbe5', '#ff6347', '#ffa500', '#8a2be2']
function Chart({ activeBlock, data = [], className = '' }: ChartProps) {
  // states
  const [open, setOpen] = useState(false)
  const [chart, setChart] = useState<ChartType>('Line')

  // values
  const charts: ChartType[] = ['Line', 'Bar', 'Area', 'Pie', 'Radar']

  return (
    <div className={`relative ${className}`}>
      {/* overlay */}
      {open && (
        <div
          className="fixed left-0 top-0 z-20 h-screen w-screen"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Chart Selection */}
      <div className="absolute right-2 top-0 z-20">
        <button
          className="trans-200 rounded-md bg-dark-100 px-2 py-1.5 text-xs font-semibold text-light shadow-md hover:bg-slate-700"
          onClick={() => setOpen(!open)}
        >
          {chart}
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="absolute left-0 top-[calc(100%+10.5px)] z-10 flex max-h-[400px] max-w-[calc(100vw-2*21px)] flex-col gap-0.5 overflow-y-auto rounded-md bg-white shadow-md"
              onClick={() => setOpen(false)}
            >
              {charts.map((type, index) => (
                <button
                  className={`trans-200 trans-200 px-3 py-1 text-left font-body text-xs font-semibold tracking-wider hover:bg-slate-100 ${
                    chart === type ? 'border-l-2 border-primary pl-2' : ''
                  }`}
                  onClick={() => setChart(type)}
                  key={index}
                >
                  <p className="text-nowrap">{type}</p>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <ResponsiveContainer
        width="100%"
        height={440}
      >
        {chart === 'Line' ? (
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
                const formattedValue = ['revenue', 'costs'].includes(activeBlock)
                  ? formatPrice(+value)
                  : value
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
        ) : chart === 'Bar' ? (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              fontSize={12}
            />
            <YAxis
              dataKey="value"
              tickLine={false}
              axisLine={false}
              fontSize={12}
            />
            <Bar
              dataKey="value"
              fill="#111"
              radius={[6, 6, 0, 0]}
              barSize={30}
            />
            <Tooltip
              cursor={{ fill: 'rgba(0,0,0,0.1)' }}
              animationEasing="ease-in-out"
              animationDuration={200}
              formatter={value => {
                const formattedValue = ['revenue', 'costs'].includes(activeBlock)
                  ? formatPrice(+value)
                  : value
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
          </BarChart>
        ) : chart === 'Area' ? (
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              fontSize={12}
            />
            <YAxis
              dataKey="value"
              tickLine={false}
              axisLine={false}
              fontSize={12}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#111"
              strokeWidth={2}
              fill="rgba(17, 17, 17, 0.2)" // Semi-transparent fill
              activeDot={{ r: 6 }}
            />
            <Tooltip
              cursor={{ fill: 'rgba(0,0,0,0.1)' }}
              animationEasing="ease-in-out"
              animationDuration={200}
              formatter={value => {
                const formattedValue = ['revenue', 'costs'].includes(activeBlock)
                  ? formatPrice(+value)
                  : value
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
          </AreaChart>
        ) : chart === 'Pie' ? (
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={120}
              innerRadius={60}
              fill="#8884d8"
              paddingAngle={5}
              label={({ name }) => capitalize(name)}
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => {
                const formattedValue = ['revenue', 'costs'].includes(activeBlock)
                  ? formatPrice(+value)
                  : value
                return [`${formattedValue}`, capitalize(String(name))]
              }}
              contentStyle={{
                background: '#fff',
                borderRadius: 8,
                border: 'none',
                boxShadow: '0px 14px 10px 5px rgba(0, 0, 0, 0.2)',
              }}
            />
          </PieChart>
        ) : (
          <RadarChart data={data}>
            <PolarGrid />
            <PolarAngleAxis
              dataKey="name"
              fontSize={12}
            />
            <PolarRadiusAxis />
            <Radar
              name={capitalize(activeBlock)}
              dataKey="value"
              stroke="#111"
              fill="#01dbe5"
              fillOpacity={0.6}
            />
            <Tooltip
              formatter={(value, name) => {
                const formattedValue = ['revenue', 'costs'].includes(activeBlock)
                  ? formatPrice(+value)
                  : value
                return [`${capitalize(activeBlock)}: ${formattedValue}`, capitalize(String(name))]
              }}
              contentStyle={{
                background: '#fff',
                borderRadius: 8,
                border: 'none',
                boxShadow: '0px 14px 10px 5px rgba(0, 0, 0, 0.2)',
              }}
            />
          </RadarChart>
        )}
      </ResponsiveContainer>
    </div>
  )
}

export default memo(Chart)
