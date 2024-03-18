import { connectDatabase } from '@/config/databse'
import ProductModel from '@/models/ProductModel'
import { NextResponse } from 'next/server'

// Connect to database
connectDatabase()

export const config = {
  api: {
    bodyParser: false,
  },
}

// [GET]: /admin/product/all
export async function GET() {
  console.log('- Get All Products -')

  try {
    // get all products from database
    const products = await ProductModel.find({})
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
