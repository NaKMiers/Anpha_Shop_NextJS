import { connectDatabase } from '@/config/databse'
import '@/models/CategoryModel'
import ProductModel from '@/models/ProductModel'
import '@/models/TagModel'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// [GET]: /admin/product/force-all
export async function GET() {
  console.log('- Get Force All Products -')

  try {
    // connect to database
    await connectDatabase()

    // get all products from database
    const products = await ProductModel.find()
      .select('title images')
      .populate({
        path: 'tags',
        select: 'title',
      })
      .populate({
        path: 'category',
        select: 'title',
      })
      .sort({ createdAt: -1 })
      .lean()

    console.log('products: ', products)

    // return all products
    return NextResponse.json({ products }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
