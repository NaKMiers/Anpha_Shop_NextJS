import { connectDatabase } from '@/config/databse'
import OrderModel from '@/models/OrderModel'
import { NextRequest, NextResponse } from 'next/server'

// [PATCH]: /admin/order/cancel
export async function PATCH(req: NextRequest) {
  console.log('- Cancel Orders -')

  // connect to database
  connectDatabase()

  // get order ids to cancel
  const { ids } = await req.json()

  try {
    // cancel orders
    await OrderModel.updateMany({ _id: { $in: ids } }, { $set: { status: 'cancel' } })

    // get canceled orders
    const canceledOrders = await OrderModel.find({ _id: { $in: ids } }).lean()

    // stay in current page
    return NextResponse.json(
      {
        canceledOrders,
        message: `Order "${canceledOrders.map(order => order.code).join(', ')}" ${
          canceledOrders.length > 1 ? 'have' : 'has'
        } been canceled`,
      },
      { status: 200 }
    )
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
