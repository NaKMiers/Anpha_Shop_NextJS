import ProductModel from '@/models/ProductModel'
import '@/models/FlashsaleModel'
import { NextRequest, NextResponse } from 'next/server'
import { connectDatabase } from '@/config/database'

// [POST]: /cart/update-local-cart
export async function POST(req: NextRequest) {
  console.log('- Update Local Cart -')

  try {
    // connect database
    await connectDatabase()

    // get product ids to get corresponding cart items
    const { ids } = await req.json()

    // get produts to update cart
    const products = await ProductModel.find({ _id: { $in: ids } })
      .populate('flashsale')
      .lean()

    return NextResponse.json({ products, message: 'Update Local Cart Successfully' }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
