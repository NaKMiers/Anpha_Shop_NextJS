import OrderModel from '@/models/OrderModel'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  console.log('- Important -')

  try {
    let orders: any[] = await OrderModel.find().lean()

    orders = orders.filter(order => order.voucherApplied === '').map(order => order._id)

    await OrderModel.updateMany(
      {
        _id: { $in: orders },
      },
      {
        $unset: { voucherApplied: '' },
      }
    )

    orders = await OrderModel.find().lean()
    orders = orders.filter(order => order.voucherApplied === '').map(order => order._id)

    return NextResponse.json({ orders, message: 'Cập nhật thành công' }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
