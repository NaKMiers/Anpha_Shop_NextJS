import { connectDatabase } from '@/config/databse'
import OrderModel from '@/models/OrderModel'
import { NextRequest, NextResponse } from 'next/server'

// Connect to database
connectDatabase()

// [PATCH]: /admin/order/cancel
export async function PATCH(req: NextRequest) {
  console.log('- Cancel Orders -')

  // get order ids to cancel
  const { ids } = await req.json()

  try {
    // cancel orders
    await OrderModel.updateMany({ _id: { $in: ids } }, { $set: { status: 'cancel' } })

    // get canceled orders
    const canceledOrders = await OrderModel.find({ _id: { $in: ids } }).lean()

    // stay in current page
    return NextResponse.json({ canceledOrders, message: 'Cancel Orders Successfully!' }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
