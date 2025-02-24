import { connectDatabase } from '@/config/database'
import OrderModel from '@/models/OrderModel'
import { NextRequest, NextResponse } from 'next/server'

// Models: Order
import '@/models/OrderModel'

export const dynamic = 'force-dynamic'

// [GET]: /order/check/:id
export async function GET(req: NextRequest, { params: { id } }: { params: { id: string } }) {
  console.log('- Check Order -')

  try {
    // connect to database
    await connectDatabase()

    // get order by id
    const order = await OrderModel.findOne({ _id: id, status: 'done' }).lean()

    // check if order exists
    if (!order) {
      return NextResponse.json({ order: null, message: 'Không tìm thấy đơn hàng' }, { status: 404 })
    }

    // return response
    return NextResponse.json({ order }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
