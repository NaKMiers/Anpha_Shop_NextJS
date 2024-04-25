'use client'

import { getAllOrdersApi } from '@/requests'
import moment from 'moment'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { FaCircleNotch } from 'react-icons/fa'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

interface ChartProps {
  by: string
  chunk: number
  className?: string
}

function Chart({ by, chunk, className = '' }: ChartProps) {
  // states
  const [loading, setLoading] = useState<boolean>(false)
  const [data, setData] = useState<any>([])

  useEffect(() => {
    const getData = async () => {
      // start loading
      setLoading(true)

      try {
        let from: string = ''
        let to: string = ''
        console.log('by, chunk:', by, chunk)
        const currentTime = moment().subtract(
          chunk,
          by === 'day' ? 'months' : by === 'month' ? 'years' : 'days'
        )

        const cloneCurrentTime = currentTime.clone()
        if (by === 'day') {
          // from first day of current month
          from = cloneCurrentTime.startOf('month').format('YYYY-MM-DD HH:mm:ss')
          // to last day of current month
          to = cloneCurrentTime.endOf('month').format('YYYY-MM-DD HH:mm:ss')
        } else if (by === 'month') {
          // from first month of current year
          from = cloneCurrentTime.startOf('year').format('YYYY-MM-DD HH:mm:ss')
          // to last month of current year
          to = cloneCurrentTime.endOf('year').format('YYYY-MM-DD HH:mm:ss')
        } else if (by === 'year') {
          // from 5 years ago to current year
          from = cloneCurrentTime.subtract(5, 'years').format('YYYY-MM-DD HH:mm:ss')
        }

        const query = `?limit=no-limit&status=done&sort=createdAt|-1&from-to=${from}|${to}`
        const { orders } = await getAllOrdersApi(query)
        console.log('orders: ', orders)

        let chartData: any[] = []

        if (by === 'day') {
          // [1,2,3, ..., daysInMonth]
          const days = Array.from({ length: currentTime.daysInMonth() }, (_, i) => i + 1)

          // build data chart
          chartData = days.map((day: number) => {
            // all orders in day
            const ordersInDay = orders.filter((order: any) => {
              const orderDay = moment(order.createdAt).format('D')
              return orderDay === day.toString()
            })

            // total revenue in day
            const totalRevenue = ordersInDay.reduce((acc: number, order: any) => {
              return acc + order.total
            }, 0)

            // current day revenue
            return {
              name: day.toString(),
              revenue: totalRevenue,
            }
          })
        } else if (by === 'month') {
          // [1, 2, 3, ..., 12]
          const months = Array.from({ length: currentTime.month() + 1 }, (_, i) => {
            const month = i + 1
            return month
          })

          // build data chart
          chartData = Array.from({ length: 12 }).map((_, index) => {
            // all orders in month
            const ordersInMonth =
              index <= currentTime.month()
                ? orders.filter((order: any) => {
                    const orderMonth = moment(order.createdAt).format('M')
                    console.log('orderMonth: ', orderMonth)
                    return orderMonth === (index + 1).toString()
                  })
                : []

            // total revenue in month
            const totalRevenue = ordersInMonth.reduce((acc: number, order: any) => {
              return acc + order.total
            }, 0)

            // current month revenue
            return {
              name: moment(index + 1, 'M').format('MMM'),
              revenue: totalRevenue,
            }
          })
        } else if (by === 'year') {
          // [currentYear - 5, currentYear]
          const years = Array.from({ length: 5 }, (_, i) => currentTime.year() - i).reverse()

          // build data chart
          chartData = years.map((year: number) => {
            // all orders in year
            const ordersInYear = orders.filter((order: any) => {
              const orderYear = moment(order.createdAt).format('YYYY')
              return orderYear === year.toString()
            })

            // total revenue in year
            const totalRevenue = ordersInYear.reduce((acc: number, order: any) => {
              return acc + order.total
            }, 0)

            // current year revenue
            return {
              name: year.toString(),
              revenue: totalRevenue,
            }
          })
        }

        console.log('chartData: ', chartData)
        setData(chartData)
      } catch (err: any) {
        console.log(err)
        toast.error(err.message)
      } finally {
        // stop loading
        setLoading(false)
      }
    }
    getData()
  }, [by, chunk])

  return !loading ? (
    <ResponsiveContainer height={500} className={`${className}`}>
      <BarChart data={data}>
        {/* <Legend /> */}
        <CartesianGrid strokeDasharray='3 3' />

        <XAxis dataKey={'name'} tickLine={false} axisLine={false} fontSize={12} />
        <YAxis dataKey={'revenue'} tickLine={false} axisLine={false} fontSize={12} />
        <Bar dataKey={'revenue'} fill='#111' radius={[4, 4, 4, 4]} />
        <Tooltip
          cursor={{ stroke: '#333', strokeWidth: 2 }}
          animationEasing='ease-in-out'
          animationDuration={200}
          labelStyle={{ color: '#01dbe5' }}
        />
      </BarChart>
    </ResponsiveContainer>
  ) : (
    <div className='flex items-center justify-center h-[500px]'>
      <FaCircleNotch size={50} className='animate-spin text-slate-300' />
    </div>
  )
}

export default Chart
