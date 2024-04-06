import { connectDatabase } from '@/config/databse'
import OrderModel from '@/models/OrderModel'
import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// [GET]: /admin/order/all
export async function GET(req: NextRequest) {
  console.log('- Get Order History -')

  // connect to database
  await connectDatabase()

  // get userId to get user's order history
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  const userId = token?._id

  try {
    // check if userId not exist
    if (!userId) {
      return NextResponse.json({ message: 'User không tồn tại' }, { status: 401 })
    }

    // get all order from database
    const orders = await OrderModel.find({
      userId,
    })
      .sort({ createdAt: -1 })
      .limit(8)
      .lean()

    // retunr all orders
    return NextResponse.json({ orders }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
