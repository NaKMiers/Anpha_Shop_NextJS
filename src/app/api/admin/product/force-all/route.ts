import { connectDatabase } from '@/config/databse'
import '@/models/CategoryModel'
import ProductModel from '@/models/ProductModel'
import '@/models/TagModel'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// [GET]: /admin/product/force-all
export async function GET() {
  console.log('- Get Force All Products -')

  // connect to database
  await connectDatabase()

  try {
    // get all products from database
    const products = await ProductModel.find().populate('tags category').sort({ createdAt: -1 }).lean()

    // return all products
    return NextResponse.json({ products }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
