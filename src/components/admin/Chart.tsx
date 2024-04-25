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

        console.log('by: ', by)

        if (by === 'day') {
          // Lấy danh sách các ngày từ ngày đầu tiên của tháng hiện tại đến ngày hiện tại
          const days = Array.from({ length: currentTime.daysInMonth() }, (_, i) => i + 1)

          // Khởi tạo mảng dữ liệu cho biểu đồ
          chartData = days.map((day: number) => {
            // Tìm các đơn hàng trong ngày hiện tại
            const ordersInDay = orders.filter((order: any) => {
              const orderDay = moment(order.createdAt).format('D')
              return orderDay === day.toString()
            })

            // Tính tổng doanh thu của các đơn hàng trong ngày
            const totalRevenue = ordersInDay.reduce((acc: number, order: any) => {
              return acc + order.total
            }, 0)

            // Trả về đối tượng dữ liệu cho ngày hiện tại
            return {
              name: day.toString(),
              revenue: totalRevenue,
            }
          })
        } else if (by === 'month') {
          // Lấy danh sách các tháng từ tháng đầu tiên của năm hiện tại đến tháng hiện tại
          const months = Array.from({ length: currentTime.month() + 1 }, (_, i) => {
            const month = i + 1
            return month
          })

          console.log('months: ', months)

          // Khởi tạo mảng dữ liệu cho biểu đồ
          chartData = Array.from({ length: 12 }).map((_, index) => {
            // Tìm các đơn hàng trong tháng hiện tại
            const ordersInMonth =
              index <= currentTime.month()
                ? orders.filter((order: any) => {
                    const orderMonth = moment(order.createdAt).format('M')
                    console.log('orderMonth: ', orderMonth)
                    return orderMonth === (index + 1).toString()
                  })
                : []

            // Tính tổng doanh thu của các đơn hàng trong tháng
            const totalRevenue = ordersInMonth.reduce((acc: number, order: any) => {
              return acc + order.total
            }, 0)

            // Trả về đối tượng dữ liệu cho tháng hiện tại
            return {
              name: moment(index + 1, 'M').format('MMM'),
              revenue: totalRevenue,
            }
          })
        } else if (by === 'year') {
          // Lấy danh sách các năm từ 5 năm trước đến năm hiện tại
          console.log('currentTime.year(): ', currentTime.year())

          const years = Array.from({ length: 5 }, (_, i) => currentTime.year() - i).reverse()

          // Khởi tạo mảng dữ liệu cho biểu đồ
          chartData = years.map((year: number) => {
            // Tìm các đơn hàng trong năm hiện tại
            const ordersInYear = orders.filter((order: any) => {
              const orderYear = moment(order.createdAt).format('YYYY')
              return orderYear === year.toString()
            })

            // Tính tổng doanh thu của các đơn hàng trong năm
            const totalRevenue = ordersInYear.reduce((acc: number, order: any) => {
              return acc + order.total
            }, 0)

            // Trả về đối tượng dữ liệu cho năm hiện tại
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
