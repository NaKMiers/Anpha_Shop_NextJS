import { connectDatabase } from '@/config/databse'
import CartItemModel from '@/models/CartItemModel'
import '@/models/ProductModel'
import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

// [DELETE]: /cart/:id/delete
export async function DELETE(req: NextRequest, { params: { id } }: { params: { id: string } }) {
  console.log(' - Delete Cart Item - ')

  // connect to database
  await connectDatabase()

  // get user id
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  const userId = token?._id

  try {
    // check if user is authenticated
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    // delete cart item from database
    const deletedCartItem: any = await CartItemModel.findByIdAndDelete(id, { new: true })
      .populate('productId')
      .lean()

    // calculate new cart length
    const cartLength = await CartItemModel.countDocuments({ userId })

    // return just deleted cart item
    return NextResponse.json(
      {
        deletedCartItem,
        cartLength,
        message: `Đã xóa "${deletedCartItem.productId.title}" khỏi giỏ hàng`,
      },
      { status: 200 }
    )
  } catch (err: any) {
    console.log(err)
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
