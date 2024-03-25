import { connectDatabase } from '@/config/databse'
import CartItemModel from '@/models/CartItemModel'
import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

// Connect to database
connectDatabase()

// [DELETE]: /cart/:id/delete
export async function GET(req: NextRequest) {
  console.log(' - Get Cart Length - ')

  // get userId to get user's cart
  const token = await getToken({ req, secret: process.env.JWT_SECRET })
  const userId = token?._id

  try {
    // get user's cart length
    const cartLength = await CartItemModel.countDocuments({ userId })

    // return response
    return NextResponse.json({ cartLength, message: 'Get cart length successfully' }, { status: 200 })
  } catch (err: any) {
    console.log(err.message)
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
