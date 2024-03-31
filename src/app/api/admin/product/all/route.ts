import { connectDatabase } from '@/config/databse'
import '@/models/CategoryModel'
import ProductModel from '@/models/ProductModel'
import '@/models/TagModel'
import { NextResponse } from 'next/server'

// [GET]: /admin/product/all
export async function GET() {
  console.log('- Get All Products -')

  // connect to database
  connectDatabase()

  try {
    // get all products from database
    const products = await ProductModel.find()
      .sort({ createdAt: -1 })
      .populate('tags')
      .populate('category')
      .lean()

    // return all products
    return NextResponse.json({ products }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
