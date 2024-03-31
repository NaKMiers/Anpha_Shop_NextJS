import { connectDatabase } from '@/config/databse'
import ProductModel from '@/models/ProductModel'
import { connection } from 'mongoose'
import { NextResponse } from 'next/server'

// [GET]: /product/best-seller
export async function GET() {
  console.log('- Get Best Seller Products -')

  // connect to database
  await connectDatabase()

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
  } finally {
    // close connection
    connection.close()
  }
}
