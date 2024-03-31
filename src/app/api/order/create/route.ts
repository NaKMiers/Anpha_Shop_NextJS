import { connectDatabase } from '@/config/databse'
import CartItemModel from '@/models/CartItemModel'
import OrderModel from '@/models/OrderModel'
import { notifyNewOrderToAdmin } from '@/utils/sendMail'
import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'
import { FullyCartItem } from '../../cart/route'
import handleDeliverOrder from '@/utils/handleDeliverOrder'

// [POST]: /order/create
export async function POST(req: NextRequest) {
  console.log('- Create Order -')

  // connect to database
  connectDatabase()

  // get data to create order
  const asd = await req.json()
  const { code, email, total, voucherApplied, discount, items, paymentMethod } = asd

  // get user id
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  const userId = token?._id

  try {
    // create new order
    const newOrder = new OrderModel({
      code,
      userId,
      email,
      voucherApplied,
      discount,
      total,
      items,
      paymentMethod,
    })
    // save new order
    await newOrder.save()

    // notify new order to admin
    notifyNewOrderToAdmin(newOrder)

    // if user logined => cart is database cart => Delete cart items
    let removedCartItems = []
    if (userId) {
      // delete cart items from database
      removedCartItems = items.map((item: FullyCartItem) => item._id)
      await CartItemModel.deleteMany({
        _id: { $in: removedCartItems },
      })
    }

    // auto deliver order
    let response: any = null
    if (process.env.IS_AUTO_DELIVER === 'YES') {
      response = await handleDeliverOrder(newOrder._id)
    }

    // return new order
    const message =
      response && response.isError
        ? 'Đơn hàng đang được xử lý, xin vui lòng chờ'
        : 'Đơn hàng đã được giao thành công'

    return NextResponse.json({ removedCartItems, message }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
