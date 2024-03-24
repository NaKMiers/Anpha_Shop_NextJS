import { connectDatabase } from '@/config/databse'
import ProductModel from '@/models/ProductModel'
import { NextResponse } from 'next/server'

// Connect to database
connectDatabase()

// [GET]: /product/best-seller
export async function GET() {
  console.log('- Get Best Seller Products -')

  try {
    // get 10 best seller products by sold field
    const products = await ProductModel.find({})
      .sort({ sold: -1 })
      .limit(10)
      .populate('category', 'title')
      .lean()

    // return products
    return NextResponse.json({ products }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
