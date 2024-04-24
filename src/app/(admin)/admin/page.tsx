'use client'

import Divider from '@/components/Divider'
import { formatPrice } from '@/utils/number'
import { FaDollarSign } from 'react-icons/fa'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const chartData = [
  {
    name: 'Jan',
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: 'February',
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: 'March',
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: 'April',
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: 'May',
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: 'June',
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: 'July',
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: 'August',
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: 'September',
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: 'October',
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: 'November',
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: 'December',
    total: Math.floor(Math.random() * 5000) + 1000,
  },
]

function AdminPage() {
  return (
    <div className='bg-white text-dark rounded-medium shadow-medium p-21'>
      {/* Staticticals */}
      <h1 className='text-2xl font-semibold'>Dashboard</h1>

      <Divider size={6} />

      <div className='grid grid-cols-12 gap-x-21 gap-y-16'>
        {/* Stats */}
        <div className='col-span-12 grid grid-cols-5 gap-x-21 gap-y-21/2'>
          {/* Revenue */}
          <div className='p-21 rounded-lg shadow-lg bg-white'>
            <div className='flex justify-between items-center mb-3'>
              <span className='font-body tracking-wider text-lg'>Revenue</span>
              <FaDollarSign size={20} />
            </div>

            <p className='font-semibold text-3xl mb-3'>{formatPrice(200000)}</p>
            <p className='text-slate-500 text-sm'>+20.1% from last month</p>
          </div>

          {/* Order */}
          <div className='p-21 rounded-lg shadow-lg bg-white'>
            <div className='flex justify-between items-center mb-3'>
              <span className='font-body tracking-wider text-lg'>Order</span>
              <FaDollarSign size={20} />
            </div>

            <p className='font-semibold text-3xl mb-3'>+{600}</p>
            <p className='text-slate-500 text-sm'>+20.1% from last month</p>
          </div>

          {/* Account */}
          <div className='p-21 rounded-lg shadow-lg bg-white'>
            <div className='flex justify-between items-center mb-3'>
              <span className='font-body tracking-wider text-lg'>Account</span>
              <FaDollarSign size={20} />
            </div>

            <p className='font-semibold text-3xl mb-3'>+{700}</p>
            <p className='text-slate-500 text-sm'>+20.1% from last month</p>
          </div>

          {/* User */}
          <div className='p-21 rounded-lg shadow-lg bg-white'>
            <div className='flex justify-between items-center mb-3'>
              <span className='font-body tracking-wider text-lg'>New User</span>
              <FaDollarSign size={20} />
            </div>

            <p className='font-semibold text-3xl mb-3'>+{100}</p>
            <p className='text-slate-500 text-sm'>+20.1% from last month</p>
          </div>

          {/* Voucher */}
          <div className='p-21 rounded-lg shadow-lg bg-white'>
            <div className='flex justify-between items-center mb-3'>
              <span className='font-body tracking-wider text-lg'>Voucher</span>
              <FaDollarSign size={20} />
            </div>

            <p className='font-semibold text-3xl mb-3'>+{50}</p>
            <p className='text-slate-500 text-sm'>+20.1% from last month</p>
          </div>
        </div>

        {/* Chart & Rank */}
        <div className='col-span-12 grid grid-cols-12 gap-21'>
          {/* BarChart */}
          <div className='col-span-7 h-[600px]'>
            <ResponsiveContainer>
              <BarChart data={chartData}>
                {/* <Legend /> */}
                <CartesianGrid strokeDasharray='3 3' />

                <XAxis dataKey={'name'} tickLine={false} axisLine={false} fontSize={12} />
                <YAxis dataKey={'total'} tickLine={false} axisLine={false} fontSize={12} />
                <Bar dataKey={'total'} fill='#111' radius={[4, 4, 4, 4]} />
                <Tooltip
                  cursor={{ stroke: '#333', strokeWidth: 2 }}
                  animationEasing='ease-in-out'
                  animationDuration={200}
                  labelFormatter={value => `Month: ${value}`}
                  labelStyle={{ color: '#f44336' }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Rank */}
          <div className='col-span-5'></div>
        </div>
      </div>
    </div>
  )
}

export default AdminPage
