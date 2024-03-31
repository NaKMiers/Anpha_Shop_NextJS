import { connectDatabase } from '@/config/databse'
import CartItemModel from '@/models/CartItemModel'
import { IProduct } from '@/models/ProductModel'
import { connection } from 'mongoose'
import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

// [PATCH]: /cart/:id/set-quantity
export async function PATCH(req: NextRequest, { params: { id } }: { params: { id: string } }) {
  console.log(' - Set Cart Quantity - ')

  // connect to database
  await connectDatabase()

  // get user id
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  const userId = token?._id

  const { quantity } = await req.json()

  try {
    // check if user is authenticated
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    // get cart item to update
    let cartItem: any = await CartItemModel.findById(id).populate('productId').lean()

    const product: IProduct = cartItem?.productId

    // quantity must be > 0
    if (quantity < 1) {
      return NextResponse.json({ message: 'Số lượng tối thiểu là 1' }, { status: 400 })
    }

    // quantity must be <= product stock
    if (quantity > product?.stock) {
      return NextResponse.json({ message: 'Số lượng sản phẩm không đủ' }, { status: 400 })
    }

    // update cart item
    const updatedCartItem = await CartItemModel.findByIdAndUpdate(
      cartItem?._id,
      { quantity },
      { new: true }
    )

    console.log('updatedCartItem: ', updatedCartItem)

    // return response
    return NextResponse.json(
      { updatedCartItem, message: 'Cập nhật số lượng sản phẩm thành công' },
      { status: 200 }
    )
  } catch (err: any) {
    console.log(err.message)
    return NextResponse.json({ message: err.message }, { status: 500 })
  } finally {
    // close connection
    connection.close()
  }
}
