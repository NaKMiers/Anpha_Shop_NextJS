import { connectDatabase } from '@/config/database'
import FlashsaleModel from '@/models/FlashsaleModel'
import ProductModel from '@/models/ProductModel'
import { NextRequest, NextResponse } from 'next/server'

// Models: Product, Flash Sale
import '@/models/FlashsaleModel'
import '@/models/ProductModel'

// [PUT]: /api/admin/flash-sale/:id/edit
export async function PUT(req: NextRequest, { params: { id } }: { params: { id: string } }) {
  console.log('- Edit Flash sale -')

  try {
    // connect to database
    await connectDatabase()

    // get data to create flash sale
    const { type, value, begin, timeType, duration, expire, appliedProducts } = await req.json()

    // update flashsale
    const updatedFlashSale = await FlashsaleModel.findByIdAndUpdate(id, {
      $set: {
        type,
        value,
        begin,
        timeType,
        duration: timeType === 'loop' ? duration : null,
        expire: timeType === 'once' ? expire : null,
      },
    })

    // get products that have been applied by the updated flash sale before
    const originalAppliedProducts = await ProductModel.find({ flashsale: updatedFlashSale._id }).select(
      '_id'
    )

    // get products that have been removed from the updated flash sale
    const removedProducts = originalAppliedProducts.filter(id => !appliedProducts.includes(id))
    const setProducts = appliedProducts.filter((id: string) => !originalAppliedProducts.includes(id))

    await ProductModel.updateMany({ _id: { $in: removedProducts } }, { $set: { flashsale: null } })
    await ProductModel.updateMany(
      { _id: { $in: setProducts } },
      { $set: { flashsale: updatedFlashSale._id } }
    )

    const productQuantity = await ProductModel.countDocuments({ flashsale: updatedFlashSale._id })

    // update flash sale quantity
    await FlashsaleModel.findByIdAndUpdate(updatedFlashSale._id, { $set: { productQuantity } })

    // return new flash sale
    return NextResponse.json(
      { message: `Flash sale (${updatedFlashSale.value}) has been updated` },
      { status: 201 }
    )
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
