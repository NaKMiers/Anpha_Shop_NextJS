import { connectDatabase } from '@/config/databse'
import OrderModel from '@/models/OrderModel'
import { NextRequest, NextResponse } from 'next/server'
import '@/models/UserModel'

export const dynamic = 'force-dynamic'

// [GET]: /order/:id
export async function GET(req: NextRequest, { params: { code } }: { params: { code: string } }) {
  console.log('- Get Order -')

  // connect to database
  await connectDatabase()

  try {
    // get order from database
    const order = await OrderModel.findOne({ code }).lean()
    // check order
    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 })
    }
    // return order
    return NextResponse.json({ order, message: 'Order found' }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
