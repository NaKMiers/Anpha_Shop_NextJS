import { connectDatabase } from '@/config/databse'
import ProductModel from '@/models/ProductModel'
import { NextResponse } from 'next/server'
import '@/models/CategoryModel'

export const dynamic = 'force-dynamic'

// [GET]: /product/best-seller
export async function GET() {
  console.log('- Get Best Seller Products -')

  // connect to database
  await connectDatabase()

  try {
    // get 10 best seller products by sold field
    const products = await ProductModel.find({ active: true })
      .populate('category', 'title')
      .sort({ sold: -1 })
      .limit(10)
      .lean()

    // return products
    return NextResponse.json({ products }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
