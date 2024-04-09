import ProductModel from '@/models/ProductModel'
import '@/models/FlashsaleModel'
import { NextRequest, NextResponse } from 'next/server'

// [POST]: /cart/update-local-cart
export async function POST(req: NextRequest) {
  console.log('- Update Local Cart -')

  // get product ids to get corresponding cart items
  const { ids } = await req.json()

  try {
    // get produts to update cart
    const products = await ProductModel.find({ _id: { $in: ids } })
      .populate('flashsale')
      .lean()

    return NextResponse.json({ products, message: 'Update Local Cart Successfully' }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
