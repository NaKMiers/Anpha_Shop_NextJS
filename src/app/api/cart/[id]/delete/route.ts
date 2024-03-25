import { connectDatabase } from '@/config/databse'
import CartItemModel from '@/models/CartItemModel'
import { NextRequest, NextResponse } from 'next/server'

// Connect to database
connectDatabase()

// [DELETE]: /cart/:id/delete
export async function DELETE(req: NextRequest, { params: { id } }: { params: { id: string } }) {
  console.log(' - Delete Cart Item - ')

  // get cart item id
  console.log(id)

  try {
    // delete cart item from database
    await CartItemModel.findByIdAndDelete(id, { new: true })

    // calculate new cart length

    // return just deleted cart item
    // return NextResponse.json({ deletedCartItem,cartLength }, { status: 200 })
  } catch (err: any) {
    console.log(err.message)
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
