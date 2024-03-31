import { connectDatabase } from '@/config/databse'
import OrderModel from '@/models/OrderModel'
import { NextRequest, NextResponse } from 'next/server'

// [GET]: /admin/order/:id/user
export async function GET(req: NextRequest, { params: { id } }: { params: { id: string } }) {
  console.log('getUserOrders')

  // connect to database
  connectDatabase()

  try {
    // get user's orders
    const orders = await OrderModel.find({ userId: id }).populate('voucherApplied').lean()

    // return user's orders
    return NextResponse.json({ orders }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
