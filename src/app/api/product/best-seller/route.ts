import { connectDatabase } from '@/config/databse'
import '@/models/CategoryModel'
import ProductModel from '@/models/ProductModel'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// [GET]: /product/best-seller
export async function GET() {
  console.log('- Get Best Seller Products -')

  try {
    // connect to database
    await connectDatabase()

    // get 10 best seller products by sold field
    const products = await ProductModel.find({ active: true })
      .populate('category')
      .sort({ sold: -1 })
      .limit(10)
      .lean()

    // return products
    return NextResponse.json({ products }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
