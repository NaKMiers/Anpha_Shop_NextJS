import { connectDatabase } from '@/config/databse'
import CartItemModel, { ICartItem } from '@/models/CartItemModel'
import '@/models/FlashsaleModel'
import '@/models/ProductModel'
import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'
import { FullyProduct } from '../product/[slug]/route'

export const dynamic = 'force-dynamic'

export type FullyCartItem = ICartItem & {
  product: FullyProduct
}

// [GET]: /cart
export async function GET(req: NextRequest) {
  console.log('- Get User Cart')

  // connect to database
  await connectDatabase()

  // get userId to get user's cart
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  const userId = token?._id

  try {
    // checkt if user logged in
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    // get cart from database
    let cart = await CartItemModel.find({ userId })
      .populate({
        path: 'productId',
        populate: {
          path: 'flashsale',
          model: 'flashsale',
        },
      })
      .lean()

    cart = cart.map(cartItem => ({
      ...cartItem,
      product: cartItem.productId,
      productId: cartItem.productId._id,
    }))

    // return user's cart
    return NextResponse.json({ cart }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
