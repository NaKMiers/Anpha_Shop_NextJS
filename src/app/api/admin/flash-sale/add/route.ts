import { connectDatabase } from '@/config/databse'
import FlashsaleModel from '@/models/FlashsaleModel'
import ProductModel from '@/models/ProductModel'
import { NextRequest, NextResponse } from 'next/server'

// Connect to database
connectDatabase()

// [POST]: /admin/flash-sale/add
export async function POST(req: NextRequest) {
  console.log('- Add Flash Sale -')

  // get data to create flash sale
  const { type, value, begin, timeType, duration, expire, appliedProducts } = await req.json()

  try {
    // create new flash sale in databasee
    const newFlashSale = new FlashsaleModel({
      type,
      value,
      begin,
      timeType,
      duration: timeType === 'loop' ? duration : null,
      expire: timeType === 'once' ? expire : null,
    })

    // save new flash sale to database
    await newFlashSale.save()

    // update flashsale field for all products in applyProducts
    await ProductModel.updateMany(
      { _id: { $in: appliedProducts } }, // Match products by their IDs
      { $set: { flashsale: newFlashSale._id } } // Set the flashsale field
    )

    // get productQuantity of the products have just applied flash sale
    const productQuantity = await ProductModel.countDocuments({ flashsale: newFlashSale._id })

    // update flash sale quantity
    await FlashsaleModel.findByIdAndUpdate(newFlashSale._id, { $set: { productQuantity } })

    // return new flash sale
    return NextResponse.json(
      { message: `Flash sale (${newFlashSale.value}) has been created` },
      { status: 201 }
    )
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
