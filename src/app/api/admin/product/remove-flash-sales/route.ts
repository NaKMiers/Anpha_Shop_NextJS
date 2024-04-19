import { connectDatabase } from '@/config/database'
import FlashsaleModel from '@/models/FlashsaleModel'
import ProductModel from '@/models/ProductModel'
import { NextRequest, NextResponse } from 'next/server'

// Models: Product, Flashsale
import '@/models/FlashsaleModel'
import '@/models/ProductModel'

// [PATCH]: /admin/product/activate
export async function PATCH(req: NextRequest) {
  console.log('- Activate Products - ')

  try {
    // connect to database
    await connectDatabase()

    // get product ids to remove flash sales
    const { ids } = await req.json()

    // update products from database
    await ProductModel.updateMany({ _id: { $in: ids } }, { $set: { flashsale: null } })

    // get updated products
    const updatedProducts = await ProductModel.find({ _id: { $in: ids } }).lean()

    if (!updatedProducts.length) {
      throw new Error('No product found')
    }

    // update flash sale product quantity
    await FlashsaleModel.updateMany(
      { _id: { $in: updatedProducts.map(product => product.flashsale) } },
      { $inc: { productQuantity: -1 } }
    )

    // return response
    return NextResponse.json(
      {
        updatedProducts,
        message: `Flash sale of product ${updatedProducts
          .map(product => `"${product.title}"`)
          .reverse()
          .join(', ')} ${updatedProducts.length > 1 ? 'have' : 'has'} been removed`,
      },
      { status: 200 }
    )
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
