import { connectDatabase } from '@/config/databse'
import OrderModel from '@/models/OrderModel'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// [GET]: /admin/order/all
export async function GET() {
  console.log('- Get All Orders -')

  // connect to database
  await connectDatabase()

  try {
    // get all order from database
    const orders = await OrderModel.find().sort({ createdAt: -1 }).limit(8).lean()

    // retunr all orders
    return NextResponse.json({ orders }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
