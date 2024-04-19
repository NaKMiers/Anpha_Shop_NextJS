import OrderModel from '@/models/OrderModel'
import { NextRequest, NextResponse } from 'next/server'

// Models: Order
import '@/models/OrderModel'

export const dynamic = 'force-dynamic'

// [POST]: /admin/order/calc-income
export async function POST(req: NextRequest) {
  console.log('- Calculate Income -')

  try {
    // get time to calculate income
    const { time, timeType } = await req.json() // timeType can be 'day', 'month', 'year'

    // get day, month, year from time
    let timeRange = null
    const day = new Date(time).getDate()
    const month = new Date(time).getMonth() + 1
    const year = new Date(time).getFullYear()

    if (timeType === 'day') {
      const from = new Date(`${year}/${month}/${day} 00:00:00`)
      const to = new Date(`${year}/${month}/${day + 1} 00:00:00`)

      timeRange = {
        $gte: from,
        $lt: to,
      }
    } else if (timeType === 'month') {
      const from = new Date(`${year}/${month}/1 00:00:00`)
      const to = new Date(`${year}/${month + 1}/1 00:00:00`)

      timeRange = {
        $gte: from,
        $lt: to,
      }
    } else if (timeType === 'year') {
      const from = new Date(`${year}/1/1 00:00:00`)
      const to = new Date(`${year + 1}/1/1 00:00:00`)

      timeRange = {
        $gte: from,
        $lt: to,
      }
    }

    // get all in time from database
    const orders = await OrderModel.find({
      createdAt: timeRange,
      status: 'done',
    }).lean()

    const income = orders.reduce((total, order) => total + order.total, 0)

    // return total income
    return NextResponse.json({ income, message: 'Calculate income successfully' }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
