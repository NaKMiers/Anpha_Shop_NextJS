import { connectDatabase } from '@/config/databse'
import ProductModel from '@/models/ProductModel'
import { NextResponse } from 'next/server'

// Connect to database
connectDatabase()

// [GET]: /flashsale
export async function GET() {
  console.log('- Get Flash Sale Products -')

  try {
    // get all products from database
    const products = await ProductModel.find({
      active: true,
      flashsale: { $exists: true, $ne: null },
    })
      .sort({ createdAt: -1 })
      .populate('flashsale')
      .lean()

    // return flashsale products
    return NextResponse.json(
      { products, message: 'Get flash sale products successfully!' },
      { status: 200 }
    )
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
