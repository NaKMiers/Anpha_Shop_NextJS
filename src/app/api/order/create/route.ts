import { connectDatabase } from '@/config/databse'
import CartItemModel from '@/models/CartItemModel'
import OrderModel from '@/models/OrderModel'
import { notifyNewOrderToAdmin } from '@/utils/sendMail'
import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'
import { FullyCartItem } from '../../cart/route'
import handleDeliverOrder from '@/utils/handleDeliverOrder'

// Connect to database
connectDatabase()

// [POST]: /order/create
export async function POST(req: NextRequest) {
  console.log('- Create Order -')

  // get data to create order
  const asd = await req.json()
  const { code, email, total, voucherApplied, discount, items, paymentMethod } = asd

  // get user id
  const token = await getToken({ req, secret: process.env.JWT_SECRET })
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

    // auto deliver order
    if (process.env.IS_AUTO_DELIVER === 'YES') {
      const response: any = await handleDeliverOrder(newOrder._id)

      if (response.isError) {
        console.log('AUTO DELIVERED FAILURE!!!')
        return NextResponse.json({ message: 'Auto Deliver Failure' }, { status: 500 })
      } else {
        console.log('Auto Deliver For Balance Payment Method Successfully')
      }
    }

    // if user logined => cart is database cart => Delete cart items
    if (userId) {
      // delete cart items from database
      const cartItemIds = items.map((item: FullyCartItem) => item._id)
      await CartItemModel.deleteMany({
        _id: { $in: cartItemIds },
      })
    }
    // return new order
    return NextResponse.json({ order: newOrder }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
